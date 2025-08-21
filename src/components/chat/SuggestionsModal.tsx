import React, { useEffect } from 'react';
import { X, ArrowRightCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPortal } from 'react-dom';

interface SuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

const SuggestionsModal: React.FC<SuggestionsModalProps> = ({
  isOpen,
  onClose,
  suggestions,
  onSelect
}) => {
  if (!isOpen) return null;

  const handleSelect = (s: string) => {
    onSelect(s);
  };

  // Lock body scroll and add Escape to close while open
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  const content = (
    <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-lg shadow-cyan-400/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ArrowRightCircle className="w-5 h-5 text-cyan-400" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-white">Follow-up Suggestions</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close suggestions modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {(!suggestions || suggestions.length === 0) ? (
          <p className="text-slate-400 text-sm">No suggestions available.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(s)}
                className="w-full text-left bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 group"
                aria-label={`Use suggestion: ${s}`}
              >
                <span className="flex-1">{s}</span>
                <ArrowRightCircle className="w-4 h-4 opacity-60 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default SuggestionsModal;
