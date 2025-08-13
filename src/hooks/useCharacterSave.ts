
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CharacterData } from '@/types/character';
import { characterService } from '@/services/characterService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useCharacterSave = (isEditMode: boolean, editCharacterId?: string | null) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const saveOperationRef = useRef<Promise<void> | null>(null);

  // Check for duplicate character names (excluding current character when editing)
  const checkForDuplicateCharacter = async (name: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      let query = supabase
        .from('characters')
        .select('id')
        .eq('creator_id', user.id)
        .eq('name', name.trim())
        .eq('status', 'active');

      // Exclude current character when editing
      if (isEditMode && editCharacterId) {
        query = query.neq('id', editCharacterId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error checking for duplicate character:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking for duplicate character:', error);
      return false;
    }
  };

  const handleSaveCharacter = useCallback(async (characterData: CharacterData, characterContext?: { role: string }) => {
    // Prevent multiple simultaneous save operations
    if (saveOperationRef.current) {
      console.log('Save operation already in progress, skipping...');
      return;
    }

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

    // Check for duplicate character names
    const isDuplicate = await checkForDuplicateCharacter(characterData.name);
    if (isDuplicate) {
      toast({
        title: "Character Name Already Exists",
        description: "You already have a character with this name. Please choose a different name.",
        variant: "destructive",
      });
      return;
    }

    const saveOperation = async () => {
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
        
        // Handle specific duplicate error from database constraint
        if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
          toast({
            title: "Character Name Already Exists",
            description: "You already have a character with this name. Please choose a different name.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Save Failed",
            description: `Unable to ${isEditMode ? 'update' : 'save'} the character. Please try again.`,
            variant: "destructive",
          });
        }
      } finally {
        setSaving(false);
        saveOperationRef.current = null;
      }
    };

    // Store the promise to prevent duplicate operations
    saveOperationRef.current = saveOperation();
    await saveOperationRef.current;
  }, [isEditMode, editCharacterId, navigate, toast]);

  return {
    handleSaveCharacter,
    saving
  };
};
