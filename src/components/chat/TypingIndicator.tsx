
import React from 'react';
import CharacterAvatar from './CharacterAvatar';
import { getCharacterTypingMessage, shouldShowMultipleCharacters } from '../../utils/characterPrediction';
import { Message } from '../../types/chat';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar_color: string;
  personality: string;
}

interface TypingIndicatorProps {
  character?: Character;
  characters?: Character[];
  recentMessages?: Message[];
  messageMode?: 'chat' | 'action';
  isSystemResponse?: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  character, 
  characters = [], 
  recentMessages = [],
  messageMode = 'chat',
  isSystemResponse = false 
}) => {
  // Handle system responses differently
  if (isSystemResponse) {
    return (
      <div className="flex items-start gap-3 animate-fade-in">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400/20 to-violet-400/20 rounded-full flex items-center justify-center shrink-0">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
        </div>
        <div className="flex-1 relative">
          <div className="flex items-center gap-2 mb-1 ml-1">
            <p className="text-xs font-medium text-slate-300">Scenario</p>
          </div>
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur border border-slate-600 text-slate-400 px-4 py-3 rounded-2xl rounded-bl-sm max-w-xs flex items-center gap-3">
            <span className="text-sm text-slate-300">Updating scenario...</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if multiple characters might respond
  const multipleActive = shouldShowMultipleCharacters(characters, recentMessages);
  
  // Generate character-specific typing message
  const typingMessage = getCharacterTypingMessage(character, messageMode);
  
  // For multiple character scenarios, show group indicator
  if (multipleActive && !character) {
    return (
      <div className="flex items-start gap-3 animate-fade-in">
        <div className="flex -space-x-2">
          {characters.slice(0, 3).map((char, index) => (
            <CharacterAvatar 
              key={char.id}
              character={char}
              size="sm"
            />
          ))}
          {characters.length > 3 && (
            <div className="w-8 h-8 bg-slate-700 border-2 border-slate-900 rounded-full flex items-center justify-center text-xs text-slate-300 font-medium">
              +{characters.length - 3}
            </div>
          )}
        </div>
        <div className="flex-1 relative">
          <div className="flex items-center gap-2 mb-1 ml-1">
            <p className="text-xs font-medium text-slate-300">Characters</p>
          </div>
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur border border-slate-600 text-slate-400 px-4 py-3 rounded-2xl rounded-bl-sm max-w-xs flex items-center gap-3">
            <span className="text-sm text-slate-300">
              {messageMode === 'action' ? 'Discussing your action...' : 'Thinking together...'}
            </span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Single character or predicted character response
  const displayName = character?.name || 'AI Assistant';
  
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
          {messageMode === 'action' && (
            <span className="text-xs px-2 py-0.5 bg-amber-400/20 text-amber-400 rounded-full border border-amber-400/30">
              Action
            </span>
          )}
        </div>
        <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur border border-slate-600 text-slate-400 px-4 py-3 rounded-2xl rounded-bl-sm max-w-xs flex items-center gap-3">
          <span className="text-sm text-slate-300">{typingMessage}</span>
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
