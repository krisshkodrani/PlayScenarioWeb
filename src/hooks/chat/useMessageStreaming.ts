import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { Message } from '@/types/chat';

interface UseMessageStreamingProps {
  instanceId: string;
  messages: Message[];
  onStreamingUpdate: (messageId: string, streamedContent: string, isComplete: boolean) => void;
}

interface StreamingState {
  messageId: string;
  fullContent: string;
  currentContent: string;
  chunks: string[];
  currentChunkIndex: number;
  isStreaming: boolean;
}

export const useMessageStreaming = ({ instanceId, messages, onStreamingUpdate }: UseMessageStreamingProps) => {
  const [streamingStates, setStreamingStates] = useState<Map<string, StreamingState>>(new Map());
  const streamingTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const processedMessageIds = useRef<Set<string>>(new Set());

  // Split message content into streamable chunks (sentences)
  const splitIntoChunks = useCallback((content: string): string[] => {
    // Handle JSON formatted AI responses
    try {
      const parsed = JSON.parse(content);
      if (parsed.content) {
        content = parsed.content;
      }
    } catch {
      // Not JSON, use as-is
    }

    // Split by sentences, keeping punctuation
    const sentences = content.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
    
    // Group sentences into chunks of 1-2 sentences for natural pacing
    const chunks: string[] = [];
    for (let i = 0; i < sentences.length; i += 2) {
      const chunk = sentences.slice(i, i + 2).join(' ');
      chunks.push(chunk);
    }
    
    return chunks.length > 0 ? chunks : [content];
  }, []);

  // Stream a single message
  const streamMessage = useCallback(async (message: Message) => {
    if (processedMessageIds.current.has(message.id)) {
      return;
    }

    processedMessageIds.current.add(message.id);
    
    const chunks = splitIntoChunks(message.message);
    
    const streamingState: StreamingState = {
      messageId: message.id,
      fullContent: message.message,
      currentContent: '',
      chunks,
      currentChunkIndex: 0,
      isStreaming: true
    };

    setStreamingStates(prev => new Map(prev).set(message.id, streamingState));

    logger.debug('Chat', 'Starting message streaming', {
      messageId: message.id,
      chunkCount: chunks.length,
      messageType: message.message_type
    });

    // Stream chunks with timing (3-4 sentences per second = ~300-400ms per chunk)
    const streamChunk = (chunkIndex: number) => {
      if (chunkIndex >= chunks.length) {
        // Streaming complete
        setStreamingStates(prev => {
          const newMap = new Map(prev);
          const state = newMap.get(message.id);
          if (state) {
            newMap.set(message.id, { ...state, isStreaming: false });
          }
          return newMap;
        });

        onStreamingUpdate(message.id, message.message, true);

        // Mark message as streamed in database
        markMessageStreamed(message.id);
        return;
      }

      const currentContent = chunks.slice(0, chunkIndex + 1).join(' ');
      
      setStreamingStates(prev => {
        const newMap = new Map(prev);
        const state = newMap.get(message.id);
        if (state) {
          newMap.set(message.id, {
            ...state,
            currentContent,
            currentChunkIndex: chunkIndex
          });
        }
        return newMap;
      });

      onStreamingUpdate(message.id, currentContent, false);

      // Schedule next chunk
      const timeout = setTimeout(() => {
        streamChunk(chunkIndex + 1);
      }, 350); // ~3 sentences per second

      streamingTimeouts.current.set(`${message.id}-${chunkIndex}`, timeout);
    };

    // Start streaming
    streamChunk(0);
  }, [splitIntoChunks, onStreamingUpdate]);

  // Mark message as streamed in database directly (bypass RPC for now)
  const markMessageStreamed = useCallback(async (messageId: string) => {
    try {
      // For now, we'll skip the database update and just track locally
      // The streaming state is managed in React state
      logger.debug('Chat', 'Message streaming completed (local tracking)', { messageId });
    } catch (error) {
      logger.error('Chat', 'Error in streaming completion', error);
    }
  }, []);

  // Find and stream new unstreamed messages
  useEffect(() => {
    const unstreamedMessages = messages.filter(message => 
      (message.message_type === 'ai_response' || message.message_type === 'narration') &&
      !processedMessageIds.current.has(message.id) &&
      !streamingStates.has(message.id)
    );

    // Sort by sequence_number to ensure proper order
    unstreamedMessages.sort((a, b) => (a.sequence_number || 0) - (b.sequence_number || 0));

    // Stream messages one at a time
    unstreamedMessages.forEach((message, index) => {
      setTimeout(() => {
        streamMessage(message);
      }, index * 100); // Small delay between starting different messages
    });
  }, [messages, streamMessage, streamingStates]);

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
    markMessageStreamed(messageId);
  }, [streamingStates, onStreamingUpdate, markMessageStreamed]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      streamingTimeouts.current.forEach(timeout => clearTimeout(timeout));
      streamingTimeouts.current.clear();
    };
  }, []);

  // Reset processed messages when instance changes
  useEffect(() => {
    processedMessageIds.current.clear();
    setStreamingStates(new Map());
    streamingTimeouts.current.forEach(timeout => clearTimeout(timeout));
    streamingTimeouts.current.clear();
  }, [instanceId]);

  return {
    streamingStates,
    skipStreaming,
    isAnyMessageStreaming: Array.from(streamingStates.values()).some(state => state.isStreaming)
  };
};
