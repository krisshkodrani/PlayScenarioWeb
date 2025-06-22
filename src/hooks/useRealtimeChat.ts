
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender_name: string;
  message: string;
  turn_number: number;
  message_type: string;
  timestamp: string;
}

interface ScenarioInstance {
  id: string;
  user_id: string;
  scenario_id: string;
  status: string;
  current_turn: number;
  started_at: string;
}

interface UseRealtimeChatProps {
  scenarioId: string;
}

export const useRealtimeChat = ({ scenarioId }: UseRealtimeChatProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [instance, setInstance] = useState<ScenarioInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Initialize or get existing scenario instance
  const initializeInstance = useCallback(async () => {
    if (!user) return;

    try {
      // Check if user has an active instance for this scenario
      const { data: existingInstance, error: fetchError } = await supabase
        .from('scenario_instances')
        .select('*')
        .eq('user_id', user.id)
        .eq('scenario_id', scenarioId)
        .eq('status', 'playing')
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingInstance) {
        setInstance(existingInstance);
      } else {
        // Create new instance
        const { data: newInstance, error: createError } = await supabase
          .from('scenario_instances')
          .insert({
            user_id: user.id,
            scenario_id: scenarioId,
            status: 'playing',
            current_turn: 0
          })
          .select()
          .single();

        if (createError) throw createError;
        setInstance(newInstance);
      }
    } catch (err) {
      console.error('Error initializing instance:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize chat');
    }
  }, [user, scenarioId]);

  // Fetch existing messages
  const fetchMessages = useCallback(async (instanceId: string) => {
    try {
      const { data, error } = await supabase
        .from('instance_messages')
        .select('*')
        .eq('instance_id', instanceId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (messageContent: string) => {
    if (!instance || !user) return;

    try {
      setIsTyping(true);
      
      const { error } = await supabase
        .from('instance_messages')
        .insert({
          instance_id: instance.id,
          sender_name: 'You',
          message: messageContent,
          turn_number: instance.current_turn + 1,
          message_type: 'user'
        });

      if (error) throw error;

      // Update instance turn count
      const { error: updateError } = await supabase
        .from('scenario_instances')
        .update({
          current_turn: instance.current_turn + 1
        })
        .eq('id', instance.id);

      if (updateError) throw updateError;

      setInstance(prev => prev ? { ...prev, current_turn: prev.current_turn + 1 } : null);
      
    } catch (err) {
      console.error('Error sending message:', err);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsTyping(false);
    }
  }, [instance, user, toast]);

  // Set up real-time subscription
  useEffect(() => {
    if (!instance) return;

    const channel = supabase
      .channel(`messages:${instance.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'instance_messages',
          filter: `instance_id=eq.${instance.id}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [instance]);

  // Initialize everything
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await initializeInstance();
    };

    if (user) {
      init();
    }
  }, [user, initializeInstance]);

  // Fetch messages when instance is ready
  useEffect(() => {
    if (instance) {
      fetchMessages(instance.id).finally(() => setLoading(false));
    }
  }, [instance, fetchMessages]);

  return {
    messages,
    instance,
    loading,
    error,
    isTyping,
    sendMessage
  };
};
