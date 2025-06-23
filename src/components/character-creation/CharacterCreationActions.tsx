
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Save } from 'lucide-react';

interface CharacterCreationActionsProps {
  onPreview: () => void;
  onSave: () => void;
  saving: boolean;
  completionProgress: number;
  isEditMode?: boolean;
  isDuplicateMode?: boolean;
}

const CharacterCreationActions: React.FC<CharacterCreationActionsProps> = ({
  onPreview,
  onSave,
  saving,
  completionProgress,
  isEditMode = false,
  isDuplicateMode = false
}) => {
  const getButtonText = () => {
    if (isEditMode) return 'Update Character';
    return 'Save Character'; // Both create new and duplicate use "Save Character"
  };

  const getSavingText = () => {
    if (isEditMode) return 'Updating...';
    return 'Saving...'; // Both create new and duplicate use "Saving..."
  };

  return (
    <div className="flex items-center space-x-3">
      <Button 
        variant="outline" 
        onClick={onPreview}
        className="border-cyan-400/30 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300"
      >
        <Eye className="w-4 h-4 mr-2" />
        Preview
      </Button>
      <Button 
        onClick={onSave}
        disabled={saving || completionProgress < 100}
        className="bg-gradient-to-r from-cyan-400 to-violet-500 hover:from-cyan-300 hover:to-violet-400 shadow-lg shadow-cyan-400/30"
      >
        <Save className="w-4 h-4 mr-2" />
        {saving ? getSavingText() : getButtonText()}
      </Button>
    </div>
  );
};

export default CharacterCreationActions;
