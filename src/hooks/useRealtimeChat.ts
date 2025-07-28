
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

  // Single initialization effect with timeout and comprehensive error handling
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isCancelled = false;

    const initializeChat = async () => {
      if (!user) {
        logger.debug('Chat', 'Waiting for user authentication');
        setLoading(false);
        return;
      }
      
      logger.info('Chat', 'Starting chat initialization', { instanceId, scenarioId, userId: user.id });
      
      setLoading(true);
      setError(null);
      
      try {
        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (!isCancelled) {
            logger.error('Chat', 'Chat initialization timed out');
            setError('Chat initialization timed out. Please refresh and try again.');
            setLoading(false);
          }
        }, 15000); // 15 second timeout

        // Step 1: Fetch instance and scenario data
        logger.debug('Chat', 'Fetching instance and scenario data');
        await Promise.all([
          fetchInstance(),
          fetchScenario()
        ]);
        
        if (isCancelled) return;
        logger.debug('Chat', 'Instance and scenario data loaded successfully');

        // Step 2: Wait for both instance and scenario to be available
        let retries = 0;
        while ((!instance || !scenario) && retries < 50 && !isCancelled) {
          await new Promise(resolve => setTimeout(resolve, 100));
          retries++;
        }

        if (isCancelled) return;
        
        if (!instance || !scenario) {
          throw new Error('Failed to load instance or scenario data');
        }

        // Step 3: Initialize scenario and fetch messages
        logger.debug('Chat', 'Initializing chat session', { 
          instanceId: instance.id,
          scenarioId: scenario.id,
          currentTurn: instance.current_turn 
        });
        
        await initializeScenario();
        if (isCancelled) return;
        
        await fetchMessages();
        if (isCancelled) return;
        
        logger.info('Chat', 'Chat initialization completed successfully', { 
          instanceId: instance.id 
        });
        
        clearTimeout(timeoutId);
        setLoading(false);
        
      } catch (err) {
        if (isCancelled) return;
        
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize chat';
        logger.error('Chat', 'Chat initialization failed', err, { instanceId, scenarioId });
        setError(errorMessage);
        setLoading(false);
        clearTimeout(timeoutId);
      }
    };

    initializeChat();

    return () => {
      isCancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [user, instanceId, scenarioId, instance, scenario, fetchInstance, fetchScenario, initializeScenario, fetchMessages]);

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
