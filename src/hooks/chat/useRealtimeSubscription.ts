
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/chat';

export const useRealtimeSubscription = (
  instanceId: string,
  onNewMessage: (message: Message) => void
) => {
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageCountRef = useRef(0);

  // Polling fallback for messages
  const pollMessages = useCallback(async () => {
    if (!instanceId) return;

    try {
      const { data, error } = await supabase
        .from('instance_messages')
        .select('*')
        .eq('instance_id', instanceId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      
      // Only update if message count changed
      if (data && data.length !== lastMessageCountRef.current) {
        // Get new messages since last count
        const newMessages = data.slice(lastMessageCountRef.current);
        newMessages.forEach(onNewMessage);
        lastMessageCountRef.current = data.length;
      }
    } catch (err) {
      console.error('Polling error:', err);
    }
  }, [instanceId, onNewMessage]);

  // Set up real-time subscription and polling
  useEffect(() => {
    if (!instanceId) return;

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
          onNewMessage(newMessage);
          lastMessageCountRef.current += 1;
        }
      )
      .subscribe();

    // Set up polling fallback every 2 seconds
    pollingIntervalRef.current = setInterval(pollMessages, 2000);

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
