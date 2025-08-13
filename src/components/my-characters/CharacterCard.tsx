
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Copy, Trash2, Star, Calendar } from 'lucide-react';
import { Character } from '@/types/character';
import { formatDistanceToNow } from 'date-fns';

interface CharacterCardProps {
  character: Character;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-200 group h-full flex flex-col">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header with Avatar and Name */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-12 h-12 shrink-0">
            <AvatarImage src={character.avatar_url} alt={character.name} />
            <AvatarFallback className={`${character.avatar_color} text-white font-semibold`}>
              {getInitials(character.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-1 truncate">
              {character.name}
            </h3>
            <p className="text-sm text-cyan-400 mb-2">{character.role}</p>
          </div>
        </div>

        {/* Personality */}
        <p className="text-sm text-slate-300 mb-4 leading-relaxed">
          {truncateText(character.personality, 120)}
        </p>

        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {character.expertise_keywords.slice(0, 3).map((keyword, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-slate-700 text-slate-300 hover:bg-slate-600"
            >
              {keyword}
            </Badge>
          ))}
          {character.expertise_keywords.length > 3 && (
            <Badge 
              variant="secondary" 
              className="text-xs bg-slate-700 text-slate-400"
            >
              +{character.expertise_keywords.length - 3}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-slate-400">Scenarios</p>
            <p className="text-white font-medium">{character.scenario_count}</p>
          </div>
          <div>
            <p className="text-slate-400">Responses</p>
            <p className="text-white font-medium">{character.total_responses}</p>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-4 h-4 text-amber-400 fill-current" />
          <span className="text-sm text-white font-medium">
            {character.average_rating.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400">rating</span>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-2 mb-4 text-xs text-slate-400">
          <Calendar className="w-3 h-3" />
          <span>Created {formatDistanceToNow(new Date(character.created_at), { addSuffix: true })}</span>
        </div>

        {/* Action Buttons - Full width and pushed to bottom */}
        <div className="mt-auto">
          <div className="grid grid-cols-3 gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(character.id)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDuplicate(character.id)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <Copy className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(character.id)}
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CharacterCard;
