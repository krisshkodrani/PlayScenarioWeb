import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CharacterData } from '@/types/character';
import { characterService } from '@/services/characterService';

const defaultCharacterData: CharacterData = {
  name: '',
  personality: '',
  expertise_keywords: [],
  is_public: false
};

const defaultCharacterContext = {
  role: ''
};

export const useCharacterEdit = (characterId: string, isDuplicate: boolean = false) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [characterData, setCharacterData] = useState<CharacterData>(defaultCharacterData);
  const [characterContext, setCharacterContext] = useState(defaultCharacterContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const loadCharacter = async () => {
      if (!characterId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const character = await characterService.getCharacterById(characterId);
        
        if (character) {
          const loadedData: CharacterData = {
            name: isDuplicate ? `Copy of ${character.name}` : character.name,
            personality: character.personality,
            expertise_keywords: character.expertise_keywords || [],
            is_public: isDuplicate ? false : character.is_public
          };
          
          setCharacterData(loadedData);
        } else {
          toast({
            title: "Character Not Found",
            description: "The character you're trying to edit could not be found.",
            variant: "destructive",
          });
          navigate('/my-characters');
        }
      } catch (error) {
        console.error('Error loading character:', error);
        toast({
          title: "Loading Error",
          description: "Failed to load character data. Please try again.",
          variant: "destructive",
        });
        navigate('/my-characters');
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [characterId, isDuplicate, toast, navigate]);

  const handleSaveCharacter = async (data: CharacterData, context: any) => {
    if (!data.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a character name.",
        variant: "destructive",
      });
      return;
    }

    if (data.personality.length < 50) {
      toast({
        title: "Personality Too Short",
        description: "Please provide a more detailed personality description.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      
      if (isDuplicate) {
        // Create new character (duplicate)
        await characterService.createCharacter({ ...data, is_public: false });
        toast({
          title: "Character Duplicated",
          description: `${data.name} has been duplicated and saved as a draft.`,
        });
      } else {
        // Update existing character
        await characterService.updateCharacter(characterId, { ...data, is_public: data.is_public });
        toast({
          title: "Character Updated",
          description: `${data.name} has been updated.`,
        });
      }

      navigate('/my-characters');
    } catch (error: any) {
      console.error('Error saving character:', error);
      
      if (error?.message?.includes("duplicate_name") || error?.message?.includes("unique_character_name_per_creator")) {
        toast({
          title: "Duplicate Name",
          description: "You already have another character with this name. Please choose a different name.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Save Failed",
          description: error?.message || "Unable to save the character. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (data: CharacterData, context: any) => {
    if (!data.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a character name.",
        variant: "destructive",
      });
      return;
    }

    if (data.personality.length < 50) {
      toast({
        title: "Personality Too Short",
        description: "Please provide a more detailed personality description.",
        variant: "destructive",
      });
      return;
    }

    try {
      setPublishing(true);
      
      if (isDuplicate) {
        // Create new character (duplicate) and publish
        await characterService.createCharacter({ ...data, is_public: true });
        toast({
          title: "Character Duplicated & Published",
          description: `${data.name} has been duplicated and published.`,
        });
      } else {
        // Update existing character and publish
        await characterService.updateCharacter(characterId, { ...data, is_public: true });
        toast({
          title: "Character Published",
          description: `${data.name} has been published and is now available to others.`,
        });
      }

      navigate('/my-characters');
    } catch (error: any) {
      console.error('Error publishing character:', error);
      
      if (error?.message?.includes("duplicate_name") || error?.message?.includes("unique_character_name_per_creator")) {
        toast({
          title: "Duplicate Name",
          description: "You already have another character with this name. Please choose a different name.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Publish Failed",
          description: error?.message || "Unable to publish the character. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setPublishing(false);
    }
  };

  const handleMakePrivate = async (data: CharacterData, context: any) => {
    if (isDuplicate) {
      toast({
        title: "Not Applicable",
        description: "This is a duplicate character that hasn't been created yet.",
        variant: "destructive",
      });
      return;
    }

    try {
      setPublishing(true);
      await characterService.updateCharacter(characterId, { ...data, is_public: false });
      
      toast({
        title: "Character Made Private",
        description: `${data.name} is now private and only visible to you.`,
      });

      navigate('/my-characters');
    } catch (error: any) {
      console.error('Error making character private:', error);
      toast({
        title: "Update Failed",
        description: error?.message || "Unable to update the character. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPublishing(false);
    }
  };

  return {
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
  };
};