
import { useState } from 'react';
import { CharacterData } from '@/types/character';
import { characterService } from '@/services/characterService';
import { useToast } from '@/hooks/use-toast';

interface UseCharacterCreationReturn {
  creating: boolean;
  createCharacter: (characterData: CharacterData) => Promise<boolean>;
}

export const useCharacterCreation = (): UseCharacterCreationReturn => {
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);

  const createCharacter = async (characterData: CharacterData): Promise<boolean> => {
    if (!characterData.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a character name.",
        variant: "destructive",
      });
      return false;
    }

    if (characterData.personality.length < 50) {
      toast({
        title: "Personality Too Short",
        description: "Please provide a more detailed personality description.",
        variant: "destructive",
      });
      return false;
    }

    try {
      setCreating(true);
      await characterService.createCharacter(characterData);
      
      toast({
        title: "Character Created",
        description: `${characterData.name} has been successfully created!`,
      });

      return true;
    } catch (error) {
      console.error('Error creating character:', error);
      toast({
        title: "Creation Failed",
        description: "Unable to create the character. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setCreating(false);
    }
  };

  return {
    creating,
    createCharacter,
  };
};
