
import { useState, useEffect, useCallback, useRef } from 'react';
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
  max_turns: number | null;
  objectives_progress: any;
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  initial_scene_prompt: string;
  objectives: any[];
  max_turns: number | null;
}

interface UseRealtimeChatProps {
  instanceId: string;
  scenarioId: string;
}

export const useRealtimeChat = ({ instanceId, scenarioId }: UseRealtimeChatProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [instance, setInstance] = useState<ScenarioInstance | null>(null);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageCountRef = useRef(0);

  // Fetch scenario instance and validate ownership
  const fetchInstance = useCallback(async () => {
    if (!user || !instanceId) return;

    try {
      const { data: instanceData, error: instanceError } = await supabase
        .from('scenario_instances')
        .select('*')
        .eq('id', instanceId)
        .eq('user_id', user.id)
        .single();

      if (instanceError) throw instanceError;
      if (!instanceData) throw new Error('Instance not found or access denied');

      setInstance(instanceData);
    } catch (err) {
      console.error('Error fetching instance:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch instance');
    }
  }, [user, instanceId]);

  // Fetch scenario data
  const fetchScenario = useCallback(async () => {
    if (!scenarioId) return;

    try {
      const { data: scenarioData, error: scenarioError } = await supabase
        .from('scenarios')
        .select('id, title, description, initial_scene_prompt, objectives, max_turns')
        .eq('id', scenarioId)
        .single();

      if (scenarioError) throw scenarioError;
      if (!scenarioData) throw new Error('Scenario not found');

      // Convert the scenario data to match our interface, ensuring objectives is an array
      const formattedScenario: Scenario = {
        id: scenarioData.id,
        title: scenarioData.title,
        description: scenarioData.description,
        initial_scene_prompt: scenarioData.initial_scene_prompt,
        objectives: Array.isArray(scenarioData.objectives) ? scenarioData.objectives : [],
        max_turns: scenarioData.max_turns
      };

      setScenario(formattedScenario);
    } catch (err) {
      console.error('Error fetching scenario:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch scenario');
    }
  }, [scenarioId]);

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
      lastMessageCountRef.current = data?.length || 0;
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
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
  }, [instance, user, instanceId, toast]);

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
        setMessages(data);
        lastMessageCountRef.current = data.length;
      }
    } catch (err) {
      console.error('Polling error:', err);
    }
  }, [instanceId]);

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
          setMessages(prev => {
            // Avoid duplicates
            if (prev.find(msg => msg.id === newMessage.id)) {
              return prev;
            }
            return [...prev, newMessage];
          });
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
  }, [instanceId, pollMessages]);

  // Initialize everything
  useEffect(() => {
    const init = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      await Promise.all([
        fetchInstance(),
        fetchScenario()
      ]);
    };

    init();
  }, [user, fetchInstance, fetchScenario]);

  // Fetch messages and initialize scenario when instance and scenario are ready
  useEffect(() => {
    const initializeChat = async () => {
      if (instance && scenario) {
        await fetchMessages();
        await initializeScenario();
        setLoading(false);
      }
    };

    initializeChat();
  }, [instance, scenario, fetchMessages, initializeScenario]);

  return {
    messages,
    instance,
    scenario,
    loading,
    error,
    isTyping,
    sendMessage
  };
};
