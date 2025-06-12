
import React from 'react';

interface ProgressRingProps {
  percentage: number;
  onClick?: () => void;
  hasUpdates?: boolean;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ percentage, onClick, hasUpdates = false }) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={onClick}
        className={`relative w-15 h-15 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-full ${
          hasUpdates ? 'animate-pulse' : ''
        }`}
        aria-label="View mission objectives"
      >
        <svg
          className="w-15 h-15 transform -rotate-90 drop-shadow-lg"
          width="60"
          height="60"
          viewBox="0 0 60 60"
        >
          {/* Background circle */}
          <circle
            cx="30"
            cy="30"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-slate-700"
          />
          {/* Progress circle */}
          <circle
            cx="30"
            cy="30"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="text-cyan-400 transition-all duration-500 ease-out drop-shadow-lg"
            strokeLinecap="round"
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-cyan-400 drop-shadow-lg">
            {Math.round(percentage)}%
          </span>
        </div>
        
        {/* Update notification badge */}
        {hasUpdates && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-violet-500 rounded-full border-2 border-slate-900 shadow-lg" />
        )}
      </button>
    </div>
  );
};

export default ProgressRing;
