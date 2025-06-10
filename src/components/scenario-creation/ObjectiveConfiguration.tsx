import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Target, Eye, EyeOff } from 'lucide-react';

interface ObjectiveConfigurationProps {
  data: any;
  onChange: (data: any) => void;
}

const ObjectiveConfiguration: React.FC<ObjectiveConfigurationProps> = ({ data, onChange }) => {
  const [newPrimaryObjective, setNewPrimaryObjective] = useState({
    title: '',
    description: '',
    successCriteria: '',
    points: 100
  });

  const [newSecondaryObjective, setNewSecondaryObjective] = useState({
    title: '',
    description: '',
    points: 50
  });

  const [newHiddenObjective, setNewHiddenObjective] = useState({
    title: '',
    description: '',
    triggerCondition: ''
  });

  const addPrimaryObjective = () => {
    if (!newPrimaryObjective.title.trim()) return;

    const objective = {
      ...newPrimaryObjective,
      id: Date.now().toString()
    };

    onChange({
      primaryObjectives: [...(data.primaryObjectives || []), objective]
    });

    setNewPrimaryObjective({
      title: '',
      description: '',
      successCriteria: '',
      points: 100
    });
  };

  const addSecondaryObjective = () => {
    if (!newSecondaryObjective.title.trim()) return;

    const objective = {
      ...newSecondaryObjective,
      id: Date.now().toString()
    };

    onChange({
      secondaryObjectives: [...(data.secondaryObjectives || []), objective]
    });

    setNewSecondaryObjective({
      title: '',
      description: '',
      points: 50
    });
  };

  const addHiddenObjective = () => {
    if (!newHiddenObjective.title.trim()) return;

    const objective = {
      ...newHiddenObjective,
      id: Date.now().toString()
    };

    onChange({
      hiddenObjectives: [...(data.hiddenObjectives || []), objective]
    });

    setNewHiddenObjective({
      title: '',
      description: '',
      triggerCondition: ''
    });
  };

  const removeObjective = (type: string, id: string) => {
    onChange({
      [type]: (data[type] || []).filter((obj: any) => obj.id !== id)
    });
  };

  return (
    <div className="space-y-8">
      {/* Primary Objectives */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-medium">Primary Objectives</h3>
          <Badge variant="secondary">Required for completion</Badge>
        </div>
        <p className="text-sm text-slate-400">
          Define the main goals users must achieve to successfully complete the scenario.
        </p>

        {/* Existing Primary Objectives */}
        {data.primaryObjectives && data.primaryObjectives.length > 0 && (
          <div className="space-y-3">
            {data.primaryObjectives.map((objective: any) => (
              <Card key={objective.id} className="p-4 bg-slate-700 border-slate-600">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-white">{objective.title}</h4>
                      <Badge variant="outline" className="text-amber-400 border-amber-400">
                        {objective.points} pts
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{objective.description}</p>
                    <p className="text-xs text-cyan-400">
                      Success Criteria: {objective.successCriteria}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeObjective('primaryObjectives', objective.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add New Primary Objective */}
        <Card className="p-4 bg-slate-800 border-slate-600">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Objective Title *</Label>
                <Input
                  value={newPrimaryObjective.title}
                  onChange={(e) => setNewPrimaryObjective(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Resolve the crisis situation"
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label>Points</Label>
                <Input
                  type="number"
                  value={newPrimaryObjective.points}
                  onChange={(e) => setNewPrimaryObjective(prev => ({ ...prev, points: parseInt(e.target.value) || 100 }))}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newPrimaryObjective.description}
                onChange={(e) => setNewPrimaryObjective(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what the user needs to accomplish"
                rows={3}
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label>Success Criteria</Label>
              <Input
                value={newPrimaryObjective.successCriteria}
                onChange={(e) => setNewPrimaryObjective(prev => ({ ...prev, successCriteria: e.target.value }))}
                placeholder="How will success be measured?"
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <Button
              onClick={addPrimaryObjective}
              disabled={!newPrimaryObjective.title.trim()}
              className="w-full bg-cyan-500 hover:bg-cyan-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Primary Objective
            </Button>
          </div>
        </Card>
      </div>

      {/* Secondary Objectives */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-violet-400" />
          <h3 className="text-lg font-medium">Secondary Objectives</h3>
          <Badge variant="secondary">Optional bonus goals</Badge>
        </div>
        <p className="text-sm text-slate-400">
          Optional objectives that enhance the experience and provide additional challenges.
        </p>

        {/* Existing Secondary Objectives */}
        {data.secondaryObjectives && data.secondaryObjectives.length > 0 && (
          <div className="space-y-3">
            {data.secondaryObjectives.map((objective: any) => (
              <Card key={objective.id} className="p-4 bg-slate-700 border-slate-600">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-white">{objective.title}</h4>
                      <Badge variant="outline" className="text-violet-400 border-violet-400">
                        {objective.points} pts
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300">{objective.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeObjective('secondaryObjectives', objective.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add New Secondary Objective */}
        <Card className="p-4 bg-slate-800 border-slate-600">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Objective Title</Label>
                <Input
                  value={newSecondaryObjective.title}
                  onChange={(e) => setNewSecondaryObjective(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Maintain team morale"
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label>Points</Label>
                <Input
                  type="number"
                  value={newSecondaryObjective.points}
                  onChange={(e) => setNewSecondaryObjective(prev => ({ ...prev, points: parseInt(e.target.value) || 50 }))}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newSecondaryObjective.description}
                onChange={(e) => setNewSecondaryObjective(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this bonus objective"
                rows={2}
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <Button
              onClick={addSecondaryObjective}
              disabled={!newSecondaryObjective.title.trim()}
              variant="outline"
              className="w-full border-violet-500 text-violet-400 hover:bg-violet-500/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Secondary Objective
            </Button>
          </div>
        </Card>
      </div>

      {/* Hidden Objectives */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <EyeOff className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-medium">Hidden Objectives</h3>
          <Badge variant="secondary">Discovery challenges</Badge>
        </div>
        <p className="text-sm text-slate-400">
          Secret objectives that users can discover through exploration and experimentation.
        </p>

        {/* Existing Hidden Objectives */}
        {data.hiddenObjectives && data.hiddenObjectives.length > 0 && (
          <div className="space-y-3">
            {data.hiddenObjectives.map((objective: any) => (
              <Card key={objective.id} className="p-4 bg-slate-700 border-slate-600 border-dashed">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-white mb-2">{objective.title}</h4>
                    <p className="text-sm text-slate-300 mb-2">{objective.description}</p>
                    <p className="text-xs text-amber-400">
                      Trigger: {objective.triggerCondition}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeObjective('hiddenObjectives', objective.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add New Hidden Objective */}
        <Card className="p-4 bg-slate-800 border-slate-600 border-dashed">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Objective Title</Label>
              <Input
                value={newHiddenObjective.title}
                onChange={(e) => setNewHiddenObjective(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Uncover the hidden agenda"
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newHiddenObjective.description}
                onChange={(e) => setNewHiddenObjective(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What must the user discover or achieve?"
                rows={2}
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <Label>Trigger Condition</Label>
              <Input
                value={newHiddenObjective.triggerCondition}
                onChange={(e) => setNewHiddenObjective(prev => ({ ...prev, triggerCondition: e.target.value }))}
                placeholder="When does this objective become available?"
                className="bg-slate-700 border-slate-600"
              />
            </div>
            <Button
              onClick={addHiddenObjective}
              disabled={!newHiddenObjective.title.trim()}
              variant="outline"
              className="w-full border-amber-500 text-amber-400 hover:bg-amber-500/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Hidden Objective
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ObjectiveConfiguration;
