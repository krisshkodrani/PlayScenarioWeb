
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Upload, Wand2, Lock, Unlock } from 'lucide-react';
import { CharacterData } from '@/types/character';
import CharacterPublicationDialog from './CharacterPublicationDialog';

interface CharacterSidebarProps {
  characterData: CharacterData;
  isComplete: boolean;
  isLoading: boolean;
  isPublishing: boolean;
  onSave: () => void;
  onPublish: () => void;
  onMakePrivate: () => void;
  onUseAI: () => void;
  isEditMode?: boolean;
}

const CharacterSidebar: React.FC<CharacterSidebarProps> = ({
  characterData,
  isComplete,
  isLoading,
  isPublishing,
  onSave,
  onPublish,
  onMakePrivate,
  onUseAI,
  isEditMode = false
}) => {
  const [showPublicationDialog, setShowPublicationDialog] = useState(false);
  const [publicationAction, setPublicationAction] = useState<'publish' | 'private'>('publish');

  const handlePublicationClick = (action: 'publish' | 'private') => {
    setPublicationAction(action);
    setShowPublicationDialog(true);
  };

  const handleConfirmPublication = () => {
    if (publicationAction === 'publish') {
      onPublish();
    } else {
      onMakePrivate();
    }
    setShowPublicationDialog(false);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700 sticky top-4">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Save className="w-5 h-5 text-cyan-400" />
            {isEditMode ? 'Update Character' : 'Save Character'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button
              onClick={onSave}
              disabled={isLoading || !characterData.name.trim()}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white border border-gray-600"
              variant="outline"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : (isEditMode ? 'Update Draft' : 'Save Draft')}
            </Button>

            <Button
              onClick={() => handlePublicationClick(characterData.is_public ? 'private' : 'publish')}
              disabled={isLoading || isPublishing || !isComplete}
              className="w-full bg-gradient-to-r from-cyan-400 to-violet-500 hover:from-cyan-300 hover:to-violet-400 text-slate-900 font-semibold shadow-lg shadow-cyan-400/30"
            >
               {characterData.is_public ? (
                 <>
                   <Lock className="w-4 h-4 mr-2" />
                   {isPublishing ? 'Making Private...' : (isEditMode ? 'Update & Make Private' : 'Make Private')}
                 </>
               ) : (
                 <>
                   <Upload className="w-4 h-4 mr-2" />
                   {isPublishing ? 'Publishing...' : (isEditMode ? 'Update & Publish' : 'Publish Character')}
                 </>
               )}
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <Button
              onClick={onUseAI}
              variant="outline"
              className="w-full border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-slate-900"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              AI Assistant
            </Button>
          </div>

          <div className="text-xs text-slate-400 space-y-1">
            <p>• Draft saves allow incomplete characters</p>
            <p>• Published characters can be used by others</p>
            {isEditMode && <p>• Changes will update the existing character</p>}
          </div>
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

      <CharacterPublicationDialog
        isOpen={showPublicationDialog}
        onClose={() => setShowPublicationDialog(false)}
        onConfirm={handleConfirmPublication}
        isPublishing={isPublishing}
        characterName={characterData.name}
        actionType={publicationAction}
      />
    </div>
  );
};

export default CharacterSidebar;
