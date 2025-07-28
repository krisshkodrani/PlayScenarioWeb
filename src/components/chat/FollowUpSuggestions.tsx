import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FollowUpSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const FollowUpSuggestions: React.FC<FollowUpSuggestionsProps> = ({
  suggestions,
  onSuggestionClick
}) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-3 ml-11">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center gap-1.5 group"
        >
          <span>{suggestion}</span>
          <ArrowRight className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
        </button>
      ))}
    </div>
  );
};

export default FollowUpSuggestions;