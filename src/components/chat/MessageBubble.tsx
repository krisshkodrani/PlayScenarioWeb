
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import CharacterAvatar from './CharacterAvatar';
import FeedbackModal from './FeedbackModal';

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
}

interface MessageBubbleProps {
  message: Message;
  character?: Character;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, character }) => {
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
        {character && (
          <CharacterAvatar character={character} size="sm" />
        )}
        <div className="flex-1 relative">
          {character && (
            <p className="text-xs text-slate-400 mb-1 ml-1">{character.name}</p>
          )}
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur border border-slate-600 text-white px-4 py-3 rounded-2xl rounded-bl-sm max-w-xs mr-auto shadow-lg">
            <p className="text-sm md:text-base">{message.message}</p>
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
