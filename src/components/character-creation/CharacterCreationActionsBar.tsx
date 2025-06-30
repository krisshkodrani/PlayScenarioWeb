
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Wand2 } from 'lucide-react';
import { CharacterData } from '@/types/character';

interface CharacterCreationActionsBarProps {
  characterData: CharacterData;
  completionProgress: number;
  saving: boolean;
  onSave: () => void;
  onUseAI: () => void;
  isEditMode?: boolean;
}

const CharacterCreationActionsBar: React.FC<CharacterCreationActionsBarProps> = ({
  characterData,
  completionProgress,
  saving,
  onSave,
  onUseAI,
  isEditMode = false
}) => {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700 sticky top-8">
        <CardHeader>
          <CardTitle className="text-sm text-slate-400">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={onUseAI}
            className="w-full bg-violet-500 hover:bg-violet-600 text-white"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Use AI
          </Button>
          <Button 
            onClick={onSave} 
            variant="outline" 
            className="w-full border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
            disabled={saving || completionProgress < 100}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : (isEditMode ? 'Update Character' : 'Save Character')}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-sm text-slate-400">Character Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Name:</span>
            <span className="text-cyan-400">{characterData.name ? '✓' : '○'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Personality:</span>
            <span className="text-cyan-400">{characterData.personality ? '✓' : '○'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Expertise:</span>
            <span className="text-cyan-400">{characterData.expertise_keywords.length > 0 ? '✓' : '○'}</span>
          </div>
          <div className="flex justify-between border-t border-slate-600 pt-2 mt-2">
            <span className="text-slate-400">Complete:</span>
            <span className="text-cyan-400 font-medium">{Math.round(completionProgress)}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CharacterCreationActionsBar;
