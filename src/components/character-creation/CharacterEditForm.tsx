import React from 'react';
import { useCharacterEdit } from '@/hooks/useCharacterEdit';
import CharacterFormLoading from './CharacterFormLoading';
import CharacterFormLayout from './CharacterFormLayout';

interface CharacterEditFormProps {
  characterId: string;
  isDuplicate?: boolean;
}

const CharacterEditForm: React.FC<CharacterEditFormProps> = ({ characterId, isDuplicate = false }) => {
  const {
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
  } = useCharacterEdit(characterId, isDuplicate);

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
      isEditMode={!isDuplicate}
      isDuplicateMode={isDuplicate}
      editCharacterId={isDuplicate ? null : characterId}
      duplicateCharacterId={isDuplicate ? characterId : null}
    />
  );
};

export default CharacterEditForm;