
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import PageHeader from '@/components/navigation/PageHeader';
import SimplifiedBasicInfo from './SimplifiedBasicInfo';
import EnhancedPersonality from './EnhancedPersonality';
import SimplifiedExpertise from './SimplifiedExpertise';
import SimplifiedPreview from './SimplifiedPreview';
import CharacterCreationSidebar from './CharacterCreationSidebar';
import CharacterCreationProgress from './CharacterCreationProgress';
import CharacterCreationActions from './CharacterCreationActions';
import CharacterCreationActionsBar from './CharacterCreationActionsBar';
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
  const [activeSection, setActiveSection] = useState('basic');
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

  const getSectionCompletionStatus = (sectionId: string) => {
    switch (sectionId) {
      case 'basic':
        return !!characterData.name.trim();
      case 'personality':
        return characterData.personality.length > 0;
      case 'expertise':
        return characterData.expertise_keywords.length > 0;
      default:
        return false;
    }
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

  const renderActiveComponent = () => {
    switch (activeSection) {
      case 'basic':
        return (
          <SimplifiedBasicInfo
            characterData={characterData}
            characterContext={characterContext}
            setCharacterData={setCharacterData}
            setCharacterContext={setCharacterContext}
          />
        );
      case 'personality':
        return (
          <EnhancedPersonality
            characterData={characterData}
            characterContext={characterContext}
            setCharacterData={setCharacterData}
          />
        );
      case 'expertise':
        return (
          <SimplifiedExpertise
            characterData={characterData}
            setCharacterData={setCharacterData}
          />
        );
      default:
        return null;
    }
  };

  const headerActions = (
    <CharacterCreationActions
      onPreview={() => setShowPreview(true)}
      onSave={onSave}
      saving={saving}
      completionProgress={getCompletionProgress()}
      isEditMode={isEditMode}
      isDuplicateMode={isDuplicateMode}
    />
  );

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
                disabled={saving || getCompletionProgress() < 100}
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
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-6">
        <PageHeader
          title={pageTitle}
          subtitle={pageSubtitle}
          showBackButton={true}
          customBreadcrumbs={customBreadcrumbs}
          actions={headerActions}
        />

        <CharacterCreationProgress completionProgress={getCompletionProgress()} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <CharacterCreationSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              getSectionCompletionStatus={getSectionCompletionStatus}
            />
          </div>

          <div className="lg:col-span-2 min-w-0">
            {renderActiveComponent()}
          </div>

          <div className="lg:col-span-1">
            <CharacterCreationActionsBar
              characterData={characterData}
              completionProgress={getCompletionProgress()}
              saving={saving}
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
