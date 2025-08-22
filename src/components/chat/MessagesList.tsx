import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import MessageBubble from './MessageBubble';
import StreamingMessage from './StreamingMessage';
import TypingIndicator from './TypingIndicator';
import { useSequentialMessageStreaming } from '@/hooks/chat/useSequentialMessageStreaming';
import { testMessageStreamedField } from '@/utils/messageUtils';
import { Message } from '../../types/chat';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar_color: string;
  personality: string;
}

interface MockMessage {
  id: string;
  sender_name: string;
  message: string;
  message_type: 'user_message' | 'ai_response' | 'system' | 'narration';
  timestamp: Date;
  mode?: 'chat' | 'action';
  // Extended fields passed from CoreChat
  turn_number?: number;
  sequence_number?: number;
  character_name?: string;
  response_type?: string;
  internal_state?: any;
  suggested_follow_ups?: string[];
  metrics?: any;
  flags?: any;
  streamed?: boolean;
}

interface MessagesListProps {
  messages: MockMessage[];
  isTyping: boolean;
  typingCharacter?: Character;
  characters: Character[];
  getCharacterById: (id: string) => Character | undefined;
  onSuggestionClick?: (suggestion: string) => void;
  instanceId: string;
  onQueueChange?: (queueLength: number, isStreaming: boolean) => void;
}

