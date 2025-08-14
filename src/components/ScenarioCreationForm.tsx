
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ScenarioCreateForm from './scenario-creation/ScenarioCreateForm';
import ScenarioEditForm from './scenario-creation/ScenarioEditForm';

const ScenarioCreationForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const editScenarioId = searchParams.get('edit');
  const duplicateScenarioId = searchParams.get('duplicate');

  // If we have an edit or duplicate ID, use the edit form
  if (editScenarioId || duplicateScenarioId) {
    const scenarioId = editScenarioId || duplicateScenarioId;
    const isDuplicate = !!duplicateScenarioId;
    
    return (
      <ScenarioEditForm 
        scenarioId={scenarioId!} 
        isDuplicate={isDuplicate}
      />
    );
  }

  // Otherwise, use the create form
  return <ScenarioCreateForm />;
};

export default ScenarioCreationForm;
