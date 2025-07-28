
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, ScenarioInstance, Scenario } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { config } from '@/lib/config';

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

  // Fetch existing messages
  const fetchMessages = useCallback(async () => {
    if (!instanceId) return;

    try {
      logger.debug('Chat', 'Fetching messages for instance', { instanceId });
      
      const { data, error } = await supabase
        .from('instance_messages')
        .select('*')
        .eq('instance_id', instanceId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      
      // Deduplicate messages by content and turn_number for system messages
      const deduplicatedData = data?.reduce((acc: any[], current: any) => {
        // For system messages, check for duplicates by content and turn_number
        if (current.message_type === 'system') {
          const isDuplicate = acc.some(msg => 
            msg.message_type === 'system' && 
            msg.message === current.message &&
            msg.turn_number === current.turn_number
          );
          if (!isDuplicate) {
            acc.push({
              ...current,
              message_type: current.message_type as 'user_message' | 'ai_response' | 'system'
            });
          }
        } else {
          // For non-system messages, check by ID
          const isDuplicate = acc.some(msg => msg.id === current.id);
          if (!isDuplicate) {
            acc.push({
              ...current,
              message_type: current.message_type as 'user_message' | 'ai_response' | 'system'
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

      setMessages(deduplicatedData);
      return deduplicatedData.length;
    } catch (err) {
      logger.error('Chat', 'Failed to fetch messages', err, { instanceId });
      throw err;
    }
  }, [instanceId]);

  // Initialize scenario with first message if no messages exist
  const initializeScenario = useCallback(async () => {
    if (!instance || !scenario || !user || isInitializedRef.current) return;

    // If initialization is already in progress, wait for it
    if (initializationRef.current) {
      await initializationRef.current;
      return;
    }

    // Start initialization
    initializationRef.current = (async () => {
      try {
        logger.debug('Chat', 'Checking if scenario needs initialization', { 
          instanceId, 
          scenarioId: scenario.id 
        });
        
        // Check if any messages exist
        const { count, error: countError } = await supabase
          .from('instance_messages')
          .select('*', { count: 'exact', head: true })
          .eq('instance_id', instanceId);

        if (countError) throw countError;

        // If no messages exist, create the initial scene prompt message
        if (count === 0) {
          logger.info('Chat', 'Creating initial scenario message', { instanceId });
          
          const { error } = await supabase
            .from('instance_messages')
            .insert({
              instance_id: instanceId,
              sender_name: 'System',
              message: scenario.initial_scene_prompt,
              turn_number: 0,
              message_type: 'system'
            });

          if (error) throw error;
          
          logger.info('Chat', 'Initial scenario message created successfully', { instanceId });
        } else {
          logger.debug('Chat', 'Messages already exist, skipping initialization', { 
            instanceId, 
            existingMessageCount: count 
          });
        }
        
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
    async (messageContent: string, mode: 'chat' | 'action' = 'chat') => {
      if (!instance || !user) return;

      try {
        setIsTyping(true);

        logger.debug('Chat', 'Sending message to backend', {
          instanceId,
          messageLength: messageContent.length,
          currentTurn: instance.current_turn,
          apiUrl: config.api.baseUrl
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
          logger.error('Chat', 'API request failed', null, { 
            status: res.status,
            statusText: res.statusText,
            errorText
          });
          throw new Error(`API request failed: ${res.status} ${res.statusText}`);
        }

        // Parse response to retrieve updated turn number and character data
        const data = await res.json();

        logger.info('Chat', 'Message sent successfully', {
          instanceId,
          newTurn: data.turn_number || data.current_turn
        });

        // Check if response contains rich character data
        if (data.character_name && data.content) {
          // Create enhanced message with character data
          const enhancedMessage: Message = {
            id: `ai-${Date.now()}`,
            sender_name: data.character_name,
            message: data.content,
            turn_number: data.current_turn || data.turn_number || (instance?.current_turn || 0) + 1,
            message_type: 'ai_response',
            timestamp: new Date().toISOString(),
            mode: mode, // Include the mode for AI responses
            character_name: data.character_name,
            response_type: data.response_type,
            internal_state: data.internal_state,
            suggested_follow_ups: data.suggested_follow_ups,
            metrics: data.metrics,
            flags: data.flags
          };

          // Add the enhanced message immediately
          addMessage(enhancedMessage);
        }

        return { current_turn: data.current_turn || data.turn_number };
      
      } catch (err) {
        logger.error('Chat', 'Failed to send message', err, { instanceId });
        toast({
          title: 'Error',
          description: 'Failed to send message. Please try again.',
          variant: 'destructive'
        });
        throw err;
      } finally {
        setIsTyping(false);
      }
    },
    [instance, user, instanceId, messages, toast]
  );

  const addMessage = useCallback((newMessage: Message) => {
    setMessages(prev => {
      // Check for exact duplicates by ID
      if (prev.find(msg => msg.id === newMessage.id)) {
        logger.debug('Chat', 'Duplicate message ignored', { messageId: newMessage.id });
        return prev;
      }
      
      // For system messages, also check for content duplicates
      if (newMessage.message_type === 'system') {
        const contentDuplicate = prev.find(msg => 
          msg.message_type === 'system' && 
          msg.message === newMessage.message &&
          msg.turn_number === newMessage.turn_number
        );
        if (contentDuplicate) {
          logger.debug('Chat', 'Duplicate system message ignored', { 
            messageType: newMessage.message_type,
            turnNumber: newMessage.turn_number 
          });
          return prev;
        }
      }
      
      logger.debug('Chat', 'New message added', { 
        messageId: newMessage.id,
        messageType: newMessage.message_type,
        sender: newMessage.sender_name 
      });
      
      return [...prev, newMessage];
    });
  }, []);

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
