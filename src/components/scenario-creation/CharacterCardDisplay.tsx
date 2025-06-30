
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Minus } from 'lucide-react';
import { CharacterData } from '@/types/scenario';

interface CharacterCardDisplayProps {
  character: CharacterData;
  index: number;
  onRemove: (index: number) => void;
  onTogglePlayer: (index: number) => void;
}

const CharacterCardDisplay: React.FC<CharacterCardDisplayProps> = ({
  character,
  index,
  onRemove,
  onTogglePlayer
}) => {
  return (
    <Card className="bg-slate-700/30 border-slate-600">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h5 className="font-semibold text-white">{character.name}</h5>
              <Badge variant={character.is_player_character ? "default" : "secondary"} className="text-xs">
                {character.is_player_character ? 'Player' : 'AI'}
              </Badge>
            </div>
            <p className="text-sm text-slate-300 line-clamp-2">{character.personality}</p>
            {character.expertise_keywords.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {character.expertise_keywords.slice(0, 3).map((keyword, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs text-slate-400 border-slate-500">
                    {keyword}
                  </Badge>
                ))}
                {character.expertise_keywords.length > 3 && (
                  <Badge variant="outline" className="text-xs text-slate-500 border-slate-600">
                    +{character.expertise_keywords.length - 3}
                  </Badge>
                )}
              </div>
            )}
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id={`player-${index}`}
                checked={character.is_player_character}
                onCheckedChange={() => onTogglePlayer(index)}
              />
              <Label htmlFor={`player-${index}`} className="text-xs text-slate-400">
                This is a player character (controlled by user)
              </Label>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1 h-auto"
            >
              <Minus className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CharacterCardDisplay;
