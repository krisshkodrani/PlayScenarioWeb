
import { useState, useEffect, useCallback, useRef } from 'react';
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

  // Stable function references to prevent infinite re-renders
  const stableFetchInstance = useRef(fetchInstance);
  const stableFetchScenario = useRef(fetchScenario);
  const stableFetchMessages = useRef(fetchMessages);
  const stableInitializeScenario = useRef(initializeScenario);

  // Update refs when functions change
  stableFetchInstance.current = fetchInstance;
  stableFetchScenario.current = fetchScenario;
  stableFetchMessages.current = fetchMessages;
  stableInitializeScenario.current = initializeScenario;

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
        }, 30000); // Reduced to 30 second timeout

        // Step 1: Fetch instance and scenario data
        console.log('📊 useRealtimeChat: Fetching instance and scenario data');
        logger.debug('Chat', 'Fetching instance and scenario data');
        
        const [fetchedInstance, fetchedScenario] = await Promise.all([
          stableFetchInstance.current().catch(err => {
            console.error('❌ useRealtimeChat: fetchInstance failed:', err);
            throw err;
          }),
          stableFetchScenario.current().catch(err => {
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
          scenarioId: currentScenario.id,
          scenarioOpeningMessage: !!currentScenario.scenario_opening_message
        });

        // Step 3: Fetch existing messages first
        console.log('💬 useRealtimeChat: Fetching existing messages');
        const messageCount = await stableFetchMessages.current();
        if (isCancelled) {
          console.log('🛑 useRealtimeChat: Cancelled after fetchMessages');
          return;
        }

        console.log(`📨 useRealtimeChat: Found ${messageCount} existing messages`);

        // Step 4: Initialize scenario if no messages exist
        if (messageCount === 0) {
          console.log('🎬 useRealtimeChat: No messages found, initializing scenario');
          logger.info('Chat', 'No messages found, initializing scenario', { instanceId });
          
          try {
            // First, call the initialization endpoint to create the narrator message
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
              
              // Wait a moment for the message to be saved
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              // Re-fetch messages to get the narrator message
              const newMessageCount = await stableFetchMessages.current();
              console.log(`📨 useRealtimeChat: After initialization, found ${newMessageCount} messages`);
            } else {
              console.error('❌ useRealtimeChat: Failed to initialize instance', response.status);
              logger.error('Chat', 'Failed to initialize instance', null, { 
                instanceId,
                status: response.status 
              });
              
              // Fallback: call initializeScenario for local setup
              await stableInitializeScenario.current();
            }
          } catch (err) {
            console.error('❌ useRealtimeChat: Error calling initialization endpoint:', err);
            logger.error('Chat', 'Error calling initialization endpoint', err, { instanceId });
            
            // Fallback: call initializeScenario for local setup
            await stableInitializeScenario.current();
          }
        } else {
          // Initialize scenario handling for existing messages
          await stableInitializeScenario.current();
        }
        
        if (isCancelled) {
          console.log('🛑 useRealtimeChat: Cancelled after initialization');
          return;
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
