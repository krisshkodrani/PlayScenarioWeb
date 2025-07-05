
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';

export const useRealtimeSubscription = (
  instanceId: string,
  onNewMessage: (message: Message) => void
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
          newMessages.forEach(msg => {
            processedMessageIds.current.add(msg.id);
            onNewMessage(msg);
          });
          lastMessageCountRef.current = data.length;
        }
      }
    } catch (err) {
      console.error('Polling error:', err);
    }
  }, [instanceId, onNewMessage]);

  // Set up real-time subscription and polling
  useEffect(() => {
    if (!instanceId) return;

    // Clear processed messages when instance changes
    processedMessageIds.current.clear();

    // Set up real-time subscription
    const channel = supabase
      .channel(`messages:${instanceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'instance_messages',
          filter: `instance_id=eq.${instanceId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          // Only process if not already processed
          if (!processedMessageIds.current.has(newMessage.id)) {
            processedMessageIds.current.add(newMessage.id);
            onNewMessage(newMessage);
            lastMessageCountRef.current += 1;
          }
        }
      )
      .subscribe();

    // Set up polling fallback every 3 seconds (increased from 2 to reduce load)
    pollingIntervalRef.current = setInterval(pollMessages, 3000);

    // Initial poll to catch up with any existing messages
    pollMessages();

    return () => {
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
