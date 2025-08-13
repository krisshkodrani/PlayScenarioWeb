
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Wand2 } from 'lucide-react';
import { CharacterData } from '@/types/character';

interface CharacterSidebarProps {
  characterData: CharacterData;
  isComplete: boolean;
  isLoading: boolean;
  onSave: () => void;
  onUseAI: () => void;
  isEditMode?: boolean;
}

const CharacterSidebar: React.FC<CharacterSidebarProps> = ({
  characterData,
  isComplete,
  isLoading,
  onSave,
  onUseAI,
  isEditMode = false
}) => {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={onUseAI}
            variant="outline"
            className="w-full border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-slate-900 transition-all duration-200"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            AI Assistant
          </Button>
          
          <Button
            onClick={onSave}
            disabled={!isComplete || isLoading}
            className="w-full bg-cyan-400 text-slate-900 hover:bg-cyan-300"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : (isEditMode ? 'Update Character' : 'Save Character')}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-sm text-slate-400">Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Name:</span>
            <span className="text-cyan-400">{characterData.name ? '✓' : '○'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Personality:</span>
            <span className="text-cyan-400">{characterData.personality ? '✓' : '○'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Expertise:</span>
            <span className="text-cyan-400">{characterData.expertise_keywords.length > 0 ? '✓' : '○'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CharacterSidebar;
