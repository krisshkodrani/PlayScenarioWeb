import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FileText, Clock, Settings, Globe, Lock } from 'lucide-react';
import { ScenarioData } from '@/types/scenario';
import ScenarioImageUploadSection from './ScenarioImageUploadSection';

interface MergedSettingsProps {
  data: ScenarioData;
  onChange: (updates: Partial<ScenarioData>) => void;
  scenarioId?: string;
}

const difficultyLevels = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: 'Simple concepts, clear guidance'
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'Moderate complexity, some autonomy'
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: 'Complex scenarios, minimal guidance'
  },
  {
    value: 'expert',
    label: 'Expert',
    description: 'Highly complex, specialized knowledge required'
  }
];

const MergedSettings: React.FC<MergedSettingsProps> = ({ data, onChange, scenarioId }) => {
  return (
    <div className="space-y-6">
      {/* Scenario Overview */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Scenario Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Scenario Title *</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Enter a compelling scenario title"
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400"
              maxLength={100}
            />
            <p className="text-xs text-slate-400">{data.title.length}/100 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Scenario Description (for the AI) *</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Describe the scenario context, setting, and what participants will experience..."
              rows={4}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 resize-none"
              maxLength={500}
            />
            <p className="text-xs text-slate-400">{data.description.length}/500 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="initial-scene" className="text-white">Scenario Opening Message (for the Player) *</Label>
            <Textarea
              id="initial-scene"
              value={data.scenario_opening_message}
              onChange={(e) => onChange({ scenario_opening_message: e.target.value })}
              placeholder="Describe the opening scenario that will set the stage for the conversation..."
              rows={3}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 resize-none"
              maxLength={300}
            />
            <p className="text-xs text-slate-400">{data.scenario_opening_message.length}/300 characters</p>
          </div>

          {/* Featured Image Upload */}
          <ScenarioImageUploadSection
            currentImageUrl={data.featured_image_url}
            onImageChange={(imageUrl) => onChange({ featured_image_url: imageUrl || undefined })}
            scenarioId={scenarioId}
          />
        </CardContent>
      </Card>

      {/* Time Constraints */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Time Constraints
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-white">Maximum Turns</Label>
              <span className="text-cyan-400 font-medium">{data.max_turns}</span>
            </div>
            <Slider
              value={[data.max_turns]}
              onValueChange={([value]) => onChange({ max_turns: value })}
              max={50}
              min={5}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-slate-400">
              Number of conversation turns before the scenario concludes
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Settings */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Difficulty Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-white font-medium">Show Difficulty Level</Label>
              <p className="text-sm text-slate-400">Display difficulty badge in scenario listings</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-difficulty"
                checked={data.show_difficulty ?? true}
                onCheckedChange={(checked) => onChange({ show_difficulty: checked })}
              />
              <Label htmlFor="show-difficulty" className="text-sm text-white">Enable</Label>
            </div>
          </div>

          {(data.show_difficulty ?? true) && (
            <div className="space-y-2">
              <Label className="text-white">Difficulty Level</Label>
              <Select
                value={data.difficulty || 'beginner'}
                onValueChange={(value) => onChange({
                  difficulty: value as 'beginner' | 'intermediate' | 'advanced' | 'expert'
                })}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
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
        </CardContent>
      </Card>

      {/* Publication Settings */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Publication Settings
          </CardTitle>
          <p className="text-slate-400 text-sm">
            Control how your scenario is shared and accessed
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is-public" className="text-white font-medium">
                Public Scenario
              </Label>
              <p className="text-sm text-slate-400">
                Allow other users to discover and play your scenario
              </p>
            </div>
            <Switch
              id="is-public"
              checked={data.is_public}
              onCheckedChange={(checked) => onChange({ is_public: checked })}
            />
          </div>
          
          <div className="p-4 rounded-lg border border-slate-600 bg-slate-700/30">
            <div className="flex items-start gap-3">
              {data.is_public ? (
                <Globe className="w-5 h-5 text-emerald-400 mt-0.5" />
              ) : (
                <Lock className="w-5 h-5 text-amber-400 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="text-white font-medium">
                  {data.is_public ? 'Public Scenario' : 'Private Scenario'}
                </h4>
                <p className="text-sm text-slate-400">
                  {data.is_public 
                    ? 'Your scenario will be visible in the public library and can be played by anyone.'
                    : 'Your scenario will only be accessible to you and those you explicitly share it with.'
                  }
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Publishing Guidelines */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-sm">📋 Publishing Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-slate-400">
            <p>• Ensure your scenario has a clear title and description</p>
            <p>• Add at least one objective to guide participants</p>
            <p>• Include characters with detailed personalities</p>
            <p>• Test your scenario before making it public</p>
            <p>• Follow community guidelines for appropriate content</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MergedSettings;