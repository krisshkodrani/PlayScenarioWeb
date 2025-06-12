
import { useNavigate } from 'react-router-dom';

export const useMyCharactersActions = () => {
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate('/create-character');
  };

  const handleEdit = (characterId: string) => {
    navigate(`/create-character?edit=${characterId}`);
  };

  const handleUseInScenario = (characterId: string) => {
    // Navigate to scenario creation with character pre-selected
    navigate(`/create-scenario?character=${characterId}`);
  };

  return {
    handleCreateNew,
    handleEdit,
    handleUseInScenario,
  };
};
