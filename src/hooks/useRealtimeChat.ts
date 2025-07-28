
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
      console.log('🔄 useRealtimeChat: Starting initialization', { 
        user: !!user, 
        userId: user?.id,
        instanceId, 
        scenarioId 
      });

      if (!user) {
        console.log('❌ useRealtimeChat: No user found, stopping initialization');
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
            console.log('⏰ useRealtimeChat: Initialization timed out');
            logger.error('Chat', 'Chat initialization timed out');
            setError('Chat initialization timed out. Please refresh and try again.');
            setLoading(false);
          }
        }, 15000); // 15 second timeout

        // Step 1: Fetch instance and scenario data
        console.log('📊 useRealtimeChat: Fetching instance and scenario data');
        logger.debug('Chat', 'Fetching instance and scenario data');
        
        await Promise.all([
          fetchInstance().catch(err => {
            console.error('❌ useRealtimeChat: fetchInstance failed:', err);
            throw err;
          }),
          fetchScenario().catch(err => {
            console.error('❌ useRealtimeChat: fetchScenario failed:', err);
            throw err;
          })
        ]);
        
        if (isCancelled) {
          console.log('🛑 useRealtimeChat: Cancelled after fetch');
          return;
        }
        
        console.log('✅ useRealtimeChat: Instance and scenario data fetched');
        logger.debug('Chat', 'Instance and scenario data loaded successfully');

        // Step 2: Wait for both instance and scenario to be available
        console.log('⏳ useRealtimeChat: Waiting for instance and scenario data to be available');
        let retries = 0;
        while ((!instance || !scenario) && retries < 50 && !isCancelled) {
          console.log(`⏳ useRealtimeChat: Retry ${retries + 1}/50 - Instance: ${!!instance}, Scenario: ${!!scenario}`);
          await new Promise(resolve => setTimeout(resolve, 100));
          retries++;
        }

        if (isCancelled) {
          console.log('🛑 useRealtimeChat: Cancelled during wait');
          return;
        }
        
        if (!instance || !scenario) {
          console.log('❌ useRealtimeChat: Timeout waiting for data - Instance:', !!instance, 'Scenario:', !!scenario);
          throw new Error('Failed to load instance or scenario data');
        }

        console.log('✅ useRealtimeChat: Instance and scenario data available', {
          instanceId: instance.id,
          scenarioId: scenario.id
        });

        // Step 3: Initialize scenario and fetch messages
        console.log('🎬 useRealtimeChat: Initializing scenario');
        logger.debug('Chat', 'Initializing chat session', { 
          instanceId: instance.id,
          scenarioId: scenario.id,
          currentTurn: instance.current_turn 
        });
        
        await initializeScenario();
        if (isCancelled) {
          console.log('🛑 useRealtimeChat: Cancelled after initializeScenario');
          return;
        }
        
        console.log('💬 useRealtimeChat: Fetching messages');
        await fetchMessages();
        if (isCancelled) {
          console.log('🛑 useRealtimeChat: Cancelled after fetchMessages');
          return;
        }
        
        console.log('🎉 useRealtimeChat: Initialization completed successfully');
        logger.info('Chat', 'Chat initialization completed successfully', { 
          instanceId: instance.id 
        });
        
        clearTimeout(timeoutId);
        setLoading(false);
        
      } catch (err) {
        if (isCancelled) {
          console.log('🛑 useRealtimeChat: Cancelled during error handling');
          return;
        }
        
        console.error('❌ useRealtimeChat: Initialization failed:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize chat';
        logger.error('Chat', 'Chat initialization failed', err, { instanceId, scenarioId });
        setError(errorMessage);
        setLoading(false);
        clearTimeout(timeoutId);
      }
    };

    initializeChat();

    return () => {
      console.log('🧹 useRealtimeChat: Cleanup');
      isCancelled = true;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [user, instanceId, scenarioId]);

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
