import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { GameResults } from '@/services/resultsService';

interface HeaderObjectivesPanelProps {
  results: GameResults;
}

const HeaderObjectivesPanel: React.FC<HeaderObjectivesPanelProps> = ({ results }) => {
  const getOutcomeColor = () => {
    switch (results.status) {
      case 'won':
        return 'text-emerald-400';
      case 'lost':
        return 'text-red-400';
      case 'abandoned':
        return 'text-amber-400';
      default:
        return 'text-cyan-400';
    }
  };

  const getOutcomeTitle = () => {
    switch (results.status) {
      case 'won':
        return 'Victory!';
      case 'lost':
        return 'Defeat';
      case 'abandoned':
        return 'Incomplete';
      default:
        return 'Completed';
    }
  };

  const completedObjectives = results.scenario.objectives.filter((_, index) => {
    const progress = results.objectives_progress[index] || results.objectives_progress[index.toString()];
    return progress >= 100;
  }).length;

  const totalObjectives = results.scenario.objectives.length;
  const overallProgress = totalObjectives > 0 ? Math.round((completedObjectives / totalObjectives) * 100) : 0;

  return (
    <Card className="bg-slate-800 border-slate-700 mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Left side - Title and Status */}
          <div className="flex-1">
            <h1 className={`text-3xl font-bold ${getOutcomeColor()} mb-2`}>
              {getOutcomeTitle()}
            </h1>
            <h2 className="text-xl text-white mb-4">{results.scenario.title}</h2>
            
            {results.final_score && (
              <div className="inline-flex items-center space-x-2 bg-slate-700 px-4 py-2 rounded-lg">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-lg font-bold text-yellow-400">{results.final_score}</span>
                <span className="text-slate-300">points</span>
              </div>
            )}
          </div>

          {/* Right side - Objectives */}
          <div className="flex-1 max-w-md">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">Objectives</h3>
                <span className="text-sm text-slate-300">
                  {completedObjectives}/{totalObjectives} Complete
                </span>
              </div>
              
              <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
                <div 
                  className="h-3 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto">
              {results.scenario.objectives.map((objective, index) => {
                const progress = results.objectives_progress[index] || results.objectives_progress[index.toString()] || 0;
                const isCompleted = progress >= 100;
                
                return (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-slate-700/50">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      isCompleted ? 'bg-emerald-400' : 'bg-slate-500'
                    }`} />
                    <p className={`text-sm flex-1 ${
                      isCompleted ? 'text-emerald-300' : 'text-slate-300'
                    }`}>
                      {objective.description || `Objective ${index + 1}`}
                    </p>
                    <span className={`text-xs font-medium ${
                      isCompleted ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {progress}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeaderObjectivesPanel;