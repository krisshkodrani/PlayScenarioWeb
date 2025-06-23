
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CharacterData, CharacterContext } from '@/types/character';
import { characterService } from '@/services/characterService';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/navigation/PageHeader';
import SimplifiedBasicInfo from './SimplifiedBasicInfo';
import EnhancedPersonality from './EnhancedPersonality';
import SimplifiedExpertise from './SimplifiedExpertise';
import SimplifiedPreview from './SimplifiedPreview';
import CharacterCreationSidebar from './CharacterCreationSidebar';
import CharacterCreationProgress from './CharacterCreationProgress';
import CharacterCreationActions from './CharacterCreationActions';

const CharacterCreationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const editCharacterId = searchParams.get('edit');
  const isEditMode = !!editCharacterId;
  
  const [activeSection, setActiveSection] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [characterData, setCharacterData] = useState<CharacterData>({
    name: '',
    personality: '',
    expertise_keywords: [],
    is_player_character: false
  });
  const [characterContext, setCharacterContext] = useState<CharacterContext>({
    role: ''
  });

  // Load character data for editing
  useEffect(() => {
    if (isEditMode && editCharacterId) {
      loadCharacterForEdit(editCharacterId);
    }
  }, [isEditMode, editCharacterId]);

  const loadCharacterForEdit = async (characterId: string) => {
    try {
      setLoading(true);
      const character = await characterService.getCharacterById(characterId);
      
      if (character) {
        setCharacterData({
          name: character.name,
          personality: character.personality,
          expertise_keywords: character.expertise_keywords,
          is_player_character: character.is_player_character
        });
        setCharacterContext({
          role: character.role || ''
        });
      } else {
        toast({
          title: "Character Not Found",
          description: "The character you're trying to edit could not be found.",
          variant: "destructive",
        });
        navigate('/my-characters');
      }
    } catch (error) {
      console.error('Error loading character for edit:', error);
      toast({
        title: "Error Loading Character",
        description: "Unable to load character data. Please try again.",
        variant: "destructive",
      });
      navigate('/my-characters');
    } finally {
      setLoading(false);
    }
  };

  // Enhanced completion progress
  const getCompletionProgress = () => {
    const requirements = [
      !!characterData.name.trim(),                    // Name required
      characterData.personality.length >= 100,       // Minimum personality length
      characterData.expertise_keywords.length > 0    // At least 1 expertise keyword
    ];
    
    const completed = requirements.filter(Boolean).length;
    return (completed / requirements.length) * 100;
  };

  const getSectionCompletionStatus = (sectionId: string) => {
    switch (sectionId) {
      case 'basic':
        return !!characterData.name.trim();
      case 'personality':
        return characterData.personality.length >= 100; // Require meaningful content
      case 'expertise':
        return characterData.expertise_keywords.length > 0;
      default:
        return false;
    }
  };

  const handleSaveCharacter = async () => {
    if (!characterData.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a character name.",
        variant: "destructive",
      });
      return;
    }

    if (characterData.personality.length < 100) {
      toast({
        title: "Personality Too Short",
        description: "Please provide a more detailed personality description (at least 100 characters).",
        variant: "destructive",
      });
      return;
    }

    if (characterData.expertise_keywords.length === 0) {
      toast({
        title: "Expertise Required",
        description: "Please add at least one expertise keyword.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      if (isEditMode && editCharacterId) {
        await characterService.updateCharacter(editCharacterId, characterData);
        toast({
          title: "Character Updated",
          description: `${characterData.name} has been successfully updated!`,
        });
      } else {
        await characterService.createCharacter(characterData);
        toast({
          title: "Character Created",
          description: `${characterData.name} has been successfully created!`,
        });
      }

      // Navigate back to My Characters page
      navigate('/my-characters');
    } catch (error) {
      console.error('Error saving character:', error);
      toast({
        title: "Save Failed",
        description: `Unable to ${isEditMode ? 'update' : 'save'} the character. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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
      onSave={handleSaveCharacter}
      saving={saving}
      completionProgress={getCompletionProgress()}
      isEditMode={isEditMode}
    />
  );

  // Loading state for edit mode
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-800 rounded w-64"></div>
            <div className="h-4 bg-slate-800 rounded w-96"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-6">
                <div className="h-64 bg-slate-800 rounded-lg"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-slate-800 rounded-lg"></div>
                <div className="h-20 bg-slate-800 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              { label: isEditMode ? 'Edit Character' : 'Create Character', href: isEditMode ? `/create-character?edit=${editCharacterId}` : '/create-character' },
              { label: 'Preview' }
            ]}
            actions={
              <Button 
                onClick={handleSaveCharacter}
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

  const pageTitle = isEditMode ? 'Edit Character' : 'Create Character';
  const pageSubtitle = isEditMode 
    ? `Editing ${characterData.name || 'character'}`
    : 'Design an AI personality for your scenarios';

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-6">
        <PageHeader
          title={pageTitle}
          subtitle={pageSubtitle}
          showBackButton={true}
          customBreadcrumbs={isEditMode ? [
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'My Characters', href: '/my-characters' },
            { label: 'Edit Character' }
          ] : undefined}
          actions={headerActions}
        />

        <CharacterCreationProgress completionProgress={getCompletionProgress()} />

        <div className="flex gap-8">
          <CharacterCreationSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            getSectionCompletionStatus={getSectionCompletionStatus}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {renderActiveComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreationForm;
