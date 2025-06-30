import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
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
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                  {data.characters.length} character{data.characters.length !== 1 ? 's' : ''}
                </Badge>
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
