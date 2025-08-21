import React from 'react';
import { Zap, MessageCircle } from 'lucide-react';
import CharacterAvatar from './CharacterAvatar';
import EmotionIndicator from './EmotionIndicator';
import { Message } from '../../types/chat';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar_color: string;
  personality: string;
}

interface TypingIndicatorProps {
  message: Message;
  character?: Character;
  queuePosition: number;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  message,
  character,
  queuePosition
}) => {
  // Parse AI message for character info
  const parseAIMessage = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      return {
        character_name: parsed.character_name,
        internal_state: parsed.internal_state
      };
    } catch {
      return {
        character_name: null,
        internal_state: null
      };
    }
  };

  const parsedData = message.message_type === 'ai_response' ? parseAIMessage(message.message) : null;
  const displayName = parsedData?.character_name || message.character_name || character?.name || 
    (message.message_type === 'narration' ? 'Narrator' : 'AI');

  const isActionResponse = message.mode === 'action';

  // Narrator typing indicator
  if (message.message_type === 'narration') {
    return (
      <div className="w-full group">
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-400/30 text-indigo-200 px-6 py-4 rounded-xl mx-auto shadow-lg shadow-indigo-500/10 relative">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-300">Narrator</span>
            <div className="flex items-center gap-1 text-xs text-indigo-400/70">
              <span>#{queuePosition + 1} in queue</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm md:text-base text-indigo-300/80">is crafting the scene</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AI character typing indicator
  return (
    <div className="w-full">
      <div className="flex items-start gap-4 group sm:w-[90%] md:w-[80%] lg:w-[72%] xl:w-[68%]">
        {/* Character Avatar */}
        <div className="shrink-0"><CharacterAvatar character={character} characterName={displayName} size="lg" /></div>
        
        <div className="flex-1 relative min-w-0">
          {/* Character Name and Status Indicators */}
          <div className="flex items-center gap-2 mb-1 ml-1">
            <p className="text-xs font-medium text-slate-300">
              {displayName}
            </p>
            {/* Mode indicator for AI responses */}
            {message.mode && (
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                isActionResponse ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'
              }`}>
                {isActionResponse ? (
                  <Zap className="w-2.5 h-2.5" />
                ) : (
                  <MessageCircle className="w-2.5 h-2.5" />
                )}
              </div>
            )}
            {/* Queue position indicator */}
            <div className="flex items-center gap-1 text-xs text-slate-400/70">
              <span>#{queuePosition + 1} in queue</span>
            </div>
            {/* Emotion indicator if available */}
            {(parsedData?.internal_state?.emotion || message.internal_state?.emotion) && (
              <EmotionIndicator emotion={parsedData?.internal_state?.emotion || message.internal_state?.emotion} size="sm" />
            )}
          </div>
          
          {/* Typing Animation */}
          <div className={`backdrop-blur text-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-lg ${
            isActionResponse 
              ? 'bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30' 
              : 'bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base text-slate-400/80">
                {isActionResponse ? 'is preparing an action' : 'is typing'}
              </span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;