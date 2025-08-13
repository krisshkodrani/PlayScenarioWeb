import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { User, UserX, Search } from 'lucide-react';
import { ScenarioData, CharacterData } from '@/types/scenario';
import CharacterBrowserModal from './CharacterBrowserModal';
interface PlayerCharacterTabProps {
  data: ScenarioData;
  onChange: (updates: Partial<ScenarioData>) => void;
}
const PlayerCharacterTab: React.FC<PlayerCharacterTabProps> = ({
  data,
  onChange
}) => {
  const [showCharacterBrowser, setShowCharacterBrowser] = useState(false);

  // Get current player character
  const playerCharacter = data.characters.find(char => char.is_player_character);
  const playerCharacterType = playerCharacter ? 'character' : 'anonymous';
  const handlePlayerTypeChange = (value: string) => {
    if (value === 'anonymous') {
      // Remove player character from the characters array
      onChange({
        characters: data.characters.filter(char => !char.is_player_character)
      });
    } else if (value === 'character' && !playerCharacter) {
      // Open character browser to select a character
      setShowCharacterBrowser(true);
    }
  };
  const handleSelectPlayerCharacter = (selectedCharacters: CharacterData[]) => {
    if (selectedCharacters.length > 0) {
      const newPlayerCharacter = {
        ...selectedCharacters[0],
        is_player_character: true
      };

      // Remove any existing player character and add the new one
      const nonPlayerCharacters = data.characters.filter(char => !char.is_player_character);
      onChange({
        characters: [...nonPlayerCharacters, newPlayerCharacter]
      });
    }
  };
  const handleChangeCharacter = () => {
    setShowCharacterBrowser(true);
  };
  const handleRemovePlayerCharacter = () => {
    onChange({
      characters: data.characters.filter(char => !char.is_player_character)
    });
  };
  return <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <User className="w-5 h-5" />
            Player Character
          </CardTitle>
          <p className="text-slate-400 text-sm">
            Choose how you want to participate in this scenario
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Player Type Selection */}
          <RadioGroup value={playerCharacterType} onValueChange={handlePlayerTypeChange} className="space-y-4">
            {/* Anonymous Player Option */}
            <div className="flex items-start space-x-3 p-4 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors">
              <RadioGroupItem value="anonymous" id="anonymous" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="anonymous" className="text-white font-medium cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <UserX className="w-4 h-4 text-amber-400" />
                    Anonymous Player
                  </div>
                </Label>
                <p className="text-sm text-slate-400">Play without a specific character identity.</p>
              </div>
            </div>

            {/* Character Player Option */}
            <div className="flex items-start space-x-3 p-4 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors">
              <RadioGroupItem value="character" id="character" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="character" className="text-white font-medium cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-cyan-400" />
                    Play as Character
                  </div>
                </Label>
                <p className="text-sm text-slate-400 mb-3">
                  Choose a character from your library to roleplay during the scenario.
                </p>
                
                {playerCharacterType === 'character' && <div className="mt-3">
                    {playerCharacter ?
                // Display selected character
                <div className="bg-slate-700/50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-1">{playerCharacter.name}</h4>
                            <p className="text-sm text-slate-300 mb-2 line-clamp-2">{playerCharacter.personality}</p>
                            {playerCharacter.expertise_keywords.length > 0 && <div className="flex flex-wrap gap-1">
                                {playerCharacter.expertise_keywords.slice(0, 3).map((keyword, index) => <span key={index} className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                                    {keyword}
                                  </span>)}
                                {playerCharacter.expertise_keywords.length > 3 && <span className="text-xs text-slate-400">
                                    +{playerCharacter.expertise_keywords.length - 3} more
                                  </span>}
                              </div>}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm" onClick={handleChangeCharacter} className="border-slate-600 text-slate-300 hover:bg-slate-700">
                            Change Character
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleRemovePlayerCharacter} className="border-red-600 text-red-400 hover:bg-red-500/10">
                            Remove
                          </Button>
                        </div>
                      </div> :
                // No character selected yet
                <Button variant="outline" onClick={() => setShowCharacterBrowser(true)} className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10">
                        <Search className="w-4 h-4 mr-2" />
                        Choose Character
                      </Button>}
                  </div>}
              </div>
            </div>
          </RadioGroup>

          {/* Info Box */}
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Player Character Info:</h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Anonymous: Interact as yourself without roleplay constraints</li>
              <li>• Character: Roleplay as a specific character with defined personality</li>
              <li>• You can change this setting anytime before starting the scenario</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Character Browser Modal - Only show characters from user's library */}
      <CharacterBrowserModal isOpen={showCharacterBrowser} onClose={() => setShowCharacterBrowser(false)} onSelectCharacters={handleSelectPlayerCharacter} excludeCharacterIds={data.characters.filter(char => !char.is_player_character).map(char => char.id).filter(Boolean)} maxSelection={1} title="Choose Player Character" description="Select a character from your library to play as in this scenario" />
    </div>;
};
export default PlayerCharacterTab;