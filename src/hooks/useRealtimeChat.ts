
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

  useRealtimeSubscription(instanceId, addMessage, updateInstance);

  // Enhanced send message with instance update
  const sendMessage = useCallback(async (messageContent: string, mode: 'chat' | 'action' = 'chat') => {
    const result = await handleSendMessage(messageContent, mode);
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
        }, 45000); // 45 second timeout

        // Step 1: Fetch instance and scenario data
        console.log('📊 useRealtimeChat: Fetching instance and scenario data');
        logger.debug('Chat', 'Fetching instance and scenario data');
        
        const [fetchedInstance, fetchedScenario] = await Promise.all([
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

        // Step 2: Validate data without stale state polling
        const currentInstance = fetchedInstance ?? instance;
        const currentScenario = fetchedScenario ?? scenario;

        if (isCancelled) {
          console.log('🛑 useRealtimeChat: Cancelled during validation');
          return;
        }
        
        if (!currentInstance || !currentScenario) {
          console.log('❌ useRealtimeChat: Missing data after fetch - Instance:', !!currentInstance, 'Scenario:', !!currentScenario);
          throw new Error('Failed to load instance or scenario data');
        }

        console.log('✅ useRealtimeChat: Instance and scenario data available', {
          instanceId: currentInstance.id,
          scenarioId: currentScenario.id
        });

        // Step 3: Initialize scenario and fetch messages
        console.log('🎬 useRealtimeChat: Initializing scenario');
        logger.debug('Chat', 'Initializing chat session', { 
          instanceId: currentInstance.id,
          scenarioId: currentScenario.id,
          currentTurn: currentInstance.current_turn 
        });
        
        await initializeScenario();
        if (isCancelled) {
          console.log('🛑 useRealtimeChat: Cancelled after initializeScenario');
          return;
        }
        
        console.log('💬 useRealtimeChat: Fetching messages');
        const messageCount = await fetchMessages();
        if (isCancelled) {
          console.log('🛑 useRealtimeChat: Cancelled after fetchMessages');
          return;
        }

        // Fallback: If no messages exist, call initialization endpoint
        if (messageCount === 0 && currentScenario?.initial_scene_prompt) {
          console.log('🔄 useRealtimeChat: No messages found, initializing instance');
          logger.info('Chat', 'No messages found, calling initialization endpoint', { instanceId });
          
          try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/instances/${instanceId}/initialize`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
              const result = await response.json();
              console.log('✅ useRealtimeChat: Instance initialization completed', result);
              logger.info('Chat', 'Instance initialization completed', { 
                instanceId,
                narratorCreated: result.narrator_message_created
              });
              
              // Re-fetch messages to get the narrator message
              await fetchMessages();
            } else {
              console.error('❌ useRealtimeChat: Failed to initialize instance', response.status);
              logger.error('Chat', 'Failed to initialize instance', null, { 
                instanceId,
                status: response.status 
              });
            }
          } catch (err) {
            console.error('❌ useRealtimeChat: Error calling initialization endpoint:', err);
            logger.error('Chat', 'Error calling initialization endpoint', err, { instanceId });
          }
        }
        
        console.log('🎉 useRealtimeChat: Initialization completed successfully');
        logger.info('Chat', 'Chat initialization completed successfully', { 
          instanceId: (fetchedInstance ?? instance)?.id 
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
