
import React from 'react';
import { Clock, Users } from 'lucide-react';

interface ChatHeaderProps {
  scenarioTitle: string;
  currentTurn: number;
  maxTurns: number;
  progressPercentage: number;
  hasObjectiveUpdates: boolean;
  hasCharacterUpdates: boolean;
  onToggleObjectiveDrawer: () => void;
  onToggleCharacterDrawer: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  scenarioTitle,
  currentTurn,
  maxTurns,
  progressPercentage,
  hasObjectiveUpdates,
  hasCharacterUpdates,
  onToggleObjectiveDrawer,
  onToggleCharacterDrawer
}) => {
  return (
    <div className="sticky top-0 bg-gradient-to-r from-slate-800/95 to-slate-700/80 backdrop-blur-lg border-b border-slate-600 shadow-lg shadow-slate-900/50 p-4 z-10">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1 className="text-lg font-semibold text-cyan-400">{scenarioTitle}</h1>
        
        {/* Right Side Indicators */}
        <div className="flex items-center gap-3">
          {/* Turns Indicator */}
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur border border-slate-600 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
            <Clock className="w-4 h-4 text-cyan-400" />
            <div className="flex items-center gap-1 text-sm font-medium">
              <span className="text-white">{currentTurn}</span>
              <span className="text-slate-400">/</span>
              <span className="text-slate-400">{maxTurns}</span>
            </div>
            <div className="text-xs text-slate-400 ml-1">
              {maxTurns - currentTurn > 0 ? `${maxTurns - currentTurn} left` : 'Complete'}
            </div>
          </div>
          
          {/* Characters Button */}
          <button
            onClick={onToggleCharacterDrawer}
            className={`relative w-12 h-12 bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur border border-slate-600 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 hover:border-violet-400/50 hover:shadow-lg hover:shadow-violet-400/30 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              hasCharacterUpdates ? 'animate-pulse' : ''
            }`}
            aria-label="View active characters"
          >
            <Users className="w-5 h-5 text-violet-400" />
            {hasCharacterUpdates && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-violet-500 rounded-full border-2 border-slate-900 shadow-lg" />
            )}
          </button>
          
          {/* Objectives Progress Ring */}
          <button
            onClick={onToggleObjectiveDrawer}
            className={`relative w-12 h-12 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-full ${
              hasObjectiveUpdates ? 'animate-pulse' : ''
            }`}
            aria-label="View mission objectives"
          >
            <svg
              className="w-12 h-12 transform -rotate-90 drop-shadow-lg"
              width="48"
              height="48"
              viewBox="0 0 48 48"
            >
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                className="text-slate-700"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 20}
                strokeDashoffset={2 * Math.PI * 20 - (progressPercentage / 100) * 2 * Math.PI * 20}
                className="text-cyan-400 transition-all duration-500 ease-out drop-shadow-lg"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-cyan-400 drop-shadow-lg">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            {hasObjectiveUpdates && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-violet-500 rounded-full border-2 border-slate-900 shadow-lg" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
