
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UseRealtimeChatProps } from '@/types/chat';
import { useScenarioData } from '@/hooks/chat/useScenarioData';
import { useMessageHandling } from '@/hooks/chat/useMessageHandling';
import { useRealtimeSubscription } from '@/hooks/chat/useRealtimeSubscription';

export const useRealtimeChat = ({ instanceId, scenarioId }: UseRealtimeChatProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    instance,
    scenario,
    fetchInstance,
    fetchScenario,
    updateInstance
  } = useScenarioData(instanceId, scenarioId);

  const {
    messages,
    isTyping,
    fetchMessages,
    initializeScenario,
    sendMessage: handleSendMessage,
    addMessage
  } = useMessageHandling(instanceId, instance, scenario);

  useRealtimeSubscription(instanceId, addMessage);

  // Enhanced send message with instance update
  const sendMessage = useCallback(async (messageContent: string) => {
    const result = await handleSendMessage(messageContent);
    if (result) {
      updateInstance({ current_turn: result.current_turn });
    }
  }, [handleSendMessage, updateInstance]);

  // Initialize everything in proper sequence
  useEffect(() => {
    const init = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // First, fetch instance and scenario data
        await Promise.all([
          fetchInstance(),
          fetchScenario()
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize chat');
        setLoading(false);
      }
    };

    init();
  }, [user, fetchInstance, fetchScenario]);

  // Initialize chat after instance and scenario are loaded
  useEffect(() => {
    const initializeChat = async () => {
      if (instance && scenario && user) {
        try {
          // First initialize the scenario (create initial message if needed)
          await initializeScenario();
          
          // Then fetch all messages (including the one we just created)
          await fetchMessages();
          
          console.log('Chat initialization completed successfully');
        } catch (err) {
          console.error('Error initializing chat:', err);
          setError(err instanceof Error ? err.message : 'Failed to initialize chat');
        } finally {
          setLoading(false);
        }
      }
    };

    initializeChat();
  }, [instance, scenario, user, initializeScenario, fetchMessages]);

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
