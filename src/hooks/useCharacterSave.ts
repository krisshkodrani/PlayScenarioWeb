
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CharacterData } from '@/types/character';
import { characterService } from '@/services/characterService';
import { useToast } from '@/hooks/use-toast';

export const useCharacterSave = (isEditMode: boolean, editCharacterId?: string | null) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSaveCharacter = async (characterData: CharacterData, characterContext?: { role: string }) => {
    if (!characterData.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a character name.",
        variant: "destructive",
      });
      return;
    }

    if (characterData.personality.length < 50) {
      toast({
        title: "Personality Too Short",
        description: "Please provide a more detailed personality description (at least 50 characters).",
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
      
      const fullCharacterData = {
        ...characterData,
        role: characterContext?.role || characterData.role || 'Character'
      };

      if (isEditMode && editCharacterId) {
        await characterService.updateCharacter(editCharacterId, fullCharacterData);
        toast({
          title: "Character Updated",
          description: `${characterData.name} has been successfully updated!`,
        });
      } else {
        await characterService.createCharacter(fullCharacterData);
        toast({
          title: "Character Created",
          description: `${characterData.name} has been successfully created!`,
        });
      }

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

  return {
    handleSaveCharacter,
    saving
  };
};
