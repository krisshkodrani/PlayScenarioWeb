
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
  onSuggestionClick?: (suggestion: string) => void;
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  isTyping,
  typingCharacter,
  getCharacterById,
  onSuggestionClick
}) => {
  // Helper function to get character for AI messages
  const getMessageCharacter = (message: MockMessage) => {
    if (message.message_type === 'user') return undefined;
    
    // Try to get character from parsed JSON message
    try {
      const parsed = JSON.parse(message.message);
      if (parsed.character_name) {
        // Find character by name or return undefined to use default avatar
        const foundCharacter = getCharacterById(parsed.character_name.toLowerCase());
        return foundCharacter;
      }
    } catch {
      // Fall back to default character lookup if message isn't JSON
    }
    
    return getCharacterById('spock') || undefined;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((message) => (
        <MessageBubble 
          key={message.id}
          message={message}
          character={getMessageCharacter(message)}
          onSuggestionClick={onSuggestionClick}
        />
      ))}
      
      {/* Typing Indicator */}
      {isTyping && (
        <TypingIndicator 
          character={typingCharacter}
          characterName={typingCharacter?.name}
        />
      )}
    </div>
  );
};

export default MessagesList;
