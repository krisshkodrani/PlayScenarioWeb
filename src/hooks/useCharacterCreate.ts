import { useState } from 'react';
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

export const useCharacterCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [characterData, setCharacterData] = useState<CharacterData>(defaultCharacterData);
  const [characterContext, setCharacterContext] = useState(defaultCharacterContext);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

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
      await characterService.createCharacter({ ...data, is_public: false });
      
      toast({
        title: "Character Saved",
        description: `${data.name} has been saved as a draft.`,
      });

      navigate('/my-characters');
    } catch (error: any) {
      console.error('Error creating character:', error);
      
      if (error?.message?.includes("duplicate_name") || error?.message?.includes("unique_character_name_per_creator")) {
        toast({
          title: "Duplicate Name",
          description: "You already have a character with this name. Please choose a different name.",
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
      await characterService.createCharacter({ ...data, is_public: true });
      
      toast({
        title: "Character Published",
        description: `${data.name} has been published and is now available to others.`,
      });

      navigate('/my-characters');
    } catch (error: any) {
      console.error('Error publishing character:', error);
      
      if (error?.message?.includes("duplicate_name") || error?.message?.includes("unique_character_name_per_creator")) {
        toast({
          title: "Duplicate Name",
          description: "You already have a character with this name. Please choose a different name.",
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
    // This is for create mode, so this shouldn't be called
    toast({
      title: "Not Applicable",
      description: "This character hasn't been created yet.",
      variant: "destructive",
    });
  };

  return {
    characterData,
    setCharacterData,
    characterContext,
    setCharacterContext,
    handleSaveCharacter,
    handlePublish,
    handleMakePrivate,
    saving,
    publishing
  };
};