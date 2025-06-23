
import React from 'react';
import { useCharacterFormData } from '@/hooks/useCharacterFormData';
import { useCharacterSave } from '@/hooks/useCharacterSave';
import CharacterFormLoading from './CharacterFormLoading';
import CharacterFormLayout from './CharacterFormLayout';

const CharacterCreationForm = () => {
  const {
    characterData,
    setCharacterData,
    characterContext,
    setCharacterContext,
    loading,
    isEditMode,
    isDuplicateMode,
    editCharacterId,
    duplicateCharacterId
  } = useCharacterFormData();

  const { handleSaveCharacter, saving } = useCharacterSave(isEditMode, editCharacterId);

  if (loading) {
    return <CharacterFormLoading />;
  }

  return (
    <CharacterFormLayout
      characterData={characterData}
      setCharacterData={setCharacterData}
      characterContext={characterContext}
      setCharacterContext={setCharacterContext}
      onSave={() => handleSaveCharacter(characterData)}
      saving={saving}
      isEditMode={isEditMode}
      isDuplicateMode={isDuplicateMode}
      editCharacterId={editCharacterId}
      duplicateCharacterId={duplicateCharacterId}
    />
  );
};

export default CharacterCreationForm;
