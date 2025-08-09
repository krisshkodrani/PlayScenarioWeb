import React from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
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
  message_type: 'user_message' | 'ai_response' | 'system';
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
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  isTyping,
  typingCharacter,
  characters,
  getCharacterById,
  onSuggestionClick
}) => {
  return (
    <div className="p-4 space-y-6">
      {messages.map((message, index) => (
        <MessageBubble 
          key={message.id}
          message={message}
          character={message.message_type === 'ai_response' ? undefined : undefined}
          onSuggestionClick={onSuggestionClick}
        />
      ))}
      {isTyping && (
        <TypingIndicator 
          character={undefined}
          characters={characters}
          recentMessages={messages.map(m => ({
            id: m.id,
            sender_name: m.sender_name,
            message: m.message,
            turn_number: 0,
            message_type: m.message_type,
            timestamp: m.timestamp.toISOString(),
            mode: m.mode
          }))}
        />
      )}
    </div>
  );
};

export default MessagesList;
