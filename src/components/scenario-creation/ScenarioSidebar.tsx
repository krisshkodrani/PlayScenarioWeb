
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Upload } from 'lucide-react';
import { ScenarioData } from '@/types/scenario';

interface ScenarioSidebarProps {
  scenarioData: ScenarioData;
  isComplete: boolean;
  isLoading: boolean;
  onSave: () => void;
  onPublish: () => void;
}

const ScenarioSidebar: React.FC<ScenarioSidebarProps> = ({
  scenarioData,
  isComplete,
  isLoading,
  onSave,
  onPublish
}) => {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700 sticky top-8">
        <CardHeader>
          <CardTitle className="text-sm text-slate-400">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={onSave} 
            variant="outline" 
            className="w-full border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button 
            onClick={onPublish} 
            className="w-full bg-cyan-500 hover:bg-cyan-600"
            disabled={!isComplete || isLoading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isLoading ? 'Publishing...' : isComplete ? 'Publish Scenario' : 'Complete Required Fields'}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-sm text-slate-400">Scenario Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Characters:</span>
            <span className="text-cyan-400">{scenarioData.characters.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Objectives:</span>
            <span className="text-cyan-400">{scenarioData.objectives.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Max Turns:</span>
            <span className="text-cyan-400">{scenarioData.max_turns}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Visibility:</span>
            <span className="text-cyan-400">{scenarioData.is_public ? 'Public' : 'Private'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScenarioSidebar;