// Helper: resolve character from message
function resolveCharacterForMessage(message: MockMessage, characters: Character[]): Character | undefined {
  if (message.message_type !== 'ai_response') return undefined;
  // Try JSON payload character_name
  let characterName: string | undefined;
  try {
    const parsed = JSON.parse(message.message);
    if (parsed && typeof parsed.character_name === 'string') characterName = parsed.character_name;
  } catch {}
  const needle = (characterName || message.sender_name || '').toLowerCase();
  if (!needle) return characters.find(c => c.id !== 'player');
  return (
    characters.find(c => c.name.toLowerCase() === needle) ||
    characters.find(c => c.id.toLowerCase() === needle) ||
    characters.find(c => needle.includes(c.name.toLowerCase())) ||
    characters.find(c => c.id !== 'player')
  );
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  isTyping,
  typingCharacter,
  characters,
  getCharacterById,
  onSuggestionClick,
  instanceId,
  onQueueChange
}) => {
  // Throttled streamed content store
  const [streamedContent, setStreamedContent] = useState<Map<string, string>>(new Map());
  const [completedStreaming, setCompletedStreaming] = useState<Set<string>>(new Set());
  const bufferRef = useRef<Map<string, string>>(new Map());
  const hasPendingRef = useRef<boolean>(false);
  const flushTimerRef = useRef<number | null>(null);

  // Convert MockMessage to Message for streaming hook. Preserve provided sequence_number/turn_number
  const convertedMessages: Message[] = useMemo(() => (
    messages.map((m, index) => ({
      id: m.id,
      sender_name: m.sender_name,
      message: m.message,
      turn_number: m.turn_number ?? 0,
      message_type: m.message_type,
      timestamp: m.timestamp.toISOString(),
      sequence_number: m.sequence_number ?? index,
      mode: m.mode,
      streamed: m.streamed
    }))
  ), [messages]);

  // Single entry point from streaming hook: write to buffer only
  const handleStreamingUpdate = useCallback((messageId: string, content: string, isComplete: boolean) => {
    // Write to buffer and mark pending
    const next = new Map(bufferRef.current);
    next.set(messageId, content);
    bufferRef.current = next;
    hasPendingRef.current = true;

    if (isComplete) {
      setCompletedStreaming(prev => {
        const n = new Set(prev);
        n.add(messageId);
        return n;
      });
    }
  }, []);

  const handleStreamingComplete = useCallback((messageId: string) => {
    // Only auto-scroll if user hasn't manually scrolled up
    const container = document.querySelector('.streaming-container');
    if (!container) return;
    
    const { scrollTop, scrollHeight, clientHeight } = container as HTMLElement;
    const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
    
    if (isNearBottom) {
      setTimeout(() => {
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (messageElement) {
          messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    }
  }, []);

  const { 
    streamingStates, 
    messageQueue, 
    currentStreamingMessageId, 
    skipStreaming, 
    skipAllStreaming,
    isAnyMessageStreaming,
    queueLength
  } = useSequentialMessageStreaming({
    instanceId,
    messages: convertedMessages,
    onStreamingUpdate: handleStreamingUpdate,
    onStreamingComplete: handleStreamingComplete
  });

  // Start/stop a single 50ms flush timer while any message is streaming or queued
  useEffect(() => {
    const shouldRun = isAnyMessageStreaming || queueLength > 0;

    if (shouldRun && flushTimerRef.current == null) {
      flushTimerRef.current = window.setInterval(() => {
        if (!hasPendingRef.current) return;
        // Apply buffered updates in one state set
        setStreamedContent(new Map(bufferRef.current));
        hasPendingRef.current = false;
      }, 50);
    }

    if (!shouldRun && flushTimerRef.current != null) {
      window.clearInterval(flushTimerRef.current);
      flushTimerRef.current = null;
      // Final flush if anything pending
      if (hasPendingRef.current) {
        setStreamedContent(new Map(bufferRef.current));
        hasPendingRef.current = false;
      }
    }

    return () => {
      if (flushTimerRef.current != null) {
        window.clearInterval(flushTimerRef.current);
        flushTimerRef.current = null;
      }
    };
  }, [isAnyMessageStreaming, queueLength]);

  // Notify parent about queue changes for smart scrolling
  useEffect(() => {
    if (onQueueChange) {
      onQueueChange(queueLength, isAnyMessageStreaming);
    }
  }, [queueLength, isAnyMessageStreaming, onQueueChange]);

  // Test database streamed field on mount (debug)
  useEffect(() => {
    testMessageStreamedField();
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Skip All Button - show when messages are queued */}
      {queueLength > 0 && (
        <div className="flex justify-center mb-4">
          <button
            onClick={skipAllStreaming}
            className="bg-slate-600 hover:bg-slate-500 text-white text-sm px-3 py-1 rounded-lg transition-colors"
          >
            Skip All Streaming ({queueLength} remaining)
          </button>
        </div>
      )}
      
      {messages.map((message, index) => {
        const streamingState = streamingStates.get(message.id);
        const isStreamable = message.message_type === 'ai_response' || message.message_type === 'narration';
        const isCurrentlyStreaming = message.id === currentStreamingMessageId;
        const isInQueue = messageQueue.some(m => m.id === message.id) && !isCurrentlyStreaming;
        const shouldStream = isStreamable && streamingState && !completedStreaming.has(message.id) && isCurrentlyStreaming;
        
        // Show typing indicator for queued messages
        if (isInQueue) {
          const convertedMessage: Message = {
            id: message.id,
            sender_name: message.sender_name,
            message: message.message,
            turn_number: message.turn_number ?? 0,
            message_type: message.message_type,
            timestamp: message.timestamp.toISOString(),
            sequence_number: message.sequence_number ?? index,
            mode: message.mode
          };

          const messageCharacter = resolveCharacterForMessage(message, characters);

          return (
            <TypingIndicator
              key={`typing-${message.id}`}
              message={convertedMessage}
              character={messageCharacter}
              queuePosition={streamingState?.position || 0}
            />
          );
        }

        // Show streaming version for currently streaming message
        if (shouldStream) {
          const convertedMessage: Message = {
            id: message.id,
            sender_name: message.sender_name,
            message: message.message,
            turn_number: message.turn_number ?? 0,
            message_type: message.message_type,
            timestamp: message.timestamp.toISOString(),
            sequence_number: message.sequence_number ?? index,
            mode: message.mode
          };

          const messageCharacter = resolveCharacterForMessage(message, characters);

          return (
            <StreamingMessage
              key={message.id}
              message={convertedMessage}
              character={messageCharacter}
              streamedContent={streamedContent.get(message.id) || ''}
              isStreaming={streamingState?.isStreaming || false}
              isQueued={false}
              queuePosition={0}
              onSkipStreaming={() => skipStreaming(message.id)}
            />
          );
        }

        const bubbleCharacter = resolveCharacterForMessage(message, characters);

        // Show normal message bubble (for user messages or completed streaming)
        return (
          <MessageBubble 
            key={message.id}
            message={message as any}
            character={bubbleCharacter}
            onSuggestionClick={onSuggestionClick}
          />
        );
      })}
    </div>
  );
};

export default React.memo(MessagesList);
