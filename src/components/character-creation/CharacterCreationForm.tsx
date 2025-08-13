
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

  const { handleSaveCharacter, handlePublish, handleMakePrivate, saving, publishing } = useCharacterSave(isEditMode, editCharacterId);

  if (loading) {
    return <CharacterFormLoading />;
  }

  return (
    <CharacterFormLayout
      characterData={characterData}
      setCharacterData={setCharacterData}
      characterContext={characterContext}
      setCharacterContext={setCharacterContext}
      onSave={() => handleSaveCharacter(characterData, characterContext)}
      onPublish={() => handlePublish(characterData, characterContext)}
      onMakePrivate={() => handleMakePrivate(characterData, characterContext)}
      saving={saving}
      publishing={publishing}
      isEditMode={isEditMode}
      isDuplicateMode={isDuplicateMode}
      editCharacterId={editCharacterId}
      duplicateCharacterId={duplicateCharacterId}
    />
  );
};

export default CharacterCreationForm;
