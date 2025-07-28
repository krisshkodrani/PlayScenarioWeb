
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import CharacterAvatar from './CharacterAvatar';
import FeedbackModal from './FeedbackModal';
import FollowUpSuggestions from './FollowUpSuggestions';
import EmotionIndicator from './EmotionIndicator';
import MetricsDisplay from './MetricsDisplay';

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

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, character, onSuggestionClick }) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'positive' | 'negative'>('positive');
  const isUser = message.message_type === 'user';

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedbackType(type);
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = (type: string, details?: string) => {
    console.log('Feedback submitted:', { type, details, messageId: message.id });
    // Here you would typically send the feedback to your backend
  };

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-gradient-to-br from-cyan-500 to-violet-600 text-white px-4 py-3 rounded-2xl rounded-br-sm max-w-xs ml-auto shadow-lg">
          <p className="text-sm md:text-base">{message.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-start gap-3 group">
        {/* Character Avatar - use character_name from message if available */}
        <CharacterAvatar 
          character={character} 
          characterName={message.character_name}
          size="sm" 
        />
        
        <div className="flex-1 relative">
          {/* Character Name and Emotion */}
          <div className="flex items-center gap-2 mb-1 ml-1">
            <p className="text-xs text-slate-400">
              {message.character_name || character?.name || 'AI'}
            </p>
            {message.internal_state?.emotion && (
              <EmotionIndicator emotion={message.internal_state.emotion} size="sm" />
            )}
            {message.metrics && (
              <MetricsDisplay metrics={message.metrics} />
            )}
          </div>
          
          {/* Message Content */}
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur border border-slate-600 text-white px-4 py-3 rounded-2xl rounded-bl-sm max-w-xs mr-auto shadow-lg">
            <p className="text-sm md:text-base">{message.message}</p>
            
            {/* Character Thoughts - Expandable */}
            {message.internal_state?.thoughts && (
              <div className="mt-2 pt-2 border-t border-slate-600/50">
                <p className="text-xs text-slate-400 italic">
                  💭 {message.internal_state.thoughts}
                </p>
              </div>
            )}
          </div>
          
          {/* Feedback buttons - positioned at bottom left */}
          <div className="absolute -bottom-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => handleFeedback('positive')}
              className="bg-slate-700/80 backdrop-blur border border-slate-600 text-slate-400 hover:text-emerald-400 hover:border-emerald-400/50 p-1.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-emerald-400/20"
              aria-label="Positive feedback"
            >
              <ThumbsUp className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleFeedback('negative')}
              className="bg-slate-700/80 backdrop-blur border border-slate-600 text-slate-400 hover:text-red-400 hover:border-red-400/50 p-1.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-400/20"
              aria-label="Negative feedback"
            >
              <ThumbsDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Follow-up Suggestions */}
      {message.suggested_follow_ups && onSuggestionClick && (
        <FollowUpSuggestions 
          suggestions={message.suggested_follow_ups}
          onSuggestionClick={onSuggestionClick}
        />
      )}

      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
        feedbackType={feedbackType}
      />
    </>
  );
};

export default MessageBubble;
