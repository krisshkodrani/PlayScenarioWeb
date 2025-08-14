
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import CharacterCreateForm from './CharacterCreateForm';
import CharacterEditForm from './CharacterEditForm';

const CharacterCreationForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const editCharacterId = searchParams.get('edit');
  const duplicateCharacterId = searchParams.get('duplicate');

  // If we have an edit or duplicate ID, use the edit form
  if (editCharacterId || duplicateCharacterId) {
    const characterId = editCharacterId || duplicateCharacterId;
    const isDuplicate = !!duplicateCharacterId;
    
    return (
      <CharacterEditForm 
        characterId={characterId!} 
        isDuplicate={isDuplicate}
      />
    );
  }

  // Otherwise, use the create form
  return <CharacterCreateForm />;
};

export default CharacterCreationForm;
