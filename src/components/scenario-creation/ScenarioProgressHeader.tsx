
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
    initial_scene_prompt: string;
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
      completed: scenarioData ? (
        scenarioData.title.trim().length > 0 && 
        scenarioData.description.trim().length > 0 &&
        scenarioData.initial_scene_prompt.trim().length > 0
      ) : false
    },
    {
      name: 'Objectives',
      completed: scenarioData ? scenarioData.objectives.length > 0 : false
    },
    {
      name: 'Characters',
      completed: scenarioData ? scenarioData.characters.length > 0 : false
    },
    {
      name: 'Settings',
      completed: true // Settings are always complete as they have defaults
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Create Scenario</h1>
          <p className="text-slate-400 mt-1">
            Design an interactive AI scenario for training or entertainment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant={isComplete ? "default" : "secondary"} 
            className={isComplete 
              ? "bg-emerald-500 text-white hover:bg-emerald-600" 
              : "bg-amber-500 text-slate-900 hover:bg-amber-600"
            }
          >
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
