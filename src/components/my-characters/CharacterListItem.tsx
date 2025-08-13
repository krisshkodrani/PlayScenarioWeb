
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Copy, Trash2, Star } from 'lucide-react';
import { Character } from '@/types/character';

interface CharacterListItemProps {
  character: Character;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const CharacterListItem: React.FC<CharacterListItemProps> = ({
  character,
  onEdit,
  onDuplicate,
  onDelete
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="px-6 py-4 hover:bg-slate-750 transition-colors">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Character Info */}
        <div className="col-span-4 flex items-center gap-3">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarImage src={character.avatar_url} alt={character.name} />
            <AvatarFallback className={`${character.avatar_color} text-white font-semibold text-sm`}>
              {getInitials(character.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-white truncate">{character.name}</h3>
            <p className="text-sm text-cyan-400 truncate">{character.role}</p>
          </div>
        </div>

        {/* Expertise - Hidden on mobile */}
        <div className="col-span-3 hidden md:block">
          <div className="flex flex-wrap gap-1">
            {character.expertise_keywords.slice(0, 2).map((keyword, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-slate-700 text-slate-300"
              >
                {keyword}
              </Badge>
            ))}
            {character.expertise_keywords.length > 2 && (
              <Badge 
                variant="secondary" 
                className="text-xs bg-slate-700 text-slate-400"
              >
                +{character.expertise_keywords.length - 2}
              </Badge>
            )}
          </div>
        </div>

        {/* Usage Stats - Hidden on small screens */}
        <div className="col-span-2 hidden lg:block text-sm">
          <p className="text-white">{character.scenario_count} scenarios</p>
          <p className="text-slate-400">{character.total_responses} responses</p>
        </div>

        {/* Rating - Hidden on small screens */}
        <div className="col-span-1 hidden lg:block">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-current" />
            <span className="text-sm text-white">{character.average_rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Actions - Aligned horizontally at the end */}
        <div className="col-span-2 lg:col-span-2 flex items-center gap-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(character.id)}
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDuplicate(character.id)}
            className="text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost" 
            size="sm"
            onClick={() => onDelete(character.id)}
            className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CharacterListItem;
