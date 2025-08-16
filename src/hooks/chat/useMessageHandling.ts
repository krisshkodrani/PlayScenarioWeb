import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, ScenarioInstance, Scenario } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { config } from '@/lib/config';

// Helper to infer mode based on message content prefix when backend omits mode
const inferModeFromContent = (text?: string): 'chat' | 'action' => {
  const t = (text || '').trim().toUpperCase();
  if (t.startsWith('ACTION ')) return 'action';
  if (t.startsWith('CHAT ')) return 'chat';
  return 'chat';
};

export const useMessageHandling = (
  instanceId: string,
  instance: ScenarioInstance | null,
  scenario: Scenario | null
) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const initializationRef = useRef<Promise<void> | null>(null);
  const isInitializedRef = useRef(false);
  // Track the expected AI turn if the response content will arrive later via realtime
  const pendingTurnRef = useRef<number | null>(null);
  // Track messages created via API response to prevent realtime duplicates
  const apiCreatedMessageIds = useRef<Set<string>>(new Set());

  // Single source of truth for message ordering
  const sortMessages = useCallback((messages: Message[]): Message[] => {
    return messages.sort((a, b) => {
      // Primary: sequence_number (guaranteed unique per instance)
      if (a.sequence_number && b.sequence_number) {
        return a.sequence_number - b.sequence_number;
      }
      
      // Fallback: timestamp + turn_number for messages without sequence
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      if (timeA !== timeB) return timeA - timeB;
      
      return a.turn_number - b.turn_number;
    });
  }, []);

  // Fetch existing messages
  const fetchMessages = useCallback(async () => {
    if (!instanceId) return;

    try {
      logger.debug('Chat', 'Fetching messages for instance', { instanceId });
      
      const { data, error } = await supabase
        .from('instance_messages')
        .select('*')
        .eq('instance_id', instanceId)
        .order('sequence_number', { ascending: true }); // Use sequence_number for perfect ordering

      if (error) throw error;
      
      // Deduplicate messages by content and turn_number for system & narration messages
      const deduplicatedData = data?.reduce((acc: any[], current: any) => {
        const type = current.message_type;
        if (type === 'system' || type === 'narration') {
          const isDuplicate = acc.some((msg: any) => 
            msg.message_type === type && 
            msg.message === current.message &&
            msg.turn_number === current.turn_number
          );
          if (!isDuplicate) {
            acc.push({
              ...current,
              message_type: current.message_type as 'user_message' | 'ai_response' | 'system' | 'narration'
            });
          }
        } else {
          // For non-system/narration messages, check by ID
          const isDuplicate = acc.some((msg: any) => msg.id === current.id);
          if (!isDuplicate) {
            acc.push({
              ...current,
              message_type: current.message_type as 'user_message' | 'ai_response' | 'system' | 'narration',
              // Ensure mode exists (infer from content if missing)
              mode: current.mode ?? inferModeFromContent(current.message)
            });
          }
        }
        return acc;
      }, []) || [];

      logger.info('Chat', 'Messages fetched successfully', { 
        instanceId, 
        messageCount: deduplicatedData.length,
        duplicatesRemoved: (data?.length || 0) - deduplicatedData.length
      });

      // Apply sorting to ensure perfect ordering
      const sortedMessages = sortMessages(deduplicatedData);
      setMessages(sortedMessages);
      return sortedMessages.length;
    } catch (err) {
      logger.error('Chat', 'Failed to fetch messages', err, { instanceId });
      throw err;
    }
  }, [instanceId, sortMessages]);

  // Initialize scenario - simplified since backend now handles initial narration seeding
  const initializeScenario = useCallback(async () => {
    if (!instance || !scenario || !user || isInitializedRef.current) return;

    if (initializationRef.current) {
      await initializationRef.current;
      return;
    }

    initializationRef.current = (async () => {
      try {
        logger.debug('Chat', 'Scenario initialization', { 
          instanceId, 
          scenarioId: scenario.id 
        });
        
        // Backend now handles initial scene seeding during API calls
        // This just marks initialization as complete
        isInitializedRef.current = true;
      } catch (err) {
        logger.error('Chat', 'Failed to initialize scenario', err, { instanceId });
        toast({
          title: 'Error',
          description: 'Failed to initialize scenario',
          variant: 'destructive'
        });
      }
    })();

    await initializationRef.current;
  }, [instance, scenario, user, instanceId, toast]);

  // Send a message
  const sendMessage = useCallback(
    async (messageContent: string, mode: 'chat' | 'action' = 'chat'): Promise<void> => {
      if (!instance || !user) {
        logger.warn('Chat:SendMessage', 'Send message aborted, no instance or user.', { hasInstance: !!instance, hasUser: !!user });
        return;
      }

      const optimisticId = `user-${Date.now()}`;

      try {
        // Optimistically render the user's message immediately
        const optimisticUserMessage: Message = {
          id: optimisticId,
          sender_name: (user as any)?.user_metadata?.username || 'You',
          message: messageContent,
          turn_number: instance.current_turn,
          message_type: 'user_message',
          timestamp: new Date().toISOString(),
          mode
        };
        setMessages(prev => [...prev, optimisticUserMessage]);

        // Set typing state immediately and log that we are waiting for the realtime message
        setIsTyping(true);
        const expectedTurn = (instance?.current_turn || 0) + 1;
        pendingTurnRef.current = expectedTurn;

        logger.info('Chat:SendMessage', 'Sending message to backend API.', {
          instanceId,
          messageLength: messageContent.length,
          currentTurn: instance.current_turn,
          expectedTurn,
          mode
        });

        // Build request payload with recent history to reduce backend DB lookups
        const payload = {
          scenario_instance_id: instanceId,
          user_message: messageContent,
          message_mode: mode,
          conversation_history: messages.slice(-10).map(
            ({ id, sender_name, message, message_type, timestamp, mode: msgMode }) => ({
              id,
              sender_name,
              message,
              message_type,
              timestamp,
              mode: msgMode
            })
          )
        };

        const res = await fetch(
          `${config.api.baseUrl}/v1/chat/scenario-completions`,
          {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              ...(config.isDevelopment && { 'Access-Control-Allow-Origin': '*' })
            },
            body: JSON.stringify(payload)
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          logger.error('Chat:SendMessage', 'API request failed', null, { 
            status: res.status,
            statusText: res.statusText,
            errorText
          });
          throw new Error(`API request failed: ${res.status} ${res.statusText}`);
        }

        // NEW: On success, we no longer process the response body.
        // We simply log success and wait for the realtime subscription to deliver the new messages.
        logger.info('Chat:SendMessage', 'API request successful. Waiting for realtime message.', { instanceId, expectedTurn });

      } catch (err) {
        // Remove optimistic message and hide typing on failure
        setMessages(prev => prev.filter(m => m.id !== optimisticId));
        setIsTyping(false);
        pendingTurnRef.current = null; // Clear pending turn on error

        logger.error('Chat:SendMessage', 'Failed to send message', err, { instanceId });
        toast({
          title: 'Error',
          description: 'Failed to send message. Please try again.',
          variant: 'destructive'
        });
        throw err;
      }
    },
    [instance, user, instanceId, toast, sortMessages, messages]
  );

  // Function to check if a realtime message is a duplicate of an API-created message
  const isApiDuplicate = useCallback((message: Message): boolean => {
    if (message.message_type !== 'ai_response') return false;
    
    // Create the same content hash we used when tracking API messages
    const contentHash = `${message.sender_name}:${message.turn_number}:${message.message.substring(0, 100)}`;
    const isDuplicate = apiCreatedMessageIds.current.has(contentHash);
    
    if (isDuplicate) {
      console.log(`🚫 Blocking duplicate realtime message:`, {
        hash: contentHash.substring(0, 50) + '...',
        sender: message.sender_name,
        turn: message.turn_number
      });
    }
    
    return isDuplicate;
  }, []);

  const addMessage = useCallback((newMessage: Message) => {
    logger.debug('Chat', 'addMessage called', {
      messageId: newMessage.id,
      messageType: newMessage.message_type,
      sender: newMessage.sender_name,
      sequence: newMessage.sequence_number,
      currentIsTyping: isTyping
    });

    // Check if this is a duplicate of an API-created message
    if (isApiDuplicate(newMessage)) {
      console.log('🔁 Ignoring duplicate API-created message from realtime');
      return; // Skip processing this message
    }

    // For AI/system/narration messages, immediately end typing state first
    if (newMessage.message_type !== 'user_message') {
      logger.debug('Chat', 'Ending typing for non-user message');
      setIsTyping(false);
      pendingTurnRef.current = null;
    }

    // Then update messages with perfect ordering
    setMessages(prev => {
      // Replace optimistic user message with server one if applicable
      if (newMessage.message_type === 'user_message') {
        const reverseIndex = [...prev].reverse().findIndex(m =>
          m.message_type === 'user_message' &&
          typeof m.id === 'string' && m.id.startsWith('user-') &&
          m.message === newMessage.message
        );
        if (reverseIndex !== -1) {
          const idx = prev.length - 1 - reverseIndex;
          const optimistic = prev[idx];
          const next = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
          if (!next.find(msg => msg.id === newMessage.id)) {
            // Preserve optimistic.mode or infer if server did not send it
            const mergedUserMessage: Message = {
              ...newMessage,
              mode: newMessage.mode ?? optimistic.mode ?? inferModeFromContent(newMessage.message)
            };
            logger.debug('Chat', 'Replacing optimistic user message with server message', { 
              optimisticReplacedIndex: idx, 
              mode: mergedUserMessage.mode,
              sequence: mergedUserMessage.sequence_number
            });
            // Re-sort after replacement to ensure perfect ordering
            return sortMessages([...next, mergedUserMessage]);
          }
          return sortMessages(next);
        }
      }

      // Deduplicate by ID
      if (prev.find(msg => msg.id === newMessage.id)) {
        logger.debug('Chat', 'Duplicate message ignored', { messageId: newMessage.id });
        return prev;
      }

      // Deduplicate system/narration messages by content/turn
      if (newMessage.message_type === 'system' || newMessage.message_type === 'narration') {
        const dup = prev.find(msg => 
          msg.message_type === newMessage.message_type && 
          msg.message === newMessage.message &&
          msg.turn_number === newMessage.turn_number
        );
        if (dup) return prev;
      }

      logger.debug('Chat', 'New message added to list', {
        messageId: newMessage.id,
        messageType: newMessage.message_type,
        sender: newMessage.sender_name,
        sequence: newMessage.sequence_number
      });

      // For server user messages without mode, infer it to keep styling consistent
      const safeMessage: Message =
        newMessage.message_type === 'user_message'
          ? { ...newMessage, mode: newMessage.mode ?? inferModeFromContent(newMessage.message) }
          : newMessage;

      // Add and re-sort for perfect ordering
      return sortMessages([...prev, safeMessage]);
    });
  }, [isTyping, sortMessages, isApiDuplicate]);

  // Clear API message tracking when instance changes
  useEffect(() => {
    if (instanceId) {
      console.log('🧹 Clearing API message tracking for new instance:', instanceId);
      apiCreatedMessageIds.current.clear();
    }
  }, [instanceId]);

  return {
    messages,
    isTyping,
    fetchMessages,
    initializeScenario,
    sendMessage,
    addMessage,
    setMessages
  };
};
