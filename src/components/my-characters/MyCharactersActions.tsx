
import { useNavigate } from 'react-router-dom';

export const useMyCharactersActions = () => {
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate('/create-character');
  };

  const handleEdit = (characterId: string) => {
    navigate(`/create-character?edit=${characterId}`);
  };

  const handleDuplicate = (characterId: string) => {
    navigate(`/create-character?duplicate=${characterId}`);
  };

  return {
    handleCreateNew,
    handleEdit,
    handleDuplicate,
  };
};
