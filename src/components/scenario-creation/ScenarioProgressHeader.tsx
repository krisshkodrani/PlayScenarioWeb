
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ScenarioProgressHeaderProps {
  progress: number;
  isComplete: boolean;
}

const ScenarioProgressHeader: React.FC<ScenarioProgressHeaderProps> = ({ 
  progress, 
  isComplete 
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold">Create Scenario</h1>
          <p className="text-slate-400 mt-1">
            Design an interactive AI scenario for training or entertainment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isComplete ? "default" : "secondary"} className="bg-cyan-500">
            {isComplete ? "Ready to Publish" : "In Development"}
          </Badge>
        </div>
      </div>
      
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-400">Creation Progress</span>
            <span className="text-sm text-cyan-400 font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>Basic Info</span>
            <span>Objectives</span>
            <span>Characters</span>
            <span>Settings</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScenarioProgressHeader;
