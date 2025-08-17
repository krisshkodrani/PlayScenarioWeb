import React, { useState, useCallback } from 'react';
import MessageBubble from './MessageBubble';
import StreamingMessage from './StreamingMessage';
import TypingIndicator from './TypingIndicator';
import { useMessageStreaming } from '@/hooks/chat/useMessageStreaming';
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
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  isTyping,
  typingCharacter,
  characters,
  getCharacterById,
  onSuggestionClick,
  instanceId
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
    mode: m.mode
  }));

  const handleStreamingUpdate = useCallback((messageId: string, content: string, isComplete: boolean) => {
    setStreamedContent(prev => new Map(prev).set(messageId, content));
    if (isComplete) {
      setCompletedStreaming(prev => new Set(prev).add(messageId));
    }
  }, []);

  const { streamingStates, skipStreaming } = useMessageStreaming({
    instanceId,
    messages: convertedMessages,
    onStreamingUpdate: handleStreamingUpdate
  });
  return (
    <div className="p-4 space-y-6">
      {messages.map((message, index) => {
        const streamingState = streamingStates.get(message.id);
        const isStreamable = message.message_type === 'ai_response' || message.message_type === 'narration';
        const shouldStream = isStreamable && streamingState && !completedStreaming.has(message.id);
        
        if (shouldStream) {
          // Show streaming version
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
              isStreaming={streamingState.isStreaming}
              onSkipStreaming={() => skipStreaming(message.id)}
            />
          );
        }

        // Show normal message bubble (for user messages or completed streaming)
        return (
          <MessageBubble 
            key={message.id}
            message={message}
            character={message.message_type === 'ai_response' ? getCharacterById?.('ai') : undefined}
            onSuggestionClick={onSuggestionClick}
          />
        );
      })}
      {isTyping && (
        <TypingIndicator 
          character={undefined}
          characters={characters}
          recentMessages={convertedMessages}
        />
      )}
    </div>
  );
};

export default MessagesList;
