import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

/**
 * Mark a message as streamed in the database
 */
export const markMessageAsStreamed = async (messageId: string): Promise<boolean> => {
  try {
    logger.info('Chat', 'Attempting to mark message as streamed', { messageId });
    
    const { data, error } = await supabase
      .from('instance_messages')
      .update({ streamed: true })
      .eq('id', messageId)
      .select('id, streamed');

    if (error) {
      logger.error('Chat', 'Failed to mark message as streamed', { messageId, error: error.message });
      return false;
    }

    if (data && data.length > 0) {
      logger.info('Chat', 'Message successfully marked as streamed', { 
        messageId, 
        updated: data[0],
        recordsAffected: data.length 
      });
      return true;
    } else {
      logger.warn('Chat', 'No records were updated when marking message as streamed', { messageId });
      return false;
    }
  } catch (error) {
    logger.error('Chat', 'Error marking message as streamed', { 
      messageId, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return false;
  }
};

/**
 * Check if a message exists and get its current streamed status
 */
export const checkMessageStreamedStatus = async (messageId: string): Promise<boolean | null> => {
  try {
    const { data, error } = await supabase
      .from('instance_messages')
      .select('id, streamed')
      .eq('id', messageId)
      .single();

    if (error) {
      logger.error('Chat', 'Failed to check message streamed status', { messageId, error: error.message });
      return null;
    }

    logger.debug('Chat', 'Message streamed status checked', { 
      messageId, 
      streamed: data.streamed 
    });
    
    return data.streamed || false;
  } catch (error) {
    logger.error('Chat', 'Error checking message streamed status', { 
      messageId, 
      error: error instanceof Error ? error.message : String(error) 
    });
    return null;
  }
};

/**
 * Check if a message should be streamed based on its properties
 */
export const shouldStreamMessage = async (message: { 
  message_type: string; 
  streamed?: boolean; 
  id?: string;
}, streamedCache?: Map<string, boolean>): Promise<boolean> => {
  // Only stream AI responses and narration
  if (message.message_type !== 'ai_response' && message.message_type !== 'narration') {
    return false;
  }

  // Don't stream if already streamed in memory
  if (message.streamed === true) {
    logger.debug('Chat', 'Skipping already streamed message (memory)', { 
      messageId: message.id, 
      streamed: message.streamed 
    });
    return false;
  }

  // Check cache first if provided
  if (message.id && streamedCache?.has(message.id)) {
    const cachedStatus = streamedCache.get(message.id);
    if (cachedStatus === true) {
      logger.debug('Chat', 'Skipping already streamed message (cache)', { 
        messageId: message.id, 
        cached: cachedStatus 
      });
      return false;
    }
  }

  // Check database for streamed status if message has an ID
  if (message.id) {
    const dbStreamedStatus = await checkMessageStreamedStatus(message.id);
    if (dbStreamedStatus === true) {
      // Cache the result
      if (streamedCache) {
        streamedCache.set(message.id, true);
      }
      logger.debug('Chat', 'Skipping already streamed message (database)', { 
        messageId: message.id, 
        dbStreamed: dbStreamedStatus 
      });
      return false;
    }
    // Cache negative result too
    if (streamedCache && dbStreamedStatus === false) {
      streamedCache.set(message.id, false);
    }
  }

  logger.debug('Chat', 'Message should be streamed', { 
    messageId: message.id, 
    streamed: message.streamed,
    type: message.message_type
  });
  return true;
};

/**
 * Debug function to test database connectivity and schema
 */
export const testMessageStreamedField = async (): Promise<void> => {
  try {
    logger.info('Chat', 'Testing message streamed field functionality');
    
    // Try to fetch a few messages to see if streamed field exists
    const { data, error } = await supabase
      .from('instance_messages')
      .select('id, streamed, message_type')
      .limit(5);

    if (error) {
      logger.error('Chat', 'Failed to test streamed field', { error: error.message });
      return;
    }

    logger.info('Chat', 'Streamed field test results', { 
      sampleMessages: data?.map(msg => ({
        id: msg.id,
        streamed: msg.streamed,
        type: msg.message_type
      }))
    });
  } catch (error) {
    logger.error('Chat', 'Error testing streamed field', { 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

// Add global function for debugging in dev mode
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).testStreamedField = testMessageStreamedField;
  (window as any).markMessageStreamed = markMessageAsStreamed;
  (window as any).checkMessageStatus = checkMessageStreamedStatus;
}