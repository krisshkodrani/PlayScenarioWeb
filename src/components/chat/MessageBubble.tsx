import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, Zap, Lightbulb } from 'lucide-react';
import CharacterAvatar from './CharacterAvatar';
import FeedbackModal from './FeedbackModal';
import SuggestionsModal from './SuggestionsModal';
import EmotionIndicator from './EmotionIndicator';
import MetricsDisplay from './MetricsDisplay';
import { reactionService } from '@/services/reactionService';
import { useToast } from '@/hooks/use-toast';
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
  message_type: 'user_message' | 'ai_response' | 'system' | 'narration';
  character_id?: string;
  timestamp: Date;
  mode?: 'chat' | 'action';
  // Enhanced fields for rich AI responses
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
}
interface MessageBubbleProps {
  message: Message;
  character?: Character;
  onSuggestionClick?: (suggestion: string) => void;
}
const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  character,
  onSuggestionClick
}) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'positive' | 'negative'>('positive');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const { toast } = useToast();
  const messageType = message.message_type;
  // Parse JSON message for AI responses
  // Function to remove CHAT/ACTION or SAY/DO prefix from user messages for display
  const removeMessagePrefix = (messageContent: string): string => {
    const prefixes = ['SAY ', 'DO ', 'CHAT ', 'ACTION '];
    for (const p of prefixes) {
      if (messageContent.startsWith(p)) {
        return messageContent.substring(p.length);
      }
    }
    return messageContent;
  };

  const parseAIMessage = (messageContent: string) => {
    try {
      const parsed = JSON.parse(messageContent);
      return {
        content: parsed.content || messageContent,
        character_name: parsed.character_name,
        internal_state: parsed.internal_state,
        suggested_follow_ups: parsed.suggested_follow_ups,
        metrics: parsed.metrics,
        flags: parsed.flags
      };
    } catch {
      // If not JSON, return as plain text
      return {
        content: messageContent,
        character_name: null,
        internal_state: null,
        suggested_follow_ups: null,
        metrics: null,
        flags: null
      };
    }
  };

  // Remove a trailing streaming cursor (on its own line) from AI content just in case
  const stripStreamingCursor = (text: string) => text.replace(/(?:\r?\n|^)[▍▋▌█⎸|]\s*$/u, '');
  const parsedData = messageType === 'ai_response' ? parseAIMessage(message.message) : null;
  const rawContent = messageType === 'user_message' ? removeMessagePrefix(message.message) : parsedData?.content || message.message;
  const displayContent = messageType === 'ai_response' ? stripStreamingCursor(rawContent) : rawContent;
  const displayName = parsedData?.character_name || message.character_name || character?.name || (messageType === 'narration' ? 'Narrator' : 'AI');
  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedbackType(type);
    setShowFeedbackModal(true);
  };
  // Map frontend feedback type to database reaction type
  const mapFeedbackTypeToReaction = (feedbackType: string): 'like' | 'dislike' => {
    return feedbackType === 'positive' ? 'like' : 'dislike';
  };

  const handleFeedbackSubmit = async (type: string, details?: string) => {
    try {
      setIsSubmittingFeedback(true);
      
      await reactionService.submitMessageReaction({
        messageId: message.id,
        reactionType: mapFeedbackTypeToReaction(type),
        feedbackDetails: details
      });
      
      setShowFeedbackModal(false);
      setFeedbackType('positive');
      
      // Show success feedback to user
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      toast({
        title: "Failed to submit feedback",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };
  // User message - right aligned
  if (messageType === 'user_message') {
    const isActionMessage = message.mode === 'action';
    const isOptimistic = typeof message.id === 'string' && message.id.startsWith('user-');
    
    // Calculate dynamic width based on content length
    const contentLength = displayContent.length;
    const getMessageWidth = () => {
      if (contentLength <= 20) return 'w-fit max-w-[40%]'; // Short messages
      if (contentLength <= 50) return 'w-fit max-w-[55%]'; // Medium messages  
      return 'w-fit max-w-[70%]'; // Long messages
    };
    
    return (
      <div className="w-full">
        {/* Match AI row widths and align to the right */}
        <div className="flex items-start justify-end sm:w-[90%] md:w-[80%] lg:w-[72%] xl:w-[68%] ml-auto">
          <div className="relative min-w-0">
            {/* Mode indicator badge (top-right for right-aligned bubble) */}
            <div className={`absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
              isActionMessage 
                ? 'bg-amber-500 text-slate-900' 
                : 'bg-cyan-500 text-slate-900'
            }`}>
              {isActionMessage ? (
                <Zap className="w-3 h-3" />
              ) : (
                <MessageCircle className="w-3 h-3" />
              )}
            </div>
            
            {/* Bubble */}
            <div className={`backdrop-blur px-4 py-3 rounded-2xl rounded-br-sm shadow-lg border break-words whitespace-pre-wrap text-slate-200 border-slate-600 ${
              isActionMessage 
                ? 'bg-slate-750/40' 
                : 'bg-slate-750'
            } ${isOptimistic ? 'opacity-70' : ''} min-w-0 max-w-full`}>
              <p className="text-sm md:text-base">{displayContent}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // System message - full width, centered
  if (messageType === 'system') {
    return (
      <div className="w-full">
        <div className="bg-slate-800/50 border border-slate-700 text-slate-400 px-6 py-4 rounded-xl mx-auto text-center">
          <p className="text-sm md:text-base font-medium">{displayContent}</p>
        </div>
      </div>
    );
  }

  // Narration message - aligned like AI messages but with distinct styling
  if (messageType === 'narration') {
    return (
      <div className="w-full">
        <div className="flex items-start gap-4 sm:w-[90%] md:w-[80%] lg:w-[72%] xl:w-[68%]">
          <div className="flex-1 relative min-w-0">
            <div className="w-full bg-slate-800/70 border border-violet-900/30 text-slate-300 px-6 py-4 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wide text-violet-400">Narrator</span>
              </div>
              <p className="text-sm md:text-base whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AI response - left aligned with avatar and features
  const isActionResponse = message.mode === 'action';
  return (
    <div className="w-full">
      <div className="flex items-start gap-4 group sm:w-[90%] md:w-[80%] lg:w-[72%] xl:w-[68%]">
        {/* Character Avatar */}
        <div className="shrink-0">
          <CharacterAvatar character={character} characterName={displayName} size="lg" />
        </div>
        
        <div className="flex-1 relative min-w-0">
          {/* Character Name and Status Indicators */}
          <div className="flex items-center gap-2 mb-1 ml-1">
            <p className="text-xs font-medium text-slate-300">
              {displayName}
            </p>
            {/* Mode indicator for AI responses */}
            {message.mode && (
              <div className={`w-auto h-5 px-2 rounded-full flex items-center justify-center border text-[10px] tracking-wide uppercase ${
                isActionResponse ? 'border-amber-500/40 text-amber-400' : 'border-cyan-500/40 text-cyan-400'
              }`}>
                {isActionResponse ? 'DO' : 'SAY'}
              </div>
            )}
            {/* Emotion indicator */}
            {(parsedData?.internal_state?.emotion || message.internal_state?.emotion) && (
              <EmotionIndicator emotion={parsedData?.internal_state?.emotion || message.internal_state?.emotion} size="sm" />
            )}
          </div>
          
          {/* Message Content */}
          <div className={`backdrop-blur px-4 py-3 rounded-2xl rounded-bl-sm shadow-lg border ${
            isActionResponse 
              ? 'bg-slate-750/40 text-slate-200 border-slate-600' 
              : 'bg-slate-750 text-slate-200 border-slate-600'
          }`}>
            <p className="text-sm md:text-base whitespace-pre-wrap break-words">{displayContent}</p>
          </div>
          
          {/* Feedback buttons - positioned at bottom left */}
          <div className="absolute -bottom-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button onClick={() => handleFeedback('positive')} className="bg-slate-700/80 backdrop-blur border border-slate-600 text-slate-400 hover:text-emerald-400 hover:border-emerald-400/50 p-1.5 rounded-lg transition-all duration-200" aria-label="Positive feedback">
              <ThumbsUp className="w-3 h-3" />
            </button>
            <button onClick={() => handleFeedback('negative')} className="bg-slate-700/80 backdrop-blur border border-slate-600 text-slate-400 hover:text-red-400 hover:border-red-400/50 p-1.5 rounded-lg transition-all duration-200" aria-label="Negative feedback">
              <ThumbsDown className="w-3 h-3" />
            </button>
            {onSuggestionClick && ((parsedData?.suggested_follow_ups || message.suggested_follow_ups)?.length ?? 0) > 0 && (
              <button
                onClick={() => setShowSuggestionsModal(true)}
                className="bg-slate-700/80 backdrop-blur border border-slate-600 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 p-1.5 rounded-lg transition-all duration-200"
                aria-label="Show follow-up suggestions"
              >
                <Lightbulb className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      <SuggestionsModal
        isOpen={showSuggestionsModal}
        onClose={() => setShowSuggestionsModal(false)}
        suggestions={(parsedData?.suggested_follow_ups || message.suggested_follow_ups) ?? []}
        onSelect={(s) => { onSuggestionClick?.(s); setShowSuggestionsModal(false); }}
      />

      <FeedbackModal 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)} 
        onSubmit={handleFeedbackSubmit} 
        feedbackType={feedbackType}
        isSubmitting={isSubmittingFeedback}
      />
    </div>
  );
};
export default MessageBubble;