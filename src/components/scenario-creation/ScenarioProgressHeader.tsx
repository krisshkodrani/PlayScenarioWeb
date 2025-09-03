import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';

interface ScenarioProgressHeaderProps {
  progress: number;
  isComplete: boolean;
  scenarioData?: {
    title: string;
    description: string;
    scenario_opening_message: string;
    objectives: any[];
    characters: any[];
  };
}

const ScenarioProgressHeader: React.FC<ScenarioProgressHeaderProps> = ({ 
  progress, 
  isComplete,
  scenarioData
}) => {
  // Calculate section completion status
  const sections = [
    {
      name: 'Basic Info',
      completed: (
        ((scenarioData?.title ?? '').trim().length > 0) &&
        ((scenarioData?.description ?? '').trim().length > 0) &&
        ((scenarioData?.scenario_opening_message ?? '').trim().length > 0)
      )
    },
    {
      name: 'Objectives',
      completed: (scenarioData?.objectives?.length ?? 0) > 0
    },
    {
      name: 'Characters',
      completed: (scenarioData?.characters?.length ?? 0) > 0
    },
    {
      name: 'Settings',
      completed: true // Settings are always complete as they have defaults
    }
  ];

  return (
    <div className="mb-8">
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-400">Scenario Progress</span>
            <span className="text-sm text-cyan-400 font-medium">{Math.round(progress)}% Complete</span>
          </div>
          
          <Progress 
            value={progress} 
            className="h-3 mb-4"
          />
          
          <div className="grid grid-cols-4 gap-4">
            {sections.map((section, index) => (
              <div key={section.name} className="flex items-center gap-2">
                {section.completed ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500" />
                )}
                <span className={`text-xs ${section.completed ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {section.name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScenarioProgressHeader;
