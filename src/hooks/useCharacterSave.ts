
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
  const [publishing, setPublishing] = useState(false);
  const saveOperationRef = useRef<Promise<void> | null>(null);
  const publishOperationRef = useRef<Promise<void> | null>(null);

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

  const handleSave = useCallback(async (characterData: CharacterData, characterContext?: { role: string }, publish = false) => {
    // Prevent multiple simultaneous save operations
    const currentRef = publish ? publishOperationRef : saveOperationRef;
    if (currentRef.current) {
      console.log(`${publish ? 'Publish' : 'Save'} operation already in progress, skipping...`);
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
        if (publish) {
          setPublishing(true);
        } else {
          setSaving(true);
        }
        
        const fullCharacterData = {
          ...characterData,
          role: characterContext?.role || characterData.role || 'Character',
          is_public: publish ? true : characterData.is_public
        };

        if (isEditMode && editCharacterId) {
          await characterService.updateCharacter(editCharacterId, fullCharacterData);
          toast({
            title: publish ? "Character Published" : "Character Updated",
            description: publish 
              ? `${characterData.name} is now public and can be used by other players!`
              : `${characterData.name} has been successfully updated!`,
          });
        } else {
          await characterService.createCharacter(fullCharacterData);
          toast({
            title: publish ? "Character Published" : "Character Created",
            description: publish
              ? `${characterData.name} has been created and published!`
              : `${characterData.name} has been successfully created!`,
          });
        }

        // Only navigate away when publishing new characters
        if (!isEditMode && publish) {
          navigate('/my-characters');
        }
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
            title: publish ? "Publish Failed" : "Save Failed",
            description: `Unable to ${publish ? 'publish' : (isEditMode ? 'update' : 'save')} the character. Please try again.`,
            variant: "destructive",
          });
        }
      } finally {
        if (publish) {
          setPublishing(false);
          publishOperationRef.current = null;
        } else {
          setSaving(false);
          saveOperationRef.current = null;
        }
      }
    };

    // Store the promise to prevent duplicate operations
    const operationRef = publish ? publishOperationRef : saveOperationRef;
    operationRef.current = saveOperation();
    await operationRef.current;
  }, [isEditMode, editCharacterId, navigate, toast]);

  const handleSaveCharacter = useCallback(async (characterData: CharacterData, characterContext?: { role: string }) => {
    await handleSave(characterData, characterContext, false);
  }, [handleSave]);

  const handlePublish = useCallback(async (characterData: CharacterData, characterContext?: { role: string }) => {
    await handleSave(characterData, characterContext, true);
  }, [handleSave]);

  const handleMakePrivate = useCallback(async (characterData: CharacterData, characterContext?: { role: string }) => {
    const privateCharacterData = { ...characterData, is_public: false };
    await handleSave(privateCharacterData, characterContext, false);
  }, [handleSave]);

  return {
    handleSaveCharacter,
    handlePublish,
    handleMakePrivate,
    saving,
    publishing
  };
};
