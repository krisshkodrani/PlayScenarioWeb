
import React from 'react';
import { Clock } from 'lucide-react';

interface TurnsIndicatorProps {
  currentTurn: number;
  maxTurns: number;
}

const TurnsIndicator: React.FC<TurnsIndicatorProps> = ({ currentTurn, maxTurns }) => {
  const turnsLeft = maxTurns - currentTurn;
  
  return (
    <div className="fixed top-4 right-36 z-50">
      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur border border-slate-600 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
        <Clock className="w-4 h-4 text-cyan-400" />
        <div className="flex items-center gap-1 text-sm font-medium">
          <span className="text-white">{currentTurn}</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-400">{maxTurns}</span>
        </div>
        <div className="text-xs text-slate-400 ml-1">
          {turnsLeft > 0 ? `${turnsLeft} left` : 'Complete'}
        </div>
      </div>
    </div>
  );
};

export default TurnsIndicator;
