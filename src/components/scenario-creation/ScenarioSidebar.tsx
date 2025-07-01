
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Upload, Sparkles } from 'lucide-react';
import { ScenarioData } from '@/types/scenario';

interface ScenarioSidebarProps {
  scenarioData: ScenarioData;
  isComplete: boolean;
  isLoading: boolean;
  onSave: () => void;
  onPublish: () => void;
  onUseAI: () => void;
  isEditMode?: boolean;
}

const ScenarioSidebar: React.FC<ScenarioSidebarProps> = ({
  scenarioData,
  isComplete,
  isLoading,
  onSave,
  onPublish,
  onUseAI,
  isEditMode = false
}) => {
  return (
    <Card className="bg-slate-800 border-gray-700 sticky top-4">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Save className="w-5 h-5 text-cyan-400" />
          {isEditMode ? 'Update Scenario' : 'Save Scenario'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button
            onClick={onSave}
            disabled={isLoading || !scenarioData.title.trim()}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white border border-gray-600"
            variant="outline"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : (isEditMode ? 'Update Draft' : 'Save Draft')}
          </Button>

          <Button
            onClick={onPublish}
            disabled={isLoading || !isComplete}
            className="w-full bg-gradient-to-r from-cyan-400 to-violet-500 hover:from-cyan-300 hover:to-violet-400 text-slate-900 font-semibold shadow-lg shadow-cyan-400/30"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isLoading ? 'Publishing...' : (isEditMode ? 'Update & Publish' : 'Publish Scenario')}
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <Button
            onClick={onUseAI}
            variant="outline"
            className="w-full border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-slate-900"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Use AI Assistant
          </Button>
        </div>

        <div className="text-xs text-slate-400 space-y-1">
          <p>• Draft saves allow incomplete scenarios</p>
          <p>• Publishing requires all fields completed</p>
          {isEditMode && <p>• Changes will update the existing scenario</p>}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioSidebar;
