
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
import { CharacterData } from '@/types/scenario';

interface CharacterCreationFormProps {
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

const CharacterCreationForm: React.FC<CharacterCreationFormProps> = ({
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
  return (
    <Card className="bg-slate-700/50 border-slate-600">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg">
            {editingIndex !== null ? 'Edit Character' : 'Create New Character'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
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
              onKeyPress={(e) => e.key === 'Enter' && onAddKeyword()}
            />
            <Button
              onClick={onAddKeyword}
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
                    onClick={() => onRemoveKeyword(index)}
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
            onClick={onSave}
            disabled={!formData.name.trim() || !formData.personality.trim()}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            {editingIndex !== null ? 'Update Character' : 'Add Character'}
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-slate-500 text-slate-300 hover:text-white"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CharacterCreationForm;
