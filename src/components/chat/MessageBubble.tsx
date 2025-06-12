
import React from 'react';
import CharacterAvatar from './CharacterAvatar';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar_color: string;
  personality: string;
}

interface Message {
  id: string;
  sender_name: string;
  message: string;
  message_type: 'user' | 'ai';
  character_id?: string;
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
  character?: Character;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, character }) => {
  const isUser = message.message_type === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-cyan-400 text-slate-900 px-4 py-3 rounded-2xl rounded-br-sm max-w-xs ml-auto">
          <p className="text-sm md:text-base">{message.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      {character && (
        <CharacterAvatar character={character} size="sm" />
      )}
      <div className="flex-1">
        {character && (
          <p className="text-xs text-slate-400 mb-1 ml-1">{character.name}</p>
        )}
        <div className="bg-slate-800 text-white px-4 py-3 rounded-2xl rounded-bl-sm max-w-xs mr-auto">
          <p className="text-sm md:text-base">{message.message}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
