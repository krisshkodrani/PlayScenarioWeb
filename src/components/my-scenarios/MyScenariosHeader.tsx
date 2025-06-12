
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Lightbulb } from 'lucide-react';

interface MyScenariosHeaderProps {
  totalScenarios: number;
  onCreateNew: () => void;
}

const MyScenariosHeader: React.FC<MyScenariosHeaderProps> = ({ 
  totalScenarios, 
  onCreateNew 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Scenarios</h1>
        <p className="text-slate-400">
          {totalScenarios === 0 
            ? "Start creating your first AI-powered scenario"
            : `Manage your ${totalScenarios} scenario${totalScenarios === 1 ? '' : 's'}`
          }
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {totalScenarios === 0 && (
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400 bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Start with a simple conversation scenario</span>
          </div>
        )}
        
        <Button 
          onClick={onCreateNew}
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Scenario
        </Button>
      </div>
    </div>
  );
};

export default MyScenariosHeader;
