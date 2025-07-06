
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UseRealtimeChatProps } from '@/types/chat';
import { useScenarioData } from '@/hooks/chat/useScenarioData';
import { useMessageHandling } from '@/hooks/chat/useMessageHandling';
import { useRealtimeSubscription } from '@/hooks/chat/useRealtimeSubscription';
import { logger } from '@/lib/logger';

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
      
      logger.info('Chat', 'Initializing realtime chat', { instanceId, scenarioId, userId: user.id });
      
      setLoading(true);
      setError(null);
      
      try {
        // First, fetch instance and scenario data
        await Promise.all([
          fetchInstance(),
          fetchScenario()
        ]);
        
        logger.debug('Chat', 'Instance and scenario data loaded successfully');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize chat';
        logger.error('Chat', 'Failed to initialize chat data', err, { instanceId, scenarioId });
        setError(errorMessage);
        setLoading(false);
      }
    };

    init();
  }, [user, fetchInstance, fetchScenario, instanceId, scenarioId]);

  // Initialize chat after instance and scenario are loaded
  useEffect(() => {
    const initializeChat = async () => {
      if (instance && scenario && user) {
        try {
          logger.debug('Chat', 'Initializing chat session', { 
            instanceId: instance.id,
            scenarioId: scenario.id,
            currentTurn: instance.current_turn 
          });
          
          // First initialize the scenario (create initial message if needed)
          await initializeScenario();
          
          // Then fetch all messages (including the one we just created)
          await fetchMessages();
          
          logger.info('Chat', 'Chat initialization completed successfully', { 
            instanceId: instance.id 
          });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to initialize chat';
          logger.error('Chat', 'Chat initialization failed', err, { instanceId });
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      }
    };

    initializeChat();
  }, [instance, scenario, user, initializeScenario, fetchMessages, instanceId]);

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
