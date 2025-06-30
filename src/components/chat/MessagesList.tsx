
import React from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

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
  message_type: 'user' | 'ai';
  timestamp: Date;
}

interface MessagesListProps {
  messages: MockMessage[];
  isTyping: boolean;
  typingCharacter: Character;
  getCharacterById: (id: string) => Character | undefined;
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  isTyping,
  typingCharacter,
  getCharacterById
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble 
          key={message.id}
          message={message}
          character={message.message_type === 'ai' ? getCharacterById('spock') : undefined}
        />
      ))}
      
      {/* Typing Indicator */}
      {isTyping && (
        <TypingIndicator character={typingCharacter} />
      )}
    </div>
  );
};

export default MessagesList;
