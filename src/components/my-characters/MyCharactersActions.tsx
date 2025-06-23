
import { useNavigate } from 'react-router-dom';

export const useMyCharactersActions = () => {
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate('/create-character');
  };

  const handleEdit = (characterId: string) => {
    navigate(`/create-character?edit=${characterId}`);
  };

  return {
    handleCreateNew,
    handleEdit,
  };
};
