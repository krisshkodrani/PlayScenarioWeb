import { useCallback, useEffect, useRef, useState } from 'react';
import { logger } from '@/lib/logger';
import { markMessageAsStreamed, shouldStreamMessage, checkMessageStreamedStatus } from '@/utils/messageUtils';
import type { Message } from '@/types/chat';

interface UseSequentialMessageStreamingProps {
  instanceId: string;
  messages: Message[];
  onStreamingUpdate: (messageId: string, streamedContent: string, isComplete: boolean) => void;
  onStreamingComplete?: (messageId: string) => void;
}

interface StreamingState {
  messageId: string;
  fullContent: string;
  currentContent: string;
  characters: string[];
  currentCharIndex: number;
  isStreaming: boolean;
  position: number; // Position in queue (0 = currently streaming, 1+ = waiting)
  animationFrameId?: number; // For frame-synchronized animation
}

interface MessageQueue {
  message: Message;
  priority: number; // 0 = narrator (highest), 1+ = AI characters
}

export const useSequentialMessageStreaming = ({ 
  instanceId, 
  messages, 
  onStreamingUpdate,
  onStreamingComplete
}: UseSequentialMessageStreamingProps) => {
  const [streamingStates, setStreamingStates] = useState<Map<string, StreamingState>>(new Map());
  const [messageQueue, setMessageQueue] = useState<MessageQueue[]>([]);
  const [currentStreamingMessageId, setCurrentStreamingMessageId] = useState<string | null>(null);
  
  const streamingTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const animationFrames = useRef<Map<string, number>>(new Map());
  const processedMessageIds = useRef<Set<string>>(new Set());
  const streamedStatusCache = useRef<Map<string, boolean>>(new Map()); // Cache database results

  // Calculate character streaming speed for 3-4 sentences per second
  const calculateCharacterDelay = useCallback((char: string, totalChars: number): number => {
    const baseDelay = 3; // 3ms per character for ~333 chars/second (fast but readable)
    if (char === '.' || char === '!' || char === '?') return baseDelay + 150; // Brief pause after sentences
    if (char === ',' || char === ';') return baseDelay + 50; // Tiny pause for commas
    if (char === ' ') return baseDelay + 1; // Slightly longer for spaces
    return baseDelay;
  }, []);

  // Split message content into individual characters for smooth streaming
  const splitIntoCharacters = useCallback((content: string): string[] => {
    // Handle JSON formatted AI responses
    try {
      const parsed = JSON.parse(content);
      if (parsed.content) {
        content = parsed.content;
      }
    } catch {
      // Not JSON, use as-is
    }

    // Split into individual characters
    return content.split('');
  }, []);

  // Get priority for message type (narrator first, then AI characters in order)
  const getMessagePriority = useCallback((message: Message): number => {
    if (message.message_type === 'narration') return 0; // Highest priority
    if (message.message_type === 'ai_response') {
      // Use sequence_number or timestamp for AI character ordering
      return (message.sequence_number || 0) + 1;
    }
    return 999; // Lowest priority (shouldn't happen for streamable messages)
  }, []);

  // Add messages to queue in proper order
  const addToQueue = useCallback(async (newMessages: Message[]) => {
    const streamableChecks = await Promise.all(
      newMessages.map(async message => ({
        message,
        shouldStream: await shouldStreamMessage(message, streamedStatusCache.current) && 
          !processedMessageIds.current.has(message.id)
      }))
    );
    
    const streamableMessages = streamableChecks
      .filter(item => item.shouldStream)
      .map(item => item.message);

    if (streamableMessages.length === 0) return;

    const queueItems: MessageQueue[] = streamableMessages.map(message => ({
      message,
      priority: getMessagePriority(message)
    }));

    // Sort by priority (narrator first, then AI characters in sequence)
    queueItems.sort((a, b) => a.priority - b.priority);

    setMessageQueue(prev => {
      const combined = [...prev, ...queueItems];
      // Remove duplicates and sort again
      const unique = combined.filter((item, index, arr) => 
        arr.findIndex(i => i.message.id === item.message.id) === index
      );
      return unique.sort((a, b) => a.priority - b.priority);
    });

    logger.debug('Chat', 'Messages added to streaming queue', {
      newMessages: queueItems.map(q => ({
        id: q.message.id,
        type: q.message.message_type,
        priority: q.priority,
        sender: q.message.sender_name
      }))
    });
  }, [getMessagePriority]);

  // Stream a single message
  const streamMessage = useCallback(async (message: Message, queuePosition: number) => {
    if (processedMessageIds.current.has(message.id)) {
      return;
    }

    processedMessageIds.current.add(message.id);
    setCurrentStreamingMessageId(message.id);
    
    const characters = splitIntoCharacters(message.message);
    
    const streamingState: StreamingState = {
      messageId: message.id,
      fullContent: message.message,
      currentContent: '',
      characters,
      currentCharIndex: 0,
      isStreaming: true,
      position: queuePosition
    };

    setStreamingStates(prev => new Map(prev).set(message.id, streamingState));

    logger.debug('Chat', 'Starting character-by-character streaming', {
      messageId: message.id,
      characterCount: characters.length,
      messageType: message.message_type,
      queuePosition
    });

    // Stream characters at high speed with frame synchronization
    const streamNextCharacter = (charIndex: number) => {
      if (charIndex >= characters.length) {
        // Streaming complete for this message
        setStreamingStates(prev => {
          const newMap = new Map(prev);
          const state = newMap.get(message.id);
          if (state) {
            newMap.set(message.id, { ...state, isStreaming: false });
          }
          return newMap;
        });

        onStreamingUpdate(message.id, message.message, true);
        setCurrentStreamingMessageId(null);
        
        // Mark message as streamed in database and cache (async but don't block UI)
        markMessageAsStreamed(message.id).then(success => {
          if (success) {
            // Update cache
            streamedStatusCache.current.set(message.id, true);
            logger.info('Chat', 'Message marked as streamed in database', { messageId: message.id });
            // Verify the update worked
            setTimeout(() => {
              checkMessageStreamedStatus(message.id).then(status => {
                logger.info('Chat', 'Verified streamed status in database', { 
                  messageId: message.id, 
                  status 
                });
              });
            }, 500); // Small delay to ensure update is committed
          } else {
            logger.warn('Chat', 'Failed to mark message as streamed in database', { messageId: message.id });
          }
        });
        
        // Trigger scroll completion callback if provided
        if (onStreamingComplete) {
          setTimeout(() => onStreamingComplete(message.id), 100);
        }
        
        // Remove this message from queue and start next
        setMessageQueue(prev => {
          const filtered = prev.filter(q => q.message.id !== message.id);
          return filtered;
        });

        // Cleanup animation frame reference
        animationFrames.current.delete(message.id);
        
        logger.info('Chat', 'Character streaming completed', { messageId: message.id });
        return;
      }

      // Build current content up to this character
      const currentContent = characters.slice(0, charIndex + 1).join('');
      
      // Update state and trigger UI update
      setStreamingStates(prev => {
        const newMap = new Map(prev);
        const state = newMap.get(message.id);
        if (state) {
          newMap.set(message.id, {
            ...state,
            currentContent,
            currentCharIndex: charIndex
          });
        }
        return newMap;
      });

      onStreamingUpdate(message.id, currentContent, false);

      // Calculate delay for this character (3ms base + punctuation pauses)
      const currentChar = characters[charIndex];
      const charDelay = calculateCharacterDelay(currentChar, characters.length);

      // Schedule next character with precise timing
      const timeout = setTimeout(() => {
        requestAnimationFrame(() => {
          streamNextCharacter(charIndex + 1);
        });
      }, charDelay);

      streamingTimeouts.current.set(`${message.id}-${charIndex}`, timeout);
    };

    // Start character streaming with frame synchronization
    const frameId = requestAnimationFrame(() => {
      streamNextCharacter(0);
    });
    
    animationFrames.current.set(message.id, frameId);
  }, [splitIntoCharacters, calculateCharacterDelay, onStreamingUpdate]);

  // Process queue - start next message if none currently streaming
  useEffect(() => {
    if (currentStreamingMessageId === null && messageQueue.length > 0) {
      const nextMessage = messageQueue[0];
      if (nextMessage) {
        logger.debug('Chat', 'Starting next message from queue', {
          messageId: nextMessage.message.id,
          queueLength: messageQueue.length,
          messageType: nextMessage.message.message_type
        });
        streamMessage(nextMessage.message, 0);
      }
    }
  }, [currentStreamingMessageId, messageQueue, streamMessage]);

  // Update queue positions for waiting messages
  useEffect(() => {
    setStreamingStates(prev => {
      const newMap = new Map(prev);
      messageQueue.forEach((queueItem, index) => {
        const state = newMap.get(queueItem.message.id);
        if (state && queueItem.message.id !== currentStreamingMessageId) {
          newMap.set(queueItem.message.id, {
            ...state,
            position: index
          });
        }
      });
      return newMap;
    });
  }, [messageQueue, currentStreamingMessageId]);

  // Find and queue new unstreamed messages with immediate pending states
  useEffect(() => {
    const checkAndAddMessages = async () => {
      // Filter messages that haven't been processed yet
      const unprocessedMessages = messages.filter(message => 
        !processedMessageIds.current.has(message.id) &&
        !messageQueue.some(q => q.message.id === message.id) &&
        !streamingStates.has(message.id)
      );

      if (unprocessedMessages.length === 0) return;

      logger.debug('Chat', 'Checking unprocessed messages for streaming', {
        unprocessedCount: unprocessedMessages.length,
        messageIds: unprocessedMessages.map(m => m.id)
      });

      // Immediately create pending streaming states for streamable types to prevent flash
      const immediateStreamables = unprocessedMessages.filter(m => m.message_type === 'ai_response' || m.message_type === 'narration');
      if (immediateStreamables.length > 0) {
        setStreamingStates(prev => {
          const next = new Map(prev);
          immediateStreamables.forEach(m => {
            if (!next.has(m.id)) {
              next.set(m.id, {
                messageId: m.id,
                fullContent: m.message,
                currentContent: '',
                characters: [],
                currentCharIndex: 0,
                isStreaming: false,
                position: 999
              });
            }
          });
          return next;
        });
      }

      const streamableChecks = await Promise.all(
        unprocessedMessages.map(async message => ({
          message,
          shouldStream: await shouldStreamMessage(message, streamedStatusCache.current)
        }))
      );
      
      const unstreamedMessages = streamableChecks
        .filter(item => item.shouldStream)
        .map(item => item.message);

      if (unstreamedMessages.length > 0) {
        logger.debug('Chat', 'Found new messages to stream', {
          count: unstreamedMessages.length,
          messageIds: unstreamedMessages.map(m => m.id)
        });
        await addToQueue(unstreamedMessages);
      } else {
        // Mark non-streamable messages as processed to avoid re-checking
        unprocessedMessages.forEach(message => {
          if (message.message_type !== 'ai_response' && message.message_type !== 'narration') {
            processedMessageIds.current.add(message.id);
          }
        });
      }
    };

    checkAndAddMessages();
  }, [messages.length]); // Only depend on messages.length to avoid constant re-evaluation

  // Skip streaming function for user convenience
  const skipStreaming = useCallback((messageId: string) => {
    const state = streamingStates.get(messageId);
    if (!state || !state.isStreaming) return;

    // Clear all timeouts for this message
    streamingTimeouts.current.forEach((timeout, key) => {
      if (key.startsWith(messageId)) {
        clearTimeout(timeout);
        streamingTimeouts.current.delete(key);
      }
    });

    // Cancel animation frame if exists
    const frameId = animationFrames.current.get(messageId);
    if (frameId) {
      cancelAnimationFrame(frameId);
      animationFrames.current.delete(messageId);
    }

    // Complete streaming immediately
    setStreamingStates(prev => {
      const newMap = new Map(prev);
      newMap.set(messageId, {
        ...state,
        currentContent: state.fullContent,
        isStreaming: false
      });
      return newMap;
    });

    onStreamingUpdate(messageId, state.fullContent, true);
    setCurrentStreamingMessageId(null);
    
    // Mark message as streamed in database and cache (async but don't block UI)
    markMessageAsStreamed(messageId).then(success => {
      if (success) {
        streamedStatusCache.current.set(messageId, true);
        logger.info('Chat', 'Skipped message marked as streamed in database', { messageId });
      } else {
        logger.warn('Chat', 'Failed to mark skipped message as streamed in database', { messageId });
      }
    });
    
    // Remove from queue
    setMessageQueue(prev => prev.filter(q => q.message.id !== messageId));
  }, [streamingStates, onStreamingUpdate]);

  // Skip all queued messages
  const skipAllStreaming = useCallback(() => {
    // Skip current streaming message
    if (currentStreamingMessageId) {
      skipStreaming(currentStreamingMessageId);
    }

    // Complete all queued messages immediately
    messageQueue.forEach(queueItem => {
      const messageId = queueItem.message.id;
      processedMessageIds.current.add(messageId);
      onStreamingUpdate(messageId, queueItem.message.message, true);
      // Mark message as streamed in database and cache (async but don't block UI)
      markMessageAsStreamed(messageId).then(success => {
        if (success) {
          streamedStatusCache.current.set(messageId, true);
          logger.info('Chat', 'Skip-all message marked as streamed in database', { messageId });
        } else {
          logger.warn('Chat', 'Failed to mark skip-all message as streamed in database', { messageId });
        }
      });
    });

    // Clear queue and states
    setMessageQueue([]);
    setStreamingStates(new Map());
    setCurrentStreamingMessageId(null);
    
    // Clear all timeouts and animation frames
    streamingTimeouts.current.forEach(timeout => clearTimeout(timeout));
    streamingTimeouts.current.clear();
    
    animationFrames.current.forEach(frameId => cancelAnimationFrame(frameId));
    animationFrames.current.clear();

    logger.debug('Chat', 'All natural streaming skipped by user');
  }, [currentStreamingMessageId, messageQueue, skipStreaming, onStreamingUpdate]);

  // Cleanup timeouts and animation frames on unmount
  useEffect(() => {
    return () => {
      streamingTimeouts.current.forEach(timeout => clearTimeout(timeout));
      streamingTimeouts.current.clear();
      animationFrames.current.forEach(frameId => cancelAnimationFrame(frameId));
      animationFrames.current.clear();
    };
  }, []);

  // Reset everything when instance changes
  useEffect(() => {
    logger.debug('Chat', 'Instance changed - resetting streaming system', { instanceId });
    processedMessageIds.current.clear();
    streamedStatusCache.current.clear();
    setStreamingStates(new Map());
    setMessageQueue([]);
    setCurrentStreamingMessageId(null);
    streamingTimeouts.current.forEach(timeout => clearTimeout(timeout));
    streamingTimeouts.current.clear();
    animationFrames.current.forEach(frameId => cancelAnimationFrame(frameId));
    animationFrames.current.clear();
  }, [instanceId]);

  return {
    streamingStates,
    messageQueue: messageQueue.map(q => q.message),
    currentStreamingMessageId,
    skipStreaming,
    skipAllStreaming,
    isAnyMessageStreaming: currentStreamingMessageId !== null,
    queueLength: messageQueue.length
  };
};