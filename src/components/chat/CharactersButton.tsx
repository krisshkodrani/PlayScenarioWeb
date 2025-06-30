
import React from 'react';
import { Users } from 'lucide-react';

interface CharactersButtonProps {
  onClick?: () => void;
  hasUpdates?: boolean;
}

const CharactersButton: React.FC<CharactersButtonProps> = ({ onClick, hasUpdates = false }) => {
  return (
    <div className="fixed top-4 right-20 z-50">
      <button
        onClick={onClick}
        className={`relative w-15 h-15 bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur border border-slate-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 hover:border-violet-400/50 hover:shadow-lg hover:shadow-violet-400/30 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          hasUpdates ? 'animate-pulse' : ''
        }`}
        aria-label="View active characters"
      >
        <Users className="w-6 h-6 text-violet-400" />
        
        {/* Update notification badge */}
        {hasUpdates && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-violet-500 rounded-full border-2 border-slate-900 shadow-lg" />
        )}
      </button>
    </div>
  );
};

export default CharactersButton;
