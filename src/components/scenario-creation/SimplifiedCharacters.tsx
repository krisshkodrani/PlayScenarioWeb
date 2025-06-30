
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, AlertTriangle } from 'lucide-react';
import { ScenarioData, CharacterData } from '@/types/scenario';
import CharacterBrowserModal from './CharacterBrowserModal';
import CharacterCreationTabs from './CharacterCreationTabs';
import CharacterCardDisplay from './CharacterCardDisplay';

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

  // Character validation
  const playerCharacters = data.characters.filter(char => char.is_player_character);
  const aiCharacters = data.characters.filter(char => !char.is_player_character);
  
  const getValidationErrors = () => {
    const errors: string[] = [];
    
    if (data.characters.length > 0) {
      if (playerCharacters.length === 0) {
        errors.push('At least one player character is required');
      }
      if (playerCharacters.length > 1) {
        errors.push('Maximum one player character is allowed');
      }
      if (aiCharacters.length === 0) {
        errors.push('At least one AI character is required');
      }
      if (aiCharacters.length > 5) {
        errors.push('Maximum 5 AI characters are allowed');
      }
      if (data.characters.length > 6) {
        errors.push('Maximum 6 characters total');
      }
    }
    
    return errors;
  };

  const validationErrors = getValidationErrors();
  const hasValidationErrors = validationErrors.length > 0;

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
      // Check if adding this character would violate constraints
      const newCharacters = editingIndex !== null 
        ? [...data.characters.slice(0, editingIndex), formData, ...data.characters.slice(editingIndex + 1)]
        : [...data.characters, formData];
      
      const newPlayerChars = newCharacters.filter(char => char.is_player_character);
      const newAiChars = newCharacters.filter(char => !char.is_player_character);
      
      if (newPlayerChars.length > 1) {
        alert('You can only have one player character. Please uncheck "This is a player character" for other characters first.');
        return;
      }
      
      if (newAiChars.length > 5) {
        alert('You can only have a maximum of 5 AI characters.');
        return;
      }
      
      if (newCharacters.length > 6) {
        alert('You can only have a maximum of 6 characters total.');
        return;
      }

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
    const character = data.characters[index];
    
    // If trying to make this a player character, check if we already have one
    if (!character.is_player_character && playerCharacters.length >= 1) {
      alert('You can only have one player character. Please uncheck the existing player character first.');
      return;
    }
    
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
    // Check constraints before adding
    const totalAfterAdd = data.characters.length + selectedCharacters.length;
    const playerCharsToAdd = selectedCharacters.filter(char => char.is_player_character);
    const totalPlayerCharsAfterAdd = playerCharacters.length + playerCharsToAdd.length;
    
    if (totalPlayerCharsAfterAdd > 1) {
      alert('Adding these characters would exceed the limit of 1 player character.');
      return;
    }
    
    if (totalAfterAdd > 6) {
      alert('Adding these characters would exceed the maximum of 6 characters total.');
      return;
    }
    
    const aiCharsToAdd = selectedCharacters.filter(char => !char.is_player_character);
    const totalAiCharsAfterAdd = aiCharacters.length + aiCharsToAdd.length;
    
    if (totalAiCharsAfterAdd > 5) {
      alert('Adding these characters would exceed the maximum of 5 AI characters.');
      return;
    }

    onChange({
      characters: [...data.characters, ...selectedCharacters]
    });
  };

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
          {/* Character Constraints Info */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-300 mb-2">Character Requirements:</h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Exactly 1 player character (controlled by user)</li>
              <li>• 1-5 AI characters (controlled by AI)</li>
              <li>• Maximum 6 characters total</li>
            </ul>
          </div>

          {/* Validation Errors */}
          {hasValidationErrors && (
            <Alert variant="destructive" className="border-red-500 bg-red-500/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <ul className="space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <CharacterCreationTabs
            showForm={showForm}
            setShowForm={setShowForm}
            formData={formData}
            setFormData={setFormData}
            newKeyword={newKeyword}
            setNewKeyword={setNewKeyword}
            editingIndex={editingIndex}
            onSaveCharacter={saveCharacter}
            onResetForm={resetForm}
            onAddKeyword={addKeyword}
            onRemoveKeyword={removeKeyword}
            onShowCharacterBrowser={() => setShowCharacterBrowser(true)}
          />

          {/* Existing Characters Display */}
          {data.characters.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium">Characters in Scenario</h4>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                    {playerCharacters.length} player
                  </Badge>
                  <Badge variant="secondary" className="bg-violet-500/20 text-violet-400">
                    {aiCharacters.length} AI
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-600 text-slate-300">
                    {data.characters.length}/6 total
                  </Badge>
                </div>
              </div>
              
              <div className="grid gap-4">
                {data.characters.map((character, index) => (
                  <CharacterCardDisplay
                    key={index}
                    character={character}
                    index={index}
                    onRemove={removeCharacter}
                    onTogglePlayer={togglePlayerCharacter}
                  />
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
        excludeCharacterIds={[]}
      />
    </div>
  );
};

export default SimplifiedCharacters;
