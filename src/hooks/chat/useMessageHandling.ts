
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, ScenarioInstance, Scenario } from '@/types/chat';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useMessageHandling = (
  instanceId: string,
  instance: ScenarioInstance | null,
  scenario: Scenario | null
) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Fetch existing messages
  const fetchMessages = useCallback(async () => {
    if (!instanceId) return;

    try {
      const { data, error } = await supabase
        .from('instance_messages')
        .select('*')
        .eq('instance_id', instanceId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      return data?.length || 0;
    } catch (err) {
      console.error('Error fetching messages:', err);
      throw err;
    }
  }, [instanceId]);

  // Initialize scenario with first message if no messages exist
  const initializeScenario = useCallback(async () => {
    if (!instance || !scenario || !user) return;

    try {
      // Check if any messages exist
      const { count } = await supabase
        .from('instance_messages')
        .select('*', { count: 'exact', head: true })
        .eq('instance_id', instanceId);

      // If no messages exist, create the initial scene prompt message
      if (count === 0) {
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
        
        console.log('Initial scenario message created:', scenario.initial_scene_prompt);
      }
    } catch (err) {
      console.error('Error initializing scenario:', err);
      toast({
        title: 'Error',
        description: 'Failed to initialize scenario',
        variant: 'destructive'
      });
    }
  }, [instance, scenario, user, instanceId, toast]);

  // Send a message
  const sendMessage = useCallback(async (messageContent: string) => {
    if (!instance || !user) return;

    try {
      setIsTyping(true);
      
      console.log('Sending message:', messageContent, 'Instance ID:', instanceId);
      
      const { error } = await supabase
        .from('instance_messages')
        .insert({
          instance_id: instanceId,
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
        .eq('id', instanceId);

      if (updateError) throw updateError;

      return { current_turn: instance.current_turn + 1 };
      
    } catch (err) {
      console.error('Error sending message:', err);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
      throw err;
    } finally {
      setIsTyping(false);
    }
  }, [instance, user, instanceId, toast]);

  const addMessage = useCallback((newMessage: Message) => {
    setMessages(prev => {
      // Avoid duplicates
      if (prev.find(msg => msg.id === newMessage.id)) {
        return prev;
      }
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
