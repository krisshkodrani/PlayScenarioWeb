
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from 'lucide-react';
import { CharacterData, CharacterContext } from '@/types/character';

interface SimplifiedBasicInfoProps {
  characterData: CharacterData;
  characterContext: CharacterContext;
  setCharacterData: React.Dispatch<React.SetStateAction<CharacterData>>;
  setCharacterContext: React.Dispatch<React.SetStateAction<CharacterContext>>;
}

const SimplifiedBasicInfo: React.FC<SimplifiedBasicInfoProps> = ({
  characterData,
  characterContext,
  setCharacterData,
  setCharacterContext
}) => {
  return (
    <Card className="bg-gradient-to-br from-slate-800/80 to-slate-700/50 backdrop-blur border border-slate-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="w-5 h-5 text-cyan-400" />
          Character Basics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Character Name - Required */}
        <div className="space-y-2">
          <Label className="text-white">Character Name *</Label>
          <Input
            value={characterData.name}
            onChange={(e) => setCharacterData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter character name"
            className="bg-slate-700/50 backdrop-blur border border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            maxLength={50}
          />
          <p className="text-xs text-slate-400">{characterData.name.length}/50 characters</p>
        </div>

        {/* Role Context Input (for smart suggestions) */}
        <div className="space-y-2">
          <Label className="text-white">Role/Position (Optional)</Label>
          <Input
            value={characterContext.role}
            onChange={(e) => setCharacterContext(prev => ({ ...prev, role: e.target.value }))}
            placeholder="e.g., IT Security Analyst, CEO, Doctor..."
            className="bg-slate-700/50 backdrop-blur border border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400"
          />
          <p className="text-xs text-slate-400">
            Helps provide better personality and expertise suggestions
          </p>
        </div>

        {/* Character Type Toggle */}
        <div className="space-y-3">
          <Label className="text-white">Character Type</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is-player-character"
              checked={characterData.is_player_character}
              onCheckedChange={(checked) => setCharacterData(prev => ({ 
                ...prev, 
                is_player_character: !!checked 
              }))}
            />
            <Label htmlFor="is-player-character" className="text-slate-300">
              This is a player character (controlled by user)
            </Label>
          </div>
          <p className="text-xs text-slate-400">
            AI characters respond automatically, player characters are controlled by users
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimplifiedBasicInfo;
