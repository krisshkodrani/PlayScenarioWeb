
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, CheckCircle } from 'lucide-react';
import { Objective } from '@/types/scenario';

interface ObjectivesListProps {
  objectives: Objective[];
}

const ObjectivesList: React.FC<ObjectivesListProps> = ({ objectives }) => {
  const priorityColors = {
    critical: 'bg-red-500/20 text-red-400 border-red-500',
    important: 'bg-amber-500/20 text-amber-400 border-amber-500',
    optional: 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-cyan-400">
          <Target className="w-6 h-6" />
          Scenario Objectives
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {objectives.map((objective, index) => (
          <div 
            key={objective.id}
            className="flex items-start gap-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/50">
              <span className="text-sm font-semibold text-cyan-400">
                {index + 1}
              </span>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-white">
                  {objective.title}
                </h4>
                <Badge 
                  variant="outline"
                  className={priorityColors[objective.priority] || 'text-slate-400 border-slate-400'}
                >
                  {objective.priority}
                </Badge>
              </div>
              
              <p className="text-slate-300 leading-relaxed">
                {objective.description}
              </p>
            </div>
          </div>
        ))}
        
        {objectives.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No objectives defined for this scenario.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ObjectivesList;
