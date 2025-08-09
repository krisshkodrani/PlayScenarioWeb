import React from 'react';
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
  // System response: keep existing specialized indicator
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

  // Minimal, standalone typing indicator (no avatar, no bubble)
  // Aligned roughly with AI message content start
  return (
    <div className="flex items-center animate-fade-in">
      <span className="sr-only">Assistant is responding</span>
      <div className="ml-11 flex gap-1" aria-live="polite" aria-atomic="true">
        <div className="w-2 h-2 bg-slate-300/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-slate-300/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-slate-300/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
