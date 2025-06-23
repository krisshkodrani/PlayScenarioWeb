
import React from 'react';

interface CharacterCreationProgressProps {
  completionProgress: number;
}

const CharacterCreationProgress: React.FC<CharacterCreationProgressProps> = ({ 
  completionProgress 
}) => {
  return (
    <div className="mb-8 space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">Character Development Progress</span>
        <span className="text-cyan-400 font-medium">{Math.round(completionProgress)}% Complete</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-cyan-400 to-violet-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${completionProgress}%` }}
        />
      </div>
    </div>
  );
};

export default CharacterCreationProgress;
