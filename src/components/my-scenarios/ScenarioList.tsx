
import React from 'react';
import ScenarioCard from './ScenarioCard';
import ScenarioListItem from './ScenarioListItem';
import { Scenario } from '@/types/scenario';

interface ScenarioListProps {
  scenarios: Scenario[];
  viewMode: 'grid' | 'list';
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onTogglePublic: (id: string, isPublic: boolean) => void;
}

const ScenarioList: React.FC<ScenarioListProps> = ({
  scenarios,
  viewMode,
  onEdit,
  onView,
  onDelete,
  onDuplicate,
  onTogglePublic
}) => {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onTogglePublic={onTogglePublic}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-8">
      {scenarios.map((scenario) => (
        <ScenarioListItem
          key={scenario.id}
          scenario={scenario}
          onEdit={onEdit}
          onView={onView}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onTogglePublic={onTogglePublic}
        />
      ))}
    </div>
  );
};

export default ScenarioList;
