
import React from 'react';
import CharacterAvatar from './CharacterAvatar';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar_color: string;
  personality: string;
}

interface TypingIndicatorProps {
  characters?: Character[];
  character?: Character;
  characterName?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ characters, character, characterName }) => {
  // Determine the display text based on character count
  const getTypingText = () => {
    if (characters && characters.length > 0) {
      return characters.length === 1 ? 'Character is thinking' : 'Characters are thinking';
    }
    return 'thinking';
  };

  const displayName = character?.name || characterName || 'AI';
  
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <CharacterAvatar 
        character={character}
        characterName={displayName}
        size="sm"
      />
      <div className="flex-1 relative">
        <div className="flex items-center gap-2 mb-1 ml-1">
          <p className="text-xs font-medium text-slate-300">
            {displayName}
          </p>
        </div>
        <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur border border-slate-600 text-slate-400 px-4 py-3 rounded-2xl rounded-bl-sm max-w-xs flex items-center gap-3">
          <span className="text-sm text-slate-300">{getTypingText()}</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
