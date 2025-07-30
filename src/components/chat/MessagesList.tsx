
import React, { forwardRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { predictRespondingCharacter } from '../../utils/characterPrediction';
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
  // Helper function to get character for AI messages
  const getMessageCharacter = (message: MockMessage) => {
    if (message.message_type === 'user_message') return undefined;
    
    // Try to get character from parsed JSON message
    try {
      const parsed = JSON.parse(message.message);
      if (parsed.character_name) {
        // Find character by name (case insensitive)
        const foundCharacter = characters.find(c => 
          c.name.toLowerCase() === parsed.character_name.toLowerCase()
        );
        return foundCharacter;
      }
    } catch {
      // Fall back to default character lookup if message isn't JSON
    }
    
    return getCharacterById('spock') || undefined;
  };

  // Convert MockMessage to Message for character prediction
  const convertedMessages: Message[] = messages.map(msg => ({
    id: msg.id,
    sender_name: msg.sender_name,
    message: msg.message,
    turn_number: 0,
    message_type: msg.message_type,
    timestamp: msg.timestamp.toISOString(),
    mode: msg.mode,
    character_name: msg.message_type === 'ai_response' ? getMessageCharacter(msg)?.name : undefined
  }));

  // Get the last user message to help with prediction
  const lastUserMessage = convertedMessages
    .filter(msg => msg.message_type === 'user_message')
    .pop();

  // Predict which character should be typing if none is specified
  const predictedCharacter = typingCharacter || predictRespondingCharacter({
    messages: convertedMessages,
    characters,
    lastUserMessage
  });

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
      
      {/* Enhanced Typing Indicator */}
      {isTyping && (
        <TypingIndicator 
          character={predictedCharacter}
          characters={characters}
          recentMessages={convertedMessages.slice(-10)}
          messageMode={lastUserMessage?.mode || 'chat'}
          isSystemResponse={false}
        />
      )}
    </div>
  );
};

export default MessagesList;
