
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users, Lightbulb, Rocket } from 'lucide-react';

interface EmptyCharactersProps {
  onCreateNew: () => void;
}

const EmptyCharacters: React.FC<EmptyCharactersProps> = ({ onCreateNew }) => {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-6 bg-slate-800 rounded-full flex items-center justify-center border-2 border-slate-700">
          <Users className="w-12 h-12 text-slate-400" />
        </div>

        {/* Heading */}
        <h3 className="text-2xl font-bold text-white mb-3">
          No Characters Yet
        </h3>
        
        {/* Description */}
        <p className="text-slate-400 mb-8 leading-relaxed">
          Create your first AI character to start building interactive scenarios. 
          Characters are the heart of engaging story experiences!
        </p>

        {/* Create button */}
        <Button 
          onClick={onCreateNew}
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-medium mb-6"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Your First Character
        </Button>

        {/* Tips */}
        <div className="space-y-3 text-sm text-slate-500">
          <div className="flex items-center justify-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Start with a role like "Doctor" or "Engineer"</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Rocket className="w-4 h-4 text-cyan-400" />
            <span>Add personality traits to make them unique</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyCharacters;
