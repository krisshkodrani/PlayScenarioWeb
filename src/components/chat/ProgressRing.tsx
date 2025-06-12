
import React from 'react';

interface ProgressRingProps {
  percentage: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ percentage }) => {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative w-15 h-15">
        <svg
          className="w-15 h-15 transform -rotate-90"
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
            className="text-cyan-400 transition-all duration-500 ease-out"
            strokeLinecap="round"
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-cyan-400">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressRing;
