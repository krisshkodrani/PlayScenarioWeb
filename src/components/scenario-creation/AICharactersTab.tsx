import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bot, AlertTriangle } from 'lucide-react';
import { ScenarioData, CharacterData } from '@/types/scenario';
import CharacterBrowserModal from './CharacterBrowserModal';
import CharacterCreationTabs from './CharacterCreationTabs';
import CharacterCardDisplay from './CharacterCardDisplay';

interface AICharactersTabProps {
  data: ScenarioData;
  onChange: (updates: Partial<ScenarioData>) => void;
}

const AICharactersTab: React.FC<AICharactersTabProps> = ({ data, onChange }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<CharacterData>({
    name: '',
    personality: '',
    expertise_keywords: [],
    is_player_character: false // Always false for AI characters
  });
  const [newKeyword, setNewKeyword] = useState('');
  const [showCharacterBrowser, setShowCharacterBrowser] = useState(false);

  // Get only AI characters (non-player characters)
  const aiCharacters = data.characters.filter(char => !char.is_player_character);
  
  const getValidationErrors = () => {
    const errors: string[] = [];
    
    if (aiCharacters.length === 0) {
      errors.push('At least one AI character is required');
    }
    if (aiCharacters.length > 5) {
      errors.push('Maximum 5 AI characters are allowed');
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
      // Ensure this is marked as AI character
      const aiCharacterData = { ...formData, is_player_character: false };
      
      // Check AI character limit
      const newAiCharacters = editingIndex !== null 
        ? [...aiCharacters.slice(0, editingIndex), aiCharacterData, ...aiCharacters.slice(editingIndex + 1)]
        : [...aiCharacters, aiCharacterData];
      
      if (newAiCharacters.length > 5) {
        alert('You can only have a maximum of 5 AI characters.');
        return;
      }

      // Update the full characters array
      const playerCharacters = data.characters.filter(char => char.is_player_character);
      const updatedCharacters = [...playerCharacters, ...newAiCharacters];

      if (editingIndex !== null) {
        // Replace the AI character at the specific index
        const aiCharacterIndex = data.characters.findIndex((char, idx) => 
          !char.is_player_character && aiCharacters.findIndex(ai => ai === char) === editingIndex
        );
        if (aiCharacterIndex !== -1) {
          const updated = [...data.characters];
          updated[aiCharacterIndex] = aiCharacterData;
          onChange({ characters: updated });
        }
      } else {
        onChange({ characters: [...data.characters, aiCharacterData] });
      }
      
      resetForm();
    }
  };

  const removeCharacter = (index: number) => {
    // Find the actual index in the full characters array
    const aiCharacter = aiCharacters[index];
    const fullIndex = data.characters.findIndex(char => char === aiCharacter);
    
    if (fullIndex !== -1) {
      onChange({
        characters: data.characters.filter((_, i) => i !== fullIndex)
      });
    }
  };

  const handleAddFromLibrary = (selectedCharacters: CharacterData[]) => {
    // Filter to only AI characters and enforce limits
    const aiCharsToAdd = selectedCharacters.map(char => ({ ...char, is_player_character: false }));
    const totalAiCharsAfterAdd = aiCharacters.length + aiCharsToAdd.length;
    
    if (totalAiCharsAfterAdd > 5) {
      alert('Adding these characters would exceed the maximum of 5 AI characters.');
      return;
    }

    onChange({
      characters: [...data.characters, ...aiCharsToAdd]
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-violet-400 flex items-center gap-2">
              <Bot className="w-5 h-5" />
              AI Characters
            </CardTitle>
            <Badge variant="secondary" className="bg-violet-500/20 text-violet-400">
              {aiCharacters.length}/5 characters
            </Badge>
          </div>
          <p className="text-slate-400 text-sm">
            Create or select AI characters that will participate in the scenario
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Character Requirements Info */}
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-300 mb-2">AI Character Requirements:</h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• 1-5 AI characters required</li>
              <li>• AI characters are controlled by the system</li>
              <li>• Each character should have distinct personality and expertise</li>
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

          {/* Existing AI Characters Display */}
          {aiCharacters.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium">AI Characters in Scenario</h4>
              </div>
              
              <div className="grid gap-4">
                {aiCharacters.map((character, index) => (
                  <CharacterCardDisplay
                    key={index}
                    character={character}
                    index={index}
                    onRemove={removeCharacter}
                    onTogglePlayer={() => {}} // No player toggle for AI characters
                    hidePlayerToggle={true}
                  />
                ))}
              </div>
            </div>
          )}

          {aiCharacters.length === 0 && (
            <div className="text-center py-8">
              <Bot className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No AI characters created yet</p>
              <p className="text-slate-500 text-xs">Add AI characters to bring your scenario to life</p>
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

export default AICharactersTab;
