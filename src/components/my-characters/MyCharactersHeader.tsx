
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';

interface MyCharactersHeaderProps {
  totalCharacters: number;
  onCreateNew: () => void;
}

const MyCharactersHeader: React.FC<MyCharactersHeaderProps> = ({ 
  totalCharacters, 
  onCreateNew 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-white">My Characters</h1>
          {totalCharacters > 0 && (
            <span className="bg-slate-700 text-cyan-400 px-3 py-1 rounded-full text-sm font-medium">
              {totalCharacters}
            </span>
          )}
        </div>
        <p className="text-slate-400">
          {totalCharacters === 0 
            ? "Create your first AI character to start building interactive scenarios"
            : `Manage your collection of ${totalCharacters} AI character${totalCharacters === 1 ? '' : 's'}`
          }
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {totalCharacters === 0 && (
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400 bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Start with a simple character role</span>
          </div>
        )}
        
        <Button 
          onClick={onCreateNew}
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Character
        </Button>
      </div>
    </div>
  );
};

export default MyCharactersHeader;
