
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string, details?: string) => void;
  feedbackType: 'positive' | 'negative';
  isSubmitting?: boolean;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  feedbackType,
  isSubmitting = false
}) => {
  const [details, setDetails] = useState('');

  const handleSubmit = () => {
    onSubmit(feedbackType, details.trim() || undefined);
    setDetails('');
  };

  const handleCancel = () => {
    setDetails('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-lg shadow-cyan-400/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Feedback</h3>
          <button
            onClick={handleCancel}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close feedback modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-4">
          <label 
            htmlFor="feedback-details" 
            className="block text-sm text-slate-300 mb-2"
          >
            Please provide details: (optional)
          </label>
          <textarea
            id="feedback-details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder={feedbackType === 'positive' 
              ? "What was satisfying about this response?" 
              : "What could be improved about this response?"
            }
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200 resize-vertical min-h-[100px]"
            rows={4}
          />
        </div>
        
        <p className="text-xs text-slate-400 mb-6">
          Submitting this report will send the entire current conversation to 
          Anthropic for future improvements to our models.{' '}
          <a 
            href="#" 
            className="text-cyan-400 hover:text-cyan-300 underline"
            onClick={(e) => e.preventDefault()}
          >
            Learn More
          </a>
        </p>
        
        <div className="flex gap-3 justify-end">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="border-gray-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-cyan-400 text-slate-900 hover:bg-cyan-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
