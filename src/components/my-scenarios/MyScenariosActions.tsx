
import { useNavigate } from 'react-router-dom';

export const useMyScenariosActions = () => {
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate('/create-scenario');
  };

  const handleEdit = (scenarioId: string) => {
    navigate(`/create-scenario?edit=${scenarioId}`);
  };

  const handleView = (scenarioId: string) => {
    navigate(`/scenario/${scenarioId}`);
  };

  return {
    handleCreateNew,
    handleEdit,
    handleView,
  };
};
