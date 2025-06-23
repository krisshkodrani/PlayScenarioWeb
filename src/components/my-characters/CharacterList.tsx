
import React from 'react';
import CharacterCard from './CharacterCard';
import CharacterListItem from './CharacterListItem';
import { Character } from '@/types/character';

interface CharacterListProps {
  characters: Character[];
  viewMode: 'grid' | 'list';
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const CharacterList: React.FC<CharacterListProps> = ({
  characters,
  viewMode,
  onEdit,
  onDuplicate,
  onDelete
}) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-3 bg-slate-750 border-b border-slate-700">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-slate-400">
            <div className="col-span-4">Character</div>
            <div className="col-span-3 hidden md:block">Expertise</div>
            <div className="col-span-2 hidden lg:block">Usage</div>
            <div className="col-span-1 hidden lg:block">Rating</div>
            <div className="col-span-2 lg:col-span-2">Actions</div>
          </div>
        </div>
        <div className="divide-y divide-slate-700">
          {characters.map((character) => (
            <CharacterListItem
              key={character.id}
              character={character}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {characters.map((character) => (
        <CharacterCard
          key={character.id}
          character={character}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CharacterList;
