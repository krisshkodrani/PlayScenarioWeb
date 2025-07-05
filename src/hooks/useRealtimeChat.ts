
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

  // Initialize everything
  useEffect(() => {
    const init = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchInstance(),
          fetchScenario()
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize chat');
      }
    };

    init();
  }, [user, fetchInstance, fetchScenario]);

  // Fetch messages and initialize scenario when instance and scenario are ready
  useEffect(() => {
    const initializeChat = async () => {
      if (instance && scenario) {
        try {
          await fetchMessages();
          await initializeScenario();
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to initialize chat');
        } finally {
          setLoading(false);
        }
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
