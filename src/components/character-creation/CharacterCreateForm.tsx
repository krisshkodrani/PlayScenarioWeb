import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/navigation/PageHeader';
import CharacterProgressHeader from './CharacterProgressHeader';
import CharacterFormTabs from './CharacterFormTabs';
import CharacterSidebar from './CharacterSidebar';
import AIAssistanceModal from './AIAssistanceModal';
import { useCharacterCreate } from '@/hooks/useCharacterCreate';
import { CharacterData } from '@/types/character';

const CharacterCreateForm: React.FC = () => {
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  const {
    characterData,
    setCharacterData,
    characterContext,
    setCharacterContext,
    handleSaveCharacter,
    handlePublish,
    saving,
    publishing
  } = useCharacterCreate();

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

  const customBreadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Characters', href: '/my-characters' },
    { label: 'Create Character', href: '' }
  ];

  if (showPreview) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <PageHeader
            title="Character Preview"
            subtitle="Review your character before publishing"
            showBackButton={true}
            customBreadcrumbs={[...customBreadcrumbs.slice(0, -1), { label: 'Preview', href: '' }]}
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
          title="Create Character"
          subtitle="Design an AI character for your scenarios"
          showBackButton={true}
          customBreadcrumbs={customBreadcrumbs}
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
              onMakePrivate={() => {}}
              onUseAI={handleUseAI}
              isEditMode={false}
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

export default CharacterCreateForm;