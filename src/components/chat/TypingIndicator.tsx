
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
  character: Character;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ character }) => {
  return (
    <div className="flex items-center gap-3">
      <CharacterAvatar character={character} size="sm" />
      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur border border-slate-600 text-slate-400 px-4 py-3 rounded-2xl rounded-bl-sm max-w-xs">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
