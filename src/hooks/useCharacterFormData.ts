
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CharacterData, CharacterContext } from '@/types/character';
import { characterService } from '@/services/characterService';
import { useToast } from '@/hooks/use-toast';

export const useCharacterFormData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const editCharacterId = searchParams.get('edit');
  const duplicateCharacterId = searchParams.get('duplicate');
  const isEditMode = !!editCharacterId;
  const isDuplicateMode = !!duplicateCharacterId;
  
  const [loading, setLoading] = useState(isEditMode || isDuplicateMode);
  const [characterData, setCharacterData] = useState<CharacterData>({
    name: '',
    personality: '',
    expertise_keywords: [],
    is_player_character: false
  });
  const [characterContext, setCharacterContext] = useState<CharacterContext>({
    role: ''
  });

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

  const loadCharacterForDuplicate = async (characterId: string) => {
    try {
      setLoading(true);
      const character = await characterService.getCharacterById(characterId);
      
      if (character) {
        setCharacterData({
          name: `${character.name} (Copy)`,
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
          description: "The character you're trying to duplicate could not be found.",
          variant: "destructive",
        });
        navigate('/my-characters');
      }
    } catch (error) {
      console.error('Error loading character for duplicate:', error);
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

  useEffect(() => {
    if (isEditMode && editCharacterId) {
      loadCharacterForEdit(editCharacterId);
    } else if (isDuplicateMode && duplicateCharacterId) {
      loadCharacterForDuplicate(duplicateCharacterId);
    }
  }, [isEditMode, editCharacterId, isDuplicateMode, duplicateCharacterId]);

  return {
    characterData,
    setCharacterData,
    characterContext,
    setCharacterContext,
    loading,
    isEditMode,
    isDuplicateMode,
    editCharacterId,
    duplicateCharacterId
  };
};
