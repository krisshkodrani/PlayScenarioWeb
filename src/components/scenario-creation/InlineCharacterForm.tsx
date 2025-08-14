import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { X, Plus, Save, XCircle } from 'lucide-react';
import { CharacterData } from '@/types/scenario';

interface InlineCharacterFormProps {
  formData: CharacterData;
  setFormData: React.Dispatch<React.SetStateAction<CharacterData>>;
  newKeyword: string;
  setNewKeyword: React.Dispatch<React.SetStateAction<string>>;
  editingIndex: number | null;
  onSave: () => void;
  onCancel: () => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (index: number) => void;
}

const InlineCharacterForm: React.FC<InlineCharacterFormProps> = ({
  formData,
  setFormData,
  newKeyword,
  setNewKeyword,
  editingIndex,
  onSave,
  onCancel,
  onAddKeyword,
  onRemoveKeyword
}) => {
  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddKeyword();
    }
  };

  const isFormValid = formData.name.trim() && formData.personality.trim();

  return (
    <Card className="bg-slate-700 border-slate-600">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-medium">
            {editingIndex !== null ? 'Edit Character' : 'Create New Character'}
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Character Name */}
          <div className="space-y-2">
            <Label htmlFor="character-name" className="text-slate-300">
              Character Name *
            </Label>
            <Input
              id="character-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter character name..."
              className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
            />
          </div>

          {/* Personality */}
          <div className="space-y-2">
            <Label htmlFor="character-personality" className="text-slate-300">
              Personality Description *
            </Label>
            <Textarea
              id="character-personality"
              value={formData.personality}
              onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
              placeholder="Describe the character's personality, traits, and behavior..."
              className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 min-h-[100px]"
            />
          </div>

          {/* Expertise Keywords */}
          <div className="space-y-2">
            <Label htmlFor="character-keywords" className="text-slate-300">
              Expertise Keywords
            </Label>
            <div className="flex gap-2">
              <Input
                id="character-keywords"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={handleKeywordKeyPress}
                placeholder="Add expertise keyword..."
                className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              />
              <Button
                type="button"
                onClick={onAddKeyword}
                disabled={!newKeyword.trim()}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Keywords Display */}
            {formData.expertise_keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.expertise_keywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-slate-600 text-slate-200 hover:bg-slate-500 cursor-pointer"
                    onClick={() => onRemoveKeyword(index)}
                  >
                    {keyword}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onSave}
              disabled={!isFormValid}
              className="bg-emerald-500 hover:bg-emerald-600 text-white flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingIndex !== null ? 'Update Character' : 'Add Character'}
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InlineCharacterForm;