
import React, { forwardRef } from 'react';
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
  message_type: 'user_message' | 'ai_response' | 'system';
  timestamp: Date;
}

interface MessagesListProps {
  messages: MockMessage[];
  isTyping: boolean;
  typingCharacter: Character;
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
  // Helper function to get character for AI messages
  const getMessageCharacter = (message: MockMessage) => {
    if (message.message_type === 'user_message') return undefined;
    
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

  // Find the index of the last AI message
  const lastAiMessageIndex = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].message_type === 'ai_response') {
        return i;
      }
    }
    return -1;
  })();

  return (
    <div className="p-4 space-y-6">
      {messages.map((message, index) => (
        <MessageBubble 
          key={message.id}
          message={message}
          character={getMessageCharacter(message)}
          onSuggestionClick={index === lastAiMessageIndex ? onSuggestionClick : undefined}
        />
      ))}
      
      {/* Typing Indicator */}
      {isTyping && (
        <TypingIndicator 
          characters={characters}
          character={typingCharacter}
          characterName={typingCharacter?.name}
        />
      )}
    </div>
  );
};

export default MessagesList;
