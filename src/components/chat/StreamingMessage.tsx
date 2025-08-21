import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { Clock, SkipForward, Timer, Zap, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CharacterAvatar from './CharacterAvatar';
import EmotionIndicator from './EmotionIndicator';

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
  isQueued?: boolean;
  queuePosition?: number;
  onSkipStreaming: () => void;
}

const StreamingMessage: React.FC<StreamingMessageProps> = ({
  message,
  character,
  streamedContent,
  isStreaming,
  isQueued = false,
  queuePosition = 0,
  onSkipStreaming
}) => {
  const messageType = message.message_type;

  // Throttled display buffer (~50ms)
  const [displayContent, setDisplayContent] = useState<string>(streamedContent);
  const latestRef = useRef<string>(streamedContent);
  const flushTimerRef = useRef<number | null>(null);

  useEffect(() => {
    latestRef.current = streamedContent;
  }, [streamedContent]);

  useEffect(() => {
    // Start timer while streaming
    if (isStreaming && flushTimerRef.current == null) {
      flushTimerRef.current = window.setInterval(() => {
        setDisplayContent(latestRef.current);
      }, 50);
    }

    // Stop timer when not streaming
    if (!isStreaming && flushTimerRef.current != null) {
      window.clearInterval(flushTimerRef.current);
      flushTimerRef.current = null;
      // Final sync
      setDisplayContent(latestRef.current);
    }

    return () => {
      if (flushTimerRef.current != null) {
        window.clearInterval(flushTimerRef.current);
        flushTimerRef.current = null;
      }
    };
  }, [isStreaming]);

  // Pre-sizing logic for consistent bubble dimensions
  const ghostRef = useRef<HTMLDivElement>(null);
  const [bubbleHeight, setBubbleHeight] = useState<number | undefined>(undefined);
  const fullContent = message.message;

  useLayoutEffect(() => {
    if (ghostRef.current && (isStreaming || isQueued)) {
      const height = ghostRef.current.offsetHeight;
      setBubbleHeight(height);
    }
  }, [fullContent, message.mode, character, isStreaming, isQueued]);

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

  const parsedData = messageType === 'ai_response' ? parseAIMessage(displayContent) : null;
  const shownContent = parsedData?.content || displayContent;
  const displayName = parsedData?.character_name || message.character_name || character?.name || 
    (messageType === 'narration' ? 'Narrator' : 'AI');

  // User messages (shouldn't be streamed, but just in case)
  if (messageType === 'user_message') {
    return (
      <div className="flex justify-end">
        <div className="bg-slate-700 text-slate-100 border border-slate-600 rounded-2xl px-4 py-3 min-w-[50%] sm:max-w-[90%] md:max-w-[80%] lg:max-w-[72%] xl:max-w-[68%] shadow-lg break-words whitespace-pre-wrap">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium opacity-80">{message.sender_name}</span>
            {message.mode === 'action' && (
              <span className="text-xs bg-slate-900 text-cyan-400 px-2 py-0.5 rounded-full">
                Action
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed">{shownContent}</p>
        </div>
      </div>
    );
  }

  // System messages
  if (messageType === 'system') {
    return (
      <div className="flex justify-center">
        <div className="bg-slate-800/50 border border-slate-700 text-slate-400 rounded-lg px-4 py-2 text-sm italic max-w-md text-center">
          {shownContent}
          {isStreaming && (
            <span className="inline-flex items-center ml-2">
              <Clock className="w-3 h-3 animate-spin" />
            </span>
          )}
        </div>
      </div>
    );
  }

  // Narration messages - keep styling, apply min-height guard
  if (messageType === 'narration') {
    return (
      <div className="w-full group relative">
        {/* Ghost element for size measurement */}
        <div ref={ghostRef} className="absolute opacity-0 pointer-events-none w-full" aria-hidden="true">
          <div className="bg-slate-800/70 border border-violet-900/30 text-slate-300 px-6 py-4 rounded-xl mx-auto shadow-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wide text-violet-400">Narrator</span>
            </div>
            <p className="text-sm md:text-base whitespace-pre-wrap">{fullContent}</p>
          </div>
        </div>
        
        {/* Actual streaming bubble */}
        <div 
          className="bg-slate-800/70 border border-violet-900/30 text-slate-300 px-6 py-4 rounded-xl mx-auto shadow-lg relative"
          style={{ minHeight: bubbleHeight }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-violet-400">Narrator</span>
            {isQueued && (
              <div className="flex items-center gap-1 text-xs text-violet-300/70">
                <Timer className="w-3 h-3" />
                <span>#{queuePosition + 1}</span>
              </div>
            )}
            {isStreaming && (
              <>
                <Clock className="w-3 h-3 animate-spin text-slate-400" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkipStreaming}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs p-1 h-auto text-slate-400 hover:text-slate-300"
                >
                  <SkipForward className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
          {isQueued ? (
            <p className="text-sm md:text-base whitespace-pre-wrap text-slate-400/60">Waiting to stream...</p>
          ) : (
            <p className="text-sm md:text-base whitespace-pre-wrap">{shownContent}</p>
          )}
        </div>
      </div>
    );
  }

  // AI response messages - keep styling, apply min-height guard and throttled content
  const isActionResponse = message.mode === 'action';
  const parsedFullContent = messageType === 'ai_response' ? parseAIMessage(fullContent) : null;
  
  return (
    <div className="w-full relative">
      {/* Ghost element for size measurement */}
      <div ref={ghostRef} className="absolute opacity-0 pointer-events-none w-full" aria-hidden="true">
        <div className="flex items-start gap-4 sm:w-[90%] md:w-[80%] lg:w-[72%] xl:w-[68%]">
          <div className="shrink-0"><CharacterAvatar character={character} characterName={displayName} size="lg" /></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 ml-1">
              <p className="text-xs font-medium text-slate-300">{displayName}</p>
              {message.mode && (
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  isActionResponse ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {isActionResponse ? <Zap className="w-2.5 h-2.5" /> : <MessageCircle className="w-2.5 h-2.5" />}
                </div>
              )}
              {(parsedFullContent?.internal_state?.emotion || message.internal_state?.emotion) && (
                <EmotionIndicator emotion={parsedFullContent?.internal_state?.emotion || message.internal_state?.emotion} size="sm" />
              )}
            </div>
            <div className={`backdrop-blur text-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-lg border ${isActionResponse ? 'bg-slate-750/40 text-slate-200 border-slate-600' : 'bg-slate-750 text-slate-200 border-slate-600'}`}>
              <p className="text-sm md:text-base whitespace-pre-wrap break-words">{parsedFullContent?.content || fullContent}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actual streaming bubble */}
      <div className="flex items-start gap-4 group sm:w-[90%] md:w-[80%] lg:w-[72%] xl:w-[68%]">
        <div className="shrink-0"><CharacterAvatar character={character} characterName={displayName} size="lg" /></div>
        
        <div className="flex-1 relative min-w-0">
          {/* Character Name and Status Indicators */}
          <div className="flex items-center gap-2 mb-1 ml-1">
            <p className="text-xs font-medium text-slate-300">{displayName}</p>
            {message.mode && (
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                isActionResponse ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'
              }`}>
                {isActionResponse ? (<Zap className="w-2.5 h-2.5" />) : (<MessageCircle className="w-2.5 h-2.5" />)}
              </div>
            )}
            {isQueued && (
              <div className="flex items-center gap-1 text-xs text-slate-400/70">
                <Timer className="w-3 h-3" />
                <span>#{queuePosition + 1}</span>
              </div>
            )}
            {isStreaming && (
              <>
                <Clock className="w-3 h-3 animate-spin text-slate-400" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSkipStreaming}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs p-1 h-auto text-slate-400 hover:text-slate-300"
                >
                  <SkipForward className="w-3 h-3" />
                </Button>
              </>
            )}
            {(parsedData?.internal_state?.emotion || message.internal_state?.emotion) && !isQueued && (
              <EmotionIndicator emotion={parsedData?.internal_state?.emotion || message.internal_state?.emotion} size="sm" />
            )}
          </div>
          
          {/* Message Content */}
          <div className={`backdrop-blur text-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-lg border ${isActionResponse ? 'bg-slate-750/40 text-slate-200 border-slate-600' : 'bg-slate-750 text-slate-200 border-slate-600'}`} style={{ minHeight: bubbleHeight ? bubbleHeight - 60 : undefined }}>
            {isQueued ? (
              <p className="text-sm md:text-base whitespace-pre-wrap text-slate-400/60">Waiting to stream...</p>
            ) : (
              <p className="text-sm md:text-base whitespace-pre-wrap break-words">{shownContent}</p>
            )}
            {isStreaming && (<span className="inline-block w-2 h-4 bg-slate-400 ml-1 animate-pulse" />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(StreamingMessage);