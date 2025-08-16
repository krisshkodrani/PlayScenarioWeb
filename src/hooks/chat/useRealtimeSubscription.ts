import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, ScenarioInstance } from '@/types/chat';
import { logger } from '@/lib/logger';

export const useRealtimeSubscription = (
  instanceId: string,
  onNewMessage: (message: Message) => void,
  onInstanceUpdate?: (instance: Partial<ScenarioInstance>) => void
) => {
  const processedMessageIds = useRef<Set<string>>(new Set());
  const connectionHealthy = useRef(true);
  const catchupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const healthCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageTimeRef = useRef<number>(Date.now());

  // Enhanced catchup fetch with better error handling and logging
  const performCatchupFetch = useCallback(async () => {
    if (!instanceId) return;

    try {
      logger.info('Chat', 'Performing catchup fetch', { 
        instanceId, 
        connectionHealthy: connectionHealthy.current,
        lastMessageTime: new Date(lastMessageTimeRef.current).toISOString()
      });
      console.log('🔄 Performing catchup fetch for instance:', instanceId);
      
      const { data, error } = await supabase
        .from('instance_messages')
        .select('*')
        .eq('instance_id', instanceId)
        .order('sequence_number', { ascending: true }); // Use sequence_number for perfect ordering

      if (error) throw error;
      
      if (data) {
        console.log('📊 Catchup found', data.length, 'total messages');
        
        // Process only messages not yet processed
        const newMessages = data.filter(msg => !processedMessageIds.current.has(msg.id));
        
        if (newMessages.length > 0) {
          logger.info('Chat', 'Catchup found missed messages', { 
            instanceId, 
            totalMessages: data.length,
            missedCount: newMessages.length,
            newMessageIds: newMessages.map(m => m.id)
          });
          console.log('🆕 Found', newMessages.length, 'missed messages:', 
            newMessages.map(m => ({ id: m.id, sender: m.sender_name, type: m.message_type })));
          
          // Messages already sorted by sequence_number
          newMessages.forEach(msg => {
            processedMessageIds.current.add(msg.id);
            lastMessageTimeRef.current = Date.now();
            onNewMessage({
              ...msg,
              message_type: msg.message_type as 'user_message' | 'ai_response' | 'system' | 'narration'
            });
          });
        } else {
          logger.debug('Chat', 'Catchup found no new messages', { instanceId, totalMessages: data.length });
          console.log('✅ Catchup complete - no missed messages');
        }
      }
      
      connectionHealthy.current = true; // Connection recovered
    } catch (err) {
      logger.error('Chat', 'Catchup fetch failed', err, { instanceId });
      console.error('❌ Catchup fetch failed:', err);
      // Retry after delay if connection is still unhealthy
      if (!connectionHealthy.current) {
        catchupTimeoutRef.current = setTimeout(performCatchupFetch, 5000);
      }
    }
  }, [instanceId, onNewMessage]);

  // Periodic health check to detect silent failures
  const performHealthCheck = useCallback(async () => {
    if (!instanceId || !connectionHealthy.current) return;
    
    const timeSinceLastMessage = Date.now() - lastMessageTimeRef.current;
    // If no activity for 30 seconds and we expect there might be messages, do a health check
    if (timeSinceLastMessage > 30000) {
      logger.debug('Chat', 'Performing periodic health check', { 
        instanceId,
        timeSinceLastMessage: timeSinceLastMessage / 1000 + ' seconds'
      });
      console.log('🏥 Performing health check - no activity for', Math.round(timeSinceLastMessage / 1000), 'seconds');
      await performCatchupFetch();
    }
  }, [instanceId, performCatchupFetch]);

  // Set up pure real-time subscription (no polling)
  useEffect(() => {
    if (!instanceId) return;

    logger.info('Chat', 'Setting up pure realtime subscription', { instanceId });
    console.log('🔧 Setting up realtime subscription for instance:', instanceId);

    // Clear processed messages when instance changes
    processedMessageIds.current.clear();
    connectionHealthy.current = true;

    // Set up periodic health checks
    healthCheckIntervalRef.current = setInterval(performHealthCheck, 60000); // Check every minute

    // Set up real-time subscription for messages
    const channel = supabase
      .channel(`chat:${instanceId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'instance_messages',
          filter: `instance_id=eq.${instanceId}`
        },
        (payload) => {
          console.log('📨 Realtime message payload received:', payload);
          logger.info('Chat', 'Raw realtime payload received', { 
            instanceId, 
            eventType: payload.eventType,
            schema: payload.schema,
            table: payload.table,
            payloadNew: payload.new
          });
          
          const rawMessage = payload.new as any;
          const newMessage = {
            ...rawMessage,
            message_type: rawMessage.message_type as 'user_message' | 'ai_response' | 'system' | 'narration'
          } as Message;
          
          console.log('💬 Processed message:', {
            id: newMessage.id,
            sender: newMessage.sender_name,
            message_type: newMessage.message_type,
            sequence_number: newMessage.sequence_number,
            timestamp: newMessage.timestamp
          });
          
          // Only process if not already processed
          if (!processedMessageIds.current.has(newMessage.id)) {
            logger.info('Chat', 'Processing new realtime message', { 
              instanceId,
              messageId: newMessage.id,
              sender: newMessage.sender_name,
              messageType: newMessage.message_type,
              sequence: newMessage.sequence_number,
              timestamp: newMessage.timestamp
            });
            console.log('✅ Adding new message to chat:', newMessage.id);
            
            processedMessageIds.current.add(newMessage.id);
            lastMessageTimeRef.current = Date.now(); // Update last activity time
            onNewMessage(newMessage);
          } else {
            logger.debug('Chat', 'Duplicate message ignored', { 
              instanceId,
              messageId: newMessage.id,
              sender: newMessage.sender_name
            });
            console.log('🔁 Duplicate message ignored:', newMessage.id);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'scenario_instances',
          filter: `id=eq.${instanceId}`
        },
        (payload) => {
          if (onInstanceUpdate && payload.new) {
            const updates = payload.new as Partial<ScenarioInstance>;
            
            // Enhanced debugging for objective progress updates
            const hasObjectiveUpdates = updates.objectives_progress && 
              Object.keys(updates.objectives_progress).length > 0;
            
            console.log('🎯 Instance update received:', {
              instanceId,
              hasObjectiveUpdates,
              currentTurn: updates.current_turn,
              objectiveKeys: hasObjectiveUpdates ? Object.keys(updates.objectives_progress!) : [],
              updateFields: Object.keys(updates)
            });
            
            logger.debug('Chat', 'Instance update received', { 
              instanceId,
              updates: updates,
              hasObjectiveUpdates,
              objectiveProgressKeys: hasObjectiveUpdates ? Object.keys(updates.objectives_progress!) : []
            });
            
            // Log detailed objective progress if present
            if (hasObjectiveUpdates) {
              console.log('📊 Objective progress details:');
              Object.entries(updates.objectives_progress!).forEach(([key, progress]) => {
                console.log(`  ${key}: ${progress.completion_percentage}% (${progress.status}) - Turn ${progress.last_updated_turn}`);
              });
            }
            
            onInstanceUpdate(updates);
          }
        }
      )
      .subscribe((status) => {
        logger.info('Chat', 'Subscription status changed', { instanceId, status });
        console.log('🔔 Realtime subscription status:', status, { instanceId });
        
        if (status === 'SUBSCRIBED') {
          connectionHealthy.current = true;
          logger.info('Chat', 'Real-time connection established successfully', { instanceId });
          console.log('✅ Real-time subscription ACTIVE for instance:', instanceId);
        } else if (status === 'CHANNEL_ERROR') {
          connectionHealthy.current = false;
          logger.error('Chat', 'Real-time connection error - performing catchup', null, { instanceId });
          console.error('❌ Real-time connection ERROR for instance:', instanceId);
          // Perform emergency catchup after a delay
          catchupTimeoutRef.current = setTimeout(performCatchupFetch, 2000);
        } else if (status === 'TIMED_OUT') {
          connectionHealthy.current = false;
          logger.error('Chat', 'Real-time connection timed out', null, { instanceId });
          console.error('⏰ Real-time connection TIMED OUT for instance:', instanceId);
          catchupTimeoutRef.current = setTimeout(performCatchupFetch, 1000);
        } else if (status === 'CLOSED') {
          connectionHealthy.current = false;
          logger.warn('Chat', 'Real-time connection closed', { instanceId });
          console.warn('🔒 Real-time connection CLOSED for instance:', instanceId);
        } else {
          logger.debug('Chat', 'Unknown subscription status', { instanceId, status });
          console.log('❓ Unknown real-time status:', status, 'for instance:', instanceId);
        }
      });

    return () => {
      logger.debug('Chat', 'Cleaning up realtime subscription', { instanceId });
      console.log('🧹 Cleaning up realtime subscription for instance:', instanceId);
      
      supabase.removeChannel(channel);
      
      if (catchupTimeoutRef.current) {
        clearTimeout(catchupTimeoutRef.current);
        catchupTimeoutRef.current = null;
      }
      
      if (healthCheckIntervalRef.current) {
        clearInterval(healthCheckIntervalRef.current);
        healthCheckIntervalRef.current = null;
      }
      
      // Clear processed messages on cleanup to prevent memory leaks
      processedMessageIds.current.clear();
    };
  }, [instanceId, onNewMessage, performCatchupFetch]);

  return {
    connectionHealthy: connectionHealthy.current
  };
};
