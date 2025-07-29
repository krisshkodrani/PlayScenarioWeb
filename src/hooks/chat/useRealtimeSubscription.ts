
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, ScenarioInstance } from '@/types/chat';
import { logger } from '@/lib/logger';

export const useRealtimeSubscription = (
  instanceId: string,
  onNewMessage: (message: Message) => void,
  onInstanceUpdate?: (instance: Partial<ScenarioInstance>) => void
) => {
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageCountRef = useRef(0);
  const processedMessageIds = useRef<Set<string>>(new Set());

  // Enhanced polling fallback for messages with deduplication
  const pollMessages = useCallback(async () => {
    if (!instanceId) return;

    try {
      const { data, error } = await supabase
        .from('instance_messages')
        .select('*')
        .eq('instance_id', instanceId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      
      if (data) {
        // Process only new messages that haven't been processed yet
        const newMessages = data.filter(msg => !processedMessageIds.current.has(msg.id));
        
        if (newMessages.length > 0) {
          logger.debug('Chat', 'Polling found new messages', { 
            instanceId, 
            newMessageCount: newMessages.length,
            totalMessages: data.length 
          });
          
          newMessages.forEach(msg => {
            processedMessageIds.current.add(msg.id);
            onNewMessage({
              ...msg,
              message_type: msg.message_type as 'user_message' | 'ai_response' | 'system'
            });
          });
          lastMessageCountRef.current = data.length;
        }
      }
    } catch (err) {
      logger.error('Chat', 'Message polling failed', err, { instanceId });
    }
  }, [instanceId, onNewMessage]);

  // Set up real-time subscription and polling
  useEffect(() => {
    if (!instanceId) return;

    logger.info('Chat', 'Setting up realtime subscription', { instanceId });

    // Clear processed messages when instance changes
    processedMessageIds.current.clear();

    // Set up real-time subscription for messages
    const channel = supabase
      .channel(`chat:${instanceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'instance_messages',
          filter: `instance_id=eq.${instanceId}`
        },
        (payload) => {
          const rawMessage = payload.new as any;
          const newMessage = {
            ...rawMessage,
            message_type: rawMessage.message_type as 'user_message' | 'ai_response' | 'system'
          } as Message;
          
          // Only process if not already processed
          if (!processedMessageIds.current.has(newMessage.id)) {
            logger.debug('Chat', 'Realtime message received', { 
              instanceId,
              messageId: newMessage.id,
              sender: newMessage.sender_name 
            });
            
            processedMessageIds.current.add(newMessage.id);
            onNewMessage(newMessage);
            lastMessageCountRef.current += 1;
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'scenario_instances',
          filter: `id=eq.${instanceId}`
        },
        (payload) => {
          if (onInstanceUpdate && payload.new) {
            logger.debug('Chat', 'Instance update received', { 
              instanceId,
              updates: payload.new 
            });
            onInstanceUpdate(payload.new as Partial<ScenarioInstance>);
          }
        }
      )
      .subscribe();

    // Set up polling fallback every 3 seconds (increased from 2 to reduce load)
    pollingIntervalRef.current = setInterval(pollMessages, 3000);

    // Initial poll to catch up with any existing messages
    pollMessages();

    return () => {
      logger.debug('Chat', 'Cleaning up realtime subscription', { instanceId });
      supabase.removeChannel(channel);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [instanceId, pollMessages, onNewMessage]);

  return {
    lastMessageCountRef
  };
};
