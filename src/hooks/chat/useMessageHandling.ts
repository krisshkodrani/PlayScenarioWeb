import { useState, useCallback, useRef } from 'react';
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
  const initializationRef = useRef<Promise<void> | null>(null);
  const isInitializedRef = useRef(false);

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
      
      // Deduplicate messages by content and turn_number for system messages
      const deduplicatedData = data?.reduce((acc: Message[], current: Message) => {
        // For system messages, check for duplicates by content and turn_number
        if (current.message_type === 'system') {
          const isDuplicate = acc.some(msg => 
            msg.message_type === 'system' && 
            msg.message === current.message &&
            msg.turn_number === current.turn_number
          );
          if (!isDuplicate) {
            acc.push(current);
          }
        } else {
          // For non-system messages, check by ID
          const isDuplicate = acc.some(msg => msg.id === current.id);
          if (!isDuplicate) {
            acc.push(current);
          }
        }
        return acc;
      }, []) || [];

      setMessages(deduplicatedData);
      return deduplicatedData.length;
    } catch (err) {
      console.error('Error fetching messages:', err);
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
        console.log('Checking if scenario needs initialization...');
        
        // Check if any messages exist
        const { count, error: countError } = await supabase
          .from('instance_messages')
          .select('*', { count: 'exact', head: true })
          .eq('instance_id', instanceId);

        if (countError) throw countError;

        // If no messages exist, create the initial scene prompt message
        if (count === 0) {
          console.log('Creating initial scenario message...');
          
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
          
          console.log('Initial scenario message created successfully');
        } else {
          console.log('Messages already exist, skipping initialization');
        }
        
        isInitializedRef.current = true;
      } catch (err) {
        console.error('Error initializing scenario:', err);
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
    async (messageContent: string) => {
      if (!instance || !user) return;

      try {
        setIsTyping(true);

        console.log(
          'Sending message to FastAPI:',
          messageContent,
          'Instance ID:',
          instanceId
        );

        // Build request payload with recent history to save backend DB look-ups
        const payload = {
          scenario_instance_id: instanceId,
          user_message: messageContent,
          conversation_history: messages.slice(-10).map(
            ({ id, sender_name, message, message_type, timestamp }) => ({
              id,
              sender_name,
              message,
              message_type,
              timestamp
            })
          )
        };

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/chat/scenario-completions`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }
        );

        if (!res.ok) {
          throw new Error(await res.text());
        }

        // Parse response to retrieve updated turn number so outer hooks stay in sync
        const data: { turn_number: number } = await res.json();

        return { current_turn: data.turn_number };
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
    },
    [instance, user, instanceId, messages, toast]
  );

  const addMessage = useCallback((newMessage: Message) => {
    setMessages(prev => {
      // Check for exact duplicates by ID
      if (prev.find(msg => msg.id === newMessage.id)) {
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
          return prev;
        }
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
