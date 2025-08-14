import React from 'react';
import { useCharacterCreate } from '@/hooks/useCharacterCreate';
import CharacterFormLoading from './CharacterFormLoading';
import CharacterFormLayout from './CharacterFormLayout';

const CharacterCreateForm = () => {
  const {
    characterData,
    setCharacterData,
    characterContext,
    setCharacterContext,
    handleSaveCharacter,
    handlePublish,
    handleMakePrivate,
    saving,
    publishing
  } = useCharacterCreate();

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
      isEditMode={false}
      isDuplicateMode={false}
      editCharacterId={null}
      duplicateCharacterId={null}
    />
  );
};

export default CharacterCreateForm;