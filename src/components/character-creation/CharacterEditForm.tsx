import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/navigation/PageHeader';
import CharacterProgressHeader from './CharacterProgressHeader';
import CharacterFormTabs from './CharacterFormTabs';
import CharacterSidebar from './CharacterSidebar';
import AIAssistanceModal from './AIAssistanceModal';
import CharacterFormLoading from './CharacterFormLoading';
import { useCharacterEdit } from '@/hooks/useCharacterEdit';
import { CharacterData } from '@/types/character';

interface CharacterEditFormProps {
  characterId: string;
  isDuplicate?: boolean;
}

const CharacterEditForm: React.FC<CharacterEditFormProps> = ({ characterId, isDuplicate = false }) => {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  const {
    characterData,
    setCharacterData,
    characterContext,
    setCharacterContext,
    loading,
    handleSaveCharacter,
    handlePublish,
    handleMakePrivate,
    saving,
    publishing
  } = useCharacterEdit(characterId, isDuplicate);

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

  const getCompletionProgress = () => {
    let progress = 0;
    if (characterData.name.trim()) progress += 25;
    if (characterData.personality.length >= 50) progress += 50;
    if (characterData.expertise_keywords.length > 0) progress += 25;
    return progress;
  };

  const progress = getCompletionProgress();

  if (loading) {
    return <CharacterFormLoading />;
  }

  const getPageTitle = () => {
    if (isDuplicate) return 'Duplicate Character';
    return characterData.name || 'Edit Character';
  };

  const getPageSubtitle = () => {
    if (isDuplicate) return 'Create a copy of an existing character';
    return 'Modify your AI character design';
  };

  const getCustomBreadcrumbs = () => {
    const baseBreadcrumbs = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'My Characters', href: '/my-characters' }
    ];

    if (isDuplicate) {
      baseBreadcrumbs.push({ label: 'Duplicate Character', href: '' });
    } else {
      baseBreadcrumbs.push({ label: characterData.name || 'Edit Character', href: '' });
    }

    return baseBreadcrumbs;
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <PageHeader
            title="Character Preview"
            subtitle="Review your character before publishing"
            showBackButton={true}
            customBreadcrumbs={[...getCustomBreadcrumbs().slice(0, -1), { label: 'Preview', href: '' }]}
          />
          {/* Preview content would go here */}
          <div className="mt-8">
            <button
              onClick={() => setShowPreview(false)}
              className="bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Back to Editing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title={getPageTitle()}
          subtitle={getPageSubtitle()}
          showBackButton={true}
          customBreadcrumbs={getCustomBreadcrumbs()}
        />

        <CharacterProgressHeader 
          progress={progress} 
          isComplete={progress >= 100}
          characterData={characterData}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <CharacterFormTabs
              characterData={characterData}
              setCharacterData={setCharacterData}
              characterContext={characterContext}
              setCharacterContext={setCharacterContext}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <div className="space-y-6">
            <CharacterSidebar
              characterData={characterData}
              isComplete={progress >= 100}
              isLoading={saving}
              isPublishing={publishing}
              onSave={() => handleSaveCharacter(characterData, characterContext)}
              onPublish={() => handlePublish(characterData, characterContext)}
              onMakePrivate={isDuplicate ? () => {} : () => handleMakePrivate(characterData, characterContext)}
              onUseAI={handleUseAI}
              isEditMode={!isDuplicate}
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

export default CharacterEditForm;