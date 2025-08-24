import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

interface ObjectivesBreakdownProps {
  objectives: any[];
  progress: Record<string, any>;
  status: string;
}

const ObjectivesBreakdown: React.FC<ObjectivesBreakdownProps> = ({ 
  objectives, 
  progress, 
  status 
}) => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Objectives Completed</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {objectives.map((objective, index) => {
          // Align with backend keys: objective_<id>, and prefer completion_percentage
          const objectiveKey = `objective_${objective.id || index + 1}`;
          const objectiveProgress = progress[objectiveKey] || progress[objective.id] || progress[index.toString()] || {};
          const percentage = (typeof objectiveProgress.completion_percentage === 'number'
            ? objectiveProgress.completion_percentage
            : (objectiveProgress.progress_percentage || 0));
          const completed = percentage >= 75;

          return (
            <div key={objective.id || index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{objective.description}</span>
                <div className="flex items-center space-x-2">
                  {completed ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-slate-500" />
                  )}
                  <span className={completed ? 'text-emerald-400' : 'text-slate-400'}>
                    {percentage}%
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    completed ? 'bg-emerald-400' : 'bg-cyan-400'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {objectiveProgress.key_actions && (
                <div className="text-sm text-slate-400">
                  Key actions: {objectiveProgress.key_actions.join(', ')}
                </div>
              )}
            </div>
          );
        })}

        {/* Overall Progress */}
        <div className="pt-4 border-t border-slate-700">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Overall Progress</span>
            <span className="text-cyan-400">
              {Math.round(
                objectives.reduce((sum, obj, index) => {
                  const objKey = `objective_${obj.id || index + 1}`;
                  const prog = progress[objKey] || progress[obj.id] || progress[index.toString()] || {};
                  const pct = (typeof prog.completion_percentage === 'number') ? prog.completion_percentage : (prog.progress_percentage || 0);
                  return sum + pct;
                }, 0) / (objectives.length || 1)
              )}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ObjectivesBreakdown;
