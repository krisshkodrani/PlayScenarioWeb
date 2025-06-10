import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Play, BookOpen } from 'lucide-react';

interface NarrativeStructureProps {
  data: any;
  onChange: (data: any) => void;
}

const transitionTypes = [
  { value: 'automatic', label: 'Automatic', description: 'Moves to next scene automatically' },
  { value: 'user-triggered', label: 'User-Triggered', description: 'User chooses when to proceed' },
  { value: 'objective-based', label: 'Objective-Based', description: 'Triggered by objective completion' },
  { value: 'time-based', label: 'Time-Based', description: 'Advances after time limit' }
];

const NarrativeStructure: React.FC<NarrativeStructureProps> = ({ data, onChange }) => {
  const [newScene, setNewScene] = useState({
    title: '',
    description: '',
    environmentContext: '',
    transitionType: 'automatic'
  });

  const [newStarter, setNewStarter] = useState('');

  const addScene = () => {
    if (!newScene.title.trim()) return;

    const scene = {
      ...newScene,
      id: Date.now().toString()
    };

    onChange({
      scenes: [...(data.scenes || []), scene]
    });

    setNewScene({
      title: '',
      description: '',
      environmentContext: '',
      transitionType: 'automatic'
    });
  };

  const removeScene = (id: string) => {
    onChange({
      scenes: (data.scenes || []).filter((scene: any) => scene.id !== id)
    });
  };

  const addConversationStarter = () => {
    if (!newStarter.trim()) return;

    onChange({
      conversationStarters: [...(data.conversationStarters || []), newStarter.trim()]
    });

    setNewStarter('');
  };

  const removeConversationStarter = (index: number) => {
    onChange({
      conversationStarters: (data.conversationStarters || []).filter((_: any, i: number) => i !== index)
    });
  };

  return (
    <div className="space-y-8">
      {/* Scenes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-medium">Scene Structure</h3>
        </div>
        <p className="text-sm text-slate-400">
          Break your scenario into scenes or chapters to provide structure and natural progression points.
        </p>

        {/* Existing Scenes */}
        {data.scenes && data.scenes.length > 0 && (
          <div className="space-y-3">
            {data.scenes.map((scene: any, index: number) => (
              <Card key={scene.id} className="p-4 bg-slate-700 border-slate-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                      Scene {index + 1}
                    </Badge>
                    <h4 className="font-medium text-white">{scene.title}</h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeScene(scene.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-sm text-slate-300 mb-3">{scene.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Environment: </span>
                    <span className="text-slate-200">{scene.environmentContext || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Transition: </span>
                    <span className="text-violet-400">
                      {transitionTypes.find(t => t.value === scene.transitionType)?.label || scene.transitionType}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add New Scene */}
        <Card className="p-4 bg-slate-800 border-slate-600">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Scene Title *</Label>
              <Input
                value={newScene.title}
                onChange={(e) => setNewScene(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Initial Crisis Response"
                className="bg-slate-700 border-slate-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Scene Description</Label>
              <Textarea
                value={newScene.description}
                onChange={(e) => setNewScene(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what happens in this scene"
                rows={3}
                className="bg-slate-700 border-slate-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Environment Context</Label>
                <Input
                  value={newScene.environmentContext}
                  onChange={(e) => setNewScene(prev => ({ ...prev, environmentContext: e.target.value }))}
                  placeholder="Setting, time, circumstances"
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Transition Type</Label>
                <Select
                  value={newScene.transitionType}
                  onValueChange={(value) => setNewScene(prev => ({ ...prev, transitionType: value }))}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {transitionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-slate-400">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={addScene}
              disabled={!newScene.title.trim()}
              className="w-full bg-cyan-500 hover:bg-cyan-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Scene
            </Button>
          </div>
        </Card>
      </div>

      {/* Conversation Starters */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Play className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-medium">Conversation Starters</h3>
        </div>
        <p className="text-sm text-slate-400">
          Provide opening dialogue options or prompts to help users begin the scenario.
        </p>

        {/* Existing Starters */}
        {data.conversationStarters && data.conversationStarters.length > 0 && (
          <div className="space-y-2">
            {data.conversationStarters.map((starter: string, index: number) => (
              <Card key={index} className="p-3 bg-slate-700 border-slate-600">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-200 flex-1 pr-4">"{starter}"</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeConversationStarter(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add New Conversation Starter */}
        <Card className="p-4 bg-slate-800 border-slate-600">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Conversation Starter</Label>
              <Textarea
                value={newStarter}
                onChange={(e) => setNewStarter(e.target.value)}
                placeholder="Enter an opening line or prompt to help users start the conversation..."
                rows={3}
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <Button
              onClick={addConversationStarter}
              disabled={!newStarter.trim()}
              variant="outline"
              className="w-full border-violet-500 text-violet-400 hover:bg-violet-500/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Conversation Starter
            </Button>
          </div>
        </Card>
      </div>

      {/* Narrative Tips */}
      <Card className="p-4 bg-slate-800 border-slate-600">
        <h4 className="font-medium text-cyan-400 mb-2">Narrative Structure Tips</h4>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• Create 2-5 scenes for most scenarios</li>
          <li>• Use different transition types to control pacing</li>
          <li>• Provide multiple conversation starters for different user types</li>
          <li>• Include environmental context to help AI characters respond appropriately</li>
          <li>• Consider how scenes connect to your objectives</li>
        </ul>
      </Card>
    </div>
  );
};

export default NarrativeStructure;
