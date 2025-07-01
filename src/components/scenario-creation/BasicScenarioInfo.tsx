
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { X, Plus } from 'lucide-react';

interface BasicScenarioInfoProps {
  data: any;
  onChange: (data: any) => void;
}

const categories = [
  { value: 'business-simulation', label: 'Business Simulation' },
  { value: 'crisis-management', label: 'Crisis Management' },
  { value: 'interpersonal-conflict', label: 'Interpersonal Conflict' },
  { value: 'strategic-planning', label: 'Strategic Planning' },
  { value: 'educational-roleplay', label: 'Educational Roleplay' },
  { value: 'creative-storytelling', label: 'Creative Storytelling' }
];

const difficultyLevels = [
  { value: 'beginner', label: 'Beginner', description: 'Simple concepts, clear guidance' },
  { value: 'intermediate', label: 'Intermediate', description: 'Moderate complexity, some autonomy' },
  { value: 'advanced', label: 'Advanced', description: 'Complex scenarios, minimal guidance' },
  { value: 'expert', label: 'Expert', description: 'Highly complex, specialized knowledge required' }
];

const maturityRatings = [
  { value: 'general', label: 'General Audiences', description: 'Suitable for all ages' },
  { value: 'teen', label: 'Teen+', description: 'Suitable for 13+ years' },
  { value: 'mature', label: 'Mature', description: 'Adult themes, professional context' },
  { value: 'restricted', label: 'Restricted', description: 'Sensitive content, controlled access' }
];

const BasicScenarioInfo: React.FC<BasicScenarioInfoProps> = ({ data, onChange }) => {
  const [newTag, setNewTag] = React.useState('');

  const handleInputChange = (field: string, value: string | number | boolean) => {
    onChange({ [field]: value });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !data.tags.includes(newTag.trim())) {
      onChange({ tags: [...(data.tags || []), newTag.trim()] });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange({ tags: (data.tags || []).filter((tag: string) => tag !== tagToRemove) });
  };

  return (
    <div className="space-y-6">
      {/* Title and Description */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="scenario-title">Scenario Title *</Label>
          <Input
            id="scenario-title"
            value={data.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter scenario title"
            maxLength={100}
            className="bg-slate-700 border-slate-600"
          />
          <p className="text-xs text-slate-400">
            {(data.title || '').length}/100 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="scenario-description">Description *</Label>
          <Textarea
            id="scenario-description"
            value={data.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe your scenario. What will users experience? What skills will they develop? What challenges will they face?"
            maxLength={2000}
            rows={6}
            className="bg-slate-700 border-slate-600"
          />
          <p className="text-xs text-slate-400">
            {(data.description || '').length}/2,000 characters
          </p>
        </div>
      </div>

      {/* Category and Tags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select value={data.category || ''} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger className="bg-slate-700 border-slate-600">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag"
              className="bg-slate-700 border-slate-600"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <Button onClick={handleAddTag} variant="outline" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {data.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Difficulty Settings */}
      <div className="space-y-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base font-medium">Difficulty Settings</Label>
            <p className="text-sm text-slate-400">Configure how difficulty is displayed for your scenario</p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-difficulty"
              checked={data.show_difficulty ?? true}
              onCheckedChange={(checked) => handleInputChange('show_difficulty', checked)}
            />
            <Label htmlFor="show-difficulty" className="text-sm">Show difficulty</Label>
          </div>
        </div>

        {(data.show_difficulty ?? true) && (
          <div className="space-y-2">
            <Label>Difficulty Level</Label>
            <Select 
              value={data.difficulty || 'beginner'} 
              onValueChange={(value) => handleInputChange('difficulty', value)}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficultyLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div>
                      <div className="font-medium">{level.label}</div>
                      <div className="text-xs text-slate-400">{level.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Duration and Maturity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="estimated-time">Estimated Duration (minutes)</Label>
          <Input
            id="estimated-time"
            type="number"
            value={data.estimatedTime || 30}
            onChange={(e) => handleInputChange('estimatedTime', parseInt(e.target.value) || 30)}
            min={5}
            max={180}
            className="bg-slate-700 border-slate-600"
          />
        </div>

        <div className="space-y-2">
          <Label>Maturity Rating</Label>
          <Select value={data.maturityRating || 'general'} onValueChange={(value) => handleInputChange('maturityRating', value)}>
            <SelectTrigger className="bg-slate-700 border-slate-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {maturityRatings.map((rating) => (
                <SelectItem key={rating.value} value={rating.value}>
                  <div>
                    <div className="font-medium">{rating.label}</div>
                    <div className="text-xs text-slate-400">{rating.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default BasicScenarioInfo;
