
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import PageHeader from '@/components/navigation/PageHeader';
import SimplifiedPreview from './SimplifiedPreview';
import CharacterFormTabs from './CharacterFormTabs';
import CharacterProgressHeader from './CharacterProgressHeader';
import CharacterSidebar from './CharacterSidebar';
import AIAssistanceModal from './AIAssistanceModal';
import { CharacterData, CharacterContext } from '@/types/character';
import { useToast } from '@/hooks/use-toast';

interface CharacterFormLayoutProps {
  characterData: CharacterData;
  setCharacterData: React.Dispatch<React.SetStateAction<CharacterData>>;
  characterContext: CharacterContext;
  setCharacterContext: React.Dispatch<React.SetStateAction<CharacterContext>>;
  onSave: () => void;
  saving: boolean;
  isEditMode: boolean;
  isDuplicateMode: boolean;
  editCharacterId?: string | null;
  duplicateCharacterId?: string | null;
}

const CharacterFormLayout: React.FC<CharacterFormLayoutProps> = ({
  characterData,
  setCharacterData,
  characterContext,
  setCharacterContext,
  onSave,
  saving,
  isEditMode,
  isDuplicateMode,
  editCharacterId,
  duplicateCharacterId
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  const getCompletionProgress = () => {
    const requirements = [
      !!characterData.name.trim(),
      characterData.personality.length > 0,
      characterData.expertise_keywords.length > 0
    ];
    
    const completed = requirements.filter(Boolean).length;
    return (completed / requirements.length) * 100;
  };

  const handleUseAI = () => {
    setShowAIModal(true);
  };

  const handleApplyAIChanges = (updates: Partial<CharacterData>) => {
    setCharacterData(prev => ({ ...prev, ...updates }));
    toast({
      title: "AI Enhancement Applied",
      description: "Your character has been enhanced with AI-generated content.",
    });
  };

  const progress = getCompletionProgress();
  const isComplete = progress >= 100;

  if (showPreview) {
    return (
      <div className="min-h-screen bg-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          <PageHeader
            title="Character Preview"
            subtitle={`Preview of ${characterData.name || 'New Character'}`}
            showBackButton={true}
            customBreadcrumbs={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'My Characters', href: '/my-characters' },
              { 
                label: isEditMode ? characterData.name || 'Edit Character' : 
                       isDuplicateMode ? 'Duplicate Character' : 'Create Character', 
                href: isEditMode ? `/create-character?edit=${editCharacterId}` : 
                      isDuplicateMode ? `/create-character?duplicate=${duplicateCharacterId}` : '/create-character' 
              },
              { label: 'Preview' }
            ]}
            actions={
              <Button 
                onClick={onSave}
                disabled={saving || !isComplete}
                className="bg-gradient-to-r from-cyan-400 to-violet-500 hover:from-cyan-300 hover:to-violet-400 shadow-lg shadow-cyan-400/30"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : (isEditMode ? 'Update Character' : 'Save Character')}
              </Button>
            }
          />
          <SimplifiedPreview characterData={characterData} />
        </div>
      </div>
    );
  }

  const pageTitle = isEditMode && characterData.name 
    ? characterData.name 
    : isDuplicateMode 
    ? 'Duplicate Character'
    : 'Create Character';
  
  const pageSubtitle = isEditMode 
    ? `Editing character details`
    : isDuplicateMode
    ? 'Creating a copy of an existing character'
    : 'Design an AI personality for your scenarios';

  const customBreadcrumbs = isEditMode ? [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Characters', href: '/my-characters' },
    { label: characterData.name || 'Edit Character' }
  ] : isDuplicateMode ? [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Characters', href: '/my-characters' },
    { label: 'Duplicate Character' }
  ] : undefined;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title={pageTitle}
          subtitle={pageSubtitle}
          showBackButton={true}
          customBreadcrumbs={customBreadcrumbs}
        />

        <CharacterProgressHeader 
          progress={progress} 
          isComplete={isComplete}
          characterData={characterData}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <CharacterFormTabs
              characterData={characterData}
              characterContext={characterContext}
              setCharacterData={setCharacterData}
              setCharacterContext={setCharacterContext}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <div>
            <CharacterSidebar
              characterData={characterData}
              isComplete={isComplete}
              isLoading={saving}
              onSave={onSave}
              onUseAI={handleUseAI}
              isEditMode={isEditMode}
            />
          </div>
        </div>
      </div>

      <AIAssistanceModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        characterData={characterData}
        characterContext={characterContext}
        onApplyChanges={handleApplyAIChanges}
      />
    </div>
  );
};

export default CharacterFormLayout;
