
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Lightbulb, Rocket } from 'lucide-react';

interface EmptyScenariosProps {
  onCreateNew: () => void;
}

const EmptyScenarios: React.FC<EmptyScenariosProps> = ({ onCreateNew }) => {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-6 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700">
          <BookOpen className="w-12 h-12 text-slate-400" />
        </div>

        {/* Heading */}
        <h3 className="text-2xl font-bold text-white mb-3">
          No scenarios yet
        </h3>
        
        {/* Description */}
        <p className="text-slate-400 mb-8 leading-relaxed">
          Start creating engaging AI-powered scenarios for training, education, or entertainment. 
          Your first scenario is just a click away!
        </p>

        {/* Create button */}
        <Button 
          onClick={onCreateNew}
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-medium mb-6"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Your First Scenario
        </Button>

        {/* Tips */}
        <div className="space-y-3 text-sm text-slate-500">
          <div className="flex items-center justify-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Start with a simple conversation scenario</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Rocket className="w-4 h-4 text-cyan-400" />
            <span>Add 2-3 characters for dynamic interactions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyScenarios;
