import React from 'react';
import { Clock, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  turn_number: number;
  message_type: 'user_message' | 'ai_response' | 'system' | 'narration';
  timestamp: string;
  sequence_number?: number;
  mode?: 'chat' | 'action';
  character_name?: string;
  response_type?: string;
  internal_state?: {
    emotion: string;
    thoughts: string;
    objective_impact: string;
  };
  suggested_follow_ups?: string[];
  metrics?: {
    authenticity: number;
    relevance: number;
    engagement: number;
    consistency: number;
  };
  flags?: {
    requires_other_character: boolean;
    advances_objective: boolean;
    reveals_information: boolean;
  };
}

interface StreamingMessageProps {
  message: Message;
  character?: Character;
  streamedContent: string;
  isStreaming: boolean;
  onSkipStreaming: () => void;
}

const StreamingMessage: React.FC<StreamingMessageProps> = ({
  message,
  character,
  streamedContent,
  isStreaming,
  onSkipStreaming
}) => {
  const messageType = message.message_type;

  // Parse AI message for enhanced data
  const parseAIMessage = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      return {
        content: parsed.content || content,
        character_name: parsed.character_name,
        internal_state: parsed.internal_state,
        suggested_follow_ups: parsed.suggested_follow_ups,
        metrics: parsed.metrics
      };
    } catch {
      return { content };
    }
  };

  const parsedData = messageType === 'ai_response' ? parseAIMessage(streamedContent) : null;
  const displayContent = parsedData?.content || streamedContent;
  const displayName = parsedData?.character_name || message.character_name || character?.name || 
    (messageType === 'narration' ? 'Narrator' : 'AI');

  // User messages (shouldn't be streamed, but just in case)
  if (messageType === 'user_message') {
    return (
      <div className="flex justify-end">
        <div className="bg-cyan-400 text-slate-900 rounded-2xl px-4 py-3 max-w-xs lg:max-w-md xl:max-w-lg shadow-lg shadow-cyan-400/20">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium opacity-80">{message.sender_name}</span>
            {message.mode === 'action' && (
              <span className="text-xs bg-slate-900 text-cyan-400 px-2 py-0.5 rounded-full">
                Action
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed">{displayContent}</p>
        </div>
      </div>
    );
  }

  // System messages
  if (messageType === 'system') {
    return (
      <div className="flex justify-center">
        <div className="bg-slate-700 text-slate-300 rounded-lg px-4 py-2 text-sm italic max-w-md text-center">
          {displayContent}
          {isStreaming && (
            <span className="inline-flex items-center ml-2">
              <Clock className="w-3 h-3 animate-spin" />
            </span>
          )}
        </div>
      </div>
    );
  }

  // Narration messages
  if (messageType === 'narration') {
    return (
      <div className="flex justify-center group">
        <div className="bg-amber-400/10 border border-amber-400/30 text-amber-300 rounded-lg px-4 py-3 text-sm italic max-w-lg text-center relative">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="font-medium">Narrator</span>
            {isStreaming && (
              <>
                <Clock className="w-3 h-3 animate-spin text-amber-400" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkipStreaming}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs p-1 h-auto text-amber-400 hover:text-amber-300"
                >
                  <SkipForward className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
          <p className="leading-relaxed">{displayContent}</p>
        </div>
      </div>
    );
  }

  // AI response messages
  return (
    <div className="flex justify-start group">
      <div className="flex gap-3 max-w-xs lg:max-w-md xl:max-w-lg">
        {/* Character avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${character?.avatar_color || 'bg-violet-600'}`}>
          {displayName.charAt(0).toUpperCase()}
        </div>
        
        <div className="bg-slate-700 text-white rounded-2xl px-4 py-3 shadow-lg shadow-violet-400/10 relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-violet-300">{displayName}</span>
            {isStreaming && (
              <>
                <Clock className="w-3 h-3 animate-spin text-violet-400" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkipStreaming}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs p-1 h-auto text-violet-400 hover:text-violet-300"
                >
                  <SkipForward className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
          
          {/* Show emotion indicator if available */}
          {parsedData?.internal_state?.emotion && (
            <div className="text-xs text-slate-400 mb-2 italic">
              *{parsedData.internal_state.emotion}*
            </div>
          )}
          
          <p className="text-sm leading-relaxed">{displayContent}</p>
          
          {/* Show cursor while streaming */}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-violet-400 ml-1 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};

export default StreamingMessage;