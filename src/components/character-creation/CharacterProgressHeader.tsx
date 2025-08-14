
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CharacterData } from '@/types/character';

interface CharacterProgressHeaderProps {
  progress: number;
  isComplete: boolean;
  characterData: CharacterData;
}

const CharacterProgressHeader: React.FC<CharacterProgressHeaderProps> = ({
  progress,
  isComplete,
  characterData
}) => {
  return (
    <Card className="bg-slate-800 border-slate-700 mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {characterData.name || 'New Character'}
            </h2>
            <p className="text-slate-400">
              {isComplete ? 'Ready to publish' : 'Complete all sections to publish'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-cyan-400">{Math.round(progress)}%</div>
            <div className="text-sm text-slate-400">Complete</div>
          </div>
        </div>
        
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-cyan-400 to-violet-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CharacterProgressHeader;
