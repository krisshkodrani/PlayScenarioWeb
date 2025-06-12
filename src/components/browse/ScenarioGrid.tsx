
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Scenario } from '@/types/scenario';
import ScenarioCard from './ScenarioCard';

interface ScenarioGridProps {
  scenarios: Scenario[];
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
}

const ScenarioGrid: React.FC<ScenarioGridProps> = ({
  scenarios,
  onLike,
  onBookmark,
  onClearFilters,
  hasFilters
}) => {
  if (scenarios.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 mb-4">
          <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-white">No scenarios found</h3>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
        {hasFilters && (
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50"
          >
            Clear Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scenarios.map(scenario => (
        <ScenarioCard
          key={scenario.id}
          scenario={scenario}
          onLike={onLike}
          onBookmark={onBookmark}
        />
      ))}
    </div>
  );
};

export default ScenarioGrid;
