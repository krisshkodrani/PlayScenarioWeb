
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, Calendar } from 'lucide-react';
import { Character } from '@/types/character';
import { formatDistanceToNow } from 'date-fns';

interface SelectableCharacterCardProps {
  character: Character;
  isSelected: boolean;
  onSelectionChange: (characterId: string, selected: boolean) => void;
}

const SelectableCharacterCard: React.FC<SelectableCharacterCardProps> = ({
  character,
  isSelected,
  onSelectionChange
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <Card className={`bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-200 cursor-pointer ${
      isSelected ? 'ring-2 ring-cyan-400 border-cyan-400' : ''
    }`}>
      <CardContent className="p-6">
        {/* Selection Checkbox */}
        <div className="flex items-start gap-4 mb-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectionChange(character.id, !!checked)}
            className="mt-1"
          />
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="w-10 h-10 shrink-0">
              <AvatarImage src={character.avatar_url} alt={character.name} />
              <AvatarFallback className={`${character.avatar_color} text-white font-semibold text-sm`}>
                {getInitials(character.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-white mb-1 truncate">
                {character.name}
              </h3>
              <p className="text-sm text-cyan-400 mb-2">{character.role}</p>
            </div>
          </div>
        </div>

        {/* Personality */}
        <p className="text-sm text-slate-300 mb-3 leading-relaxed">
          {truncateText(character.personality, 100)}
        </p>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
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

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div>
            <p className="text-slate-400">Scenarios</p>
            <p className="text-white font-medium">{character.scenario_count}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-current" />
            <span className="text-white font-medium">
              {character.average_rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Calendar className="w-3 h-3" />
          <span>Created {formatDistanceToNow(new Date(character.created_at), { addSuffix: true })}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectableCharacterCard;
