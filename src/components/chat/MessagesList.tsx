import React, { useState, useCallback, useEffect } from 'react';
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
  const [streamedContent, setStreamedContent] = useState<Map<string, string>>(new Map());
  const [completedStreaming, setCompletedStreaming] = useState<Set<string>>(new Set());

  // Convert MockMessage to Message for streaming hook
  const convertedMessages: Message[] = messages.map(m => ({
    id: m.id,
    sender_name: m.sender_name,
    message: m.message,
    turn_number: 0,
    message_type: m.message_type,
    timestamp: m.timestamp.toISOString(),
    sequence_number: messages.indexOf(m),
    mode: m.mode,
    streamed: (m as any).streamed
  }));

  const handleStreamingUpdate = useCallback((messageId: string, content: string, isComplete: boolean) => {
    setStreamedContent(prev => new Map(prev).set(messageId, content));
    if (isComplete) {
      setCompletedStreaming(prev => new Set(prev).add(messageId));
    }
  }, []);

  const handleStreamingComplete = useCallback((messageId: string) => {
    // Trigger scroll to ensure full message is visible
    setTimeout(() => {
      const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
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
            turn_number: 0,
            message_type: message.message_type,
            timestamp: message.timestamp.toISOString(),
            sequence_number: index,
            mode: message.mode
          };

          // Find the right character for this AI message
          let messageCharacter: Character | undefined;
          if (message.message_type === 'ai_response') {
            // Try to find character by name from parsed message or fallback to first AI character
            const parsedData = (() => {
              try {
                const parsed = JSON.parse(message.message);
                return parsed.character_name ? parsed : null;
              } catch {
                return null;
              }
            })();
            
            const characterName = parsedData?.character_name || message.sender_name;
            messageCharacter = characters.find(char => 
              char.name === characterName || 
              char.id === characterName ||
              (char.id !== 'player' && characterName?.toLowerCase().includes(char.name.toLowerCase()))
            ) || characters.find(char => char.id !== 'player'); // Fallback to first non-player character
          }

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
            turn_number: 0,
            message_type: message.message_type,
            timestamp: message.timestamp.toISOString(),
            sequence_number: index,
            mode: message.mode
          };

          return (
            <StreamingMessage
              key={message.id}
              message={convertedMessage}
              character={getCharacterById ? getCharacterById('ai') : undefined}
              streamedContent={streamedContent.get(message.id) || ''}
              isStreaming={streamingState?.isStreaming || false}
              isQueued={false}
              queuePosition={0}
              onSkipStreaming={() => skipStreaming(message.id)}
            />
          );
        }

        // Show normal message bubble (for user messages or completed streaming)
        return (
          <div key={message.id} data-message-id={message.id}>
            <MessageBubble 
              message={message}
              character={message.message_type === 'ai_response' ? getCharacterById?.('ai') : undefined}
              onSuggestionClick={onSuggestionClick}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MessagesList;
