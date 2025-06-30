
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Minus, User, X, Users, Library } from 'lucide-react';
import { ScenarioData, CharacterData } from '@/types/scenario';
import CharacterBrowserModal from './CharacterBrowserModal';

interface SimplifiedCharactersProps {
  data: ScenarioData;
  onChange: (updates: Partial<ScenarioData>) => void;
}

const SimplifiedCharacters: React.FC<SimplifiedCharactersProps> = ({
  data,
  onChange
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<CharacterData>({
    name: '',
    personality: '',
    expertise_keywords: [],
    is_player_character: false
  });
  const [newKeyword, setNewKeyword] = useState('');
  const [showCharacterBrowser, setShowCharacterBrowser] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      personality: '',
      expertise_keywords: [],
      is_player_character: false
    });
    setNewKeyword('');
    setShowForm(false);
    setEditingIndex(null);
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.expertise_keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise_keywords: [...prev.expertise_keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      expertise_keywords: prev.expertise_keywords.filter((_, i) => i !== index)
    }));
  };

  const saveCharacter = () => {
    if (formData.name.trim() && formData.personality.trim()) {
      if (editingIndex !== null) {
        const updatedCharacters = [...data.characters];
        updatedCharacters[editingIndex] = formData;
        onChange({
          characters: updatedCharacters
        });
      } else {
        onChange({
          characters: [...data.characters, formData]
        });
      }
      resetForm();
    }
  };

  const removeCharacter = (index: number) => {
    onChange({
      characters: data.characters.filter((_, i) => i !== index)
    });
  };

  const togglePlayerCharacter = (index: number) => {
    const updatedCharacters = [...data.characters];
    updatedCharacters[index] = {
      ...updatedCharacters[index],
      is_player_character: !updatedCharacters[index].is_player_character
    };
    onChange({
      characters: updatedCharacters
    });
  };

  const handleAddFromLibrary = (selectedCharacters: CharacterData[]) => {
    onChange({
      characters: [...data.characters, ...selectedCharacters]
    });
  };

  // Get character names that are already in the scenario to exclude from browser
  const existingCharacterNames = data.characters.map(char => char.name.toLowerCase());

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <User className="w-5 h-5" />
              Scenario Characters
            </CardTitle>
          </div>
          <p className="text-slate-400 text-sm">
            Create AI characters that will participate in the scenario
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Character Management Options */}
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700">
              <TabsTrigger value="create" className="data-[state=active]:bg-slate-600">
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </TabsTrigger>
              <TabsTrigger value="browse" className="data-[state=active]:bg-slate-600">
                <Library className="w-4 h-4 mr-2" />
                Browse Library
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="space-y-4 mt-6">
              {!showForm && (
                <div className="text-center py-6 border-2 border-dashed border-slate-600 rounded-lg">
                  <User className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400 mb-3">Quickly create a new character for this scenario</p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Character
                  </Button>
                </div>
              )}

              {/* Character Creation Form */}
              {showForm && (
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">
                        {editingIndex !== null ? 'Edit Character' : 'Create New Character'}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetForm}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="char-name" className="text-white">Character Name *</Label>
                      <Input
                        id="char-name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter character name"
                        className="bg-slate-600 border-slate-500 text-white placeholder-slate-400 focus:border-cyan-400"
                        maxLength={50}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="char-personality" className="text-white">Personality *</Label>
                      <Textarea
                        id="char-personality"
                        value={formData.personality}
                        onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
                        placeholder="Describe the character's personality, behavior, and speaking style..."
                        rows={4}
                        className="bg-slate-600 border-slate-500 text-white placeholder-slate-400 focus:border-cyan-400 resize-none"
                        maxLength={500}
                      />
                      <p className="text-xs text-slate-400">{formData.personality.length}/500 characters</p>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-white">Expertise Keywords</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          placeholder="Add expertise..."
                          className="bg-slate-600 border-slate-500 text-white placeholder-slate-400 focus:border-cyan-400"
                          onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                        />
                        <Button
                          onClick={addKeyword}
                          disabled={!newKeyword.trim()}
                          variant="outline"
                          className="border-slate-500 text-slate-300 hover:text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {formData.expertise_keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.expertise_keywords.map((keyword, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-slate-600 text-slate-200">
                              {keyword}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 ml-1 hover:text-red-400"
                                onClick={() => removeKeyword(index)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is-player"
                        checked={formData.is_player_character}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_player_character: !!checked }))}
                      />
                      <Label htmlFor="is-player" className="text-slate-300">
                        This is a player character (controlled by user)
                      </Label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={saveCharacter}
                        disabled={!formData.name.trim() || !formData.personality.trim()}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white"
                      >
                        {editingIndex !== null ? 'Update Character' : 'Add Character'}
                      </Button>
                      <Button
                        onClick={resetForm}
                        variant="outline"
                        className="border-slate-500 text-slate-300 hover:text-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="browse" className="space-y-4 mt-6">
              <div className="text-center py-6 border-2 border-dashed border-slate-600 rounded-lg">
                <Users className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 mb-3">Browse and select from your existing characters</p>
                <Button
                  onClick={() => setShowCharacterBrowser(true)}
                  className="bg-violet-500 hover:bg-violet-600 text-white"
                >
                  <Library className="w-4 h-4 mr-2" />
                  Browse My Characters
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Existing Characters Display */}
          {data.characters.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium">Characters in Scenario</h4>
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                  {data.characters.length} character{data.characters.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="grid gap-4">
                {data.characters.map((character, index) => (
                  <Card key={index} className="bg-slate-700/30 border-slate-600">
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
                              onCheckedChange={() => togglePlayerCharacter(index)}
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
                            onClick={() => removeCharacter(index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1 h-auto"
                          >
                            <Minus className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {data.characters.length === 0 && (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No characters created yet</p>
              <p className="text-slate-500 text-xs">Add characters to bring your scenario to life</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Character Browser Modal */}
      <CharacterBrowserModal
        isOpen={showCharacterBrowser}
        onClose={() => setShowCharacterBrowser(false)}
        onSelectCharacters={handleAddFromLibrary}
        excludeCharacterIds={[]} // We'll use name matching instead for simplicity
      />
    </div>
  );
};

export default SimplifiedCharacters;
