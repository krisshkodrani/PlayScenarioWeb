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
  // Function to remove CHAT/ACTION prefix from user messages for display
  const removeMessagePrefix = (messageContent: string): string => {
    if (messageContent.startsWith('CHAT ')) {
      return messageContent.substring(5);
    }
    if (messageContent.startsWith('ACTION ')) {
      return messageContent.substring(7);
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
  const parsedData = messageType === 'ai_response' ? parseAIMessage(message.message) : null;
  const displayContent = messageType === 'user_message' 
    ? removeMessagePrefix(message.message) 
    : parsedData?.content || message.message;
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
    return (
      <div className="flex justify-end w-full">
        <div className="relative">
          {/* Mode indicator badge */}
          <div className={`absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
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
          
          <div className={`px-4 py-3 rounded-2xl rounded-br-sm min-w-[50%] max-w-[70%] shadow-lg ${
            isActionMessage 
              ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white' 
              : 'bg-gradient-to-br from-cyan-500 to-violet-600 text-white'
          }`}>
            <p className="text-sm md:text-base">{displayContent}</p>
          </div>
        </div>
      </div>
    );
  }

  // System message - full width, centered
  if (messageType === 'system') {
    return (
      <div className="w-full">
        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-200 px-6 py-4 rounded-xl mx-auto text-center shadow-lg shadow-amber-500/10">
          <p className="text-sm md:text-base font-medium">{displayContent}</p>
        </div>
      </div>
    );
  }

  // Narration message - full width, centered with distinct styling
  if (messageType === 'narration') {
    return (
      <div className="w-full">
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-400/30 text-indigo-200 px-6 py-4 rounded-xl mx-auto shadow-lg shadow-indigo-500/10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-300">Narrator</span>
          </div>
          <p className="text-sm md:text-base whitespace-pre-wrap">{message.message}</p>
        </div>
      </div>
    );
  }

  // AI response - left aligned with avatar and features
  const isActionResponse = message.mode === 'action';
  return (
    <div className="w-full">
      <div className="flex items-start gap-3 group w-[70%]">
        {/* Character Avatar */}
        <CharacterAvatar character={character} characterName={displayName} size="sm" />
        
        <div className="flex-1 relative">
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
            {(parsedData?.internal_state?.emotion || message.internal_state?.emotion) && <EmotionIndicator emotion={parsedData?.internal_state?.emotion || message.internal_state?.emotion} size="sm" />}
          </div>
          
          {/* Message Content */}
          <div className={`backdrop-blur text-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-lg ${
            isActionResponse 
              ? 'bg-gradient-to-br from-amber-600/20 to-orange-600/20 border border-amber-500/30' 
              : 'bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600'
          }`}>
            <p className="text-sm md:text-base whitespace-pre-wrap">{displayContent}</p>
            
          </div>
          
          {/* Feedback buttons - positioned at bottom left */}
          <div className="absolute -bottom-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button onClick={() => handleFeedback('positive')} className="bg-slate-700/80 backdrop-blur border border-slate-600 text-slate-400 hover:text-emerald-400 hover:border-emerald-400/50 p-1.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-emerald-400/20" aria-label="Positive feedback">
              <ThumbsUp className="w-3 h-3" />
            </button>
            <button onClick={() => handleFeedback('negative')} className="bg-slate-700/80 backdrop-blur border border-slate-600 text-slate-400 hover:text-red-400 hover:border-red-400/50 p-1.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-400/20" aria-label="Negative feedback">
              <ThumbsDown className="w-3 h-3" />
            </button>
            {onSuggestionClick && ((parsedData?.suggested_follow_ups || message.suggested_follow_ups)?.length ?? 0) > 0 && (
              <button
                onClick={() => setShowSuggestionsModal(true)}
                className="bg-slate-700/80 backdrop-blur border border-slate-600 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 p-1.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-400/20"
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