
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Target, Trophy } from 'lucide-react';
import { ScenarioData, ObjectiveData } from '@/types/scenario';

interface SimplifiedObjectivesProps {
  data: ScenarioData;
  onChange: (updates: Partial<ScenarioData>) => void;
}

const SimplifiedObjectives: React.FC<SimplifiedObjectivesProps> = ({ data, onChange }) => {
  const [newObjective, setNewObjective] = useState('');

  const addObjective = () => {
    if (newObjective.trim()) {
      const objective: ObjectiveData = {
        id: Date.now(),
        description: newObjective.trim()
      };
      
      onChange({
        objectives: [...data.objectives, objective]
      });
      setNewObjective('');
    }
  };

  const removeObjective = (id: number) => {
    onChange({
      objectives: data.objectives.filter(obj => obj.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Scenario Objectives
          </CardTitle>
          <p className="text-slate-400 text-sm">
            Define clear objectives that participants should achieve during the scenario
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="new-objective" className="sr-only">Add new objective</Label>
              <Input
                id="new-objective"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Enter an objective for this scenario..."
                className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400"
                onKeyPress={(e) => e.key === 'Enter' && addObjective()}
                maxLength={200}
              />
            </div>
            <Button
              onClick={addObjective}
              disabled={!newObjective.trim()}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {data.objectives.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-medium">Current Objectives</h4>
                <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                  {data.objectives.length} objective{data.objectives.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {data.objectives.map((objective, index) => (
                  <div
                    key={objective.id}
                    className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-cyan-400">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm">{objective.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeObjective(objective.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                      aria-label={`Remove objective ${index + 1}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.objectives.length === 0 && (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No objectives added yet</p>
              <p className="text-slate-500 text-xs">Add objectives to help guide the scenario experience</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Success & Failure Conditions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="win-conditions" className="text-white">Win Conditions</Label>
            <Textarea
              id="win-conditions"
              value={data.win_conditions}
              onChange={(e) => onChange({ win_conditions: e.target.value })}
              placeholder="Define what constitutes success in this scenario..."
              rows={2}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lose-conditions" className="text-white">Lose Conditions</Label>
            <Textarea
              id="lose-conditions"
              value={data.lose_conditions}
              onChange={(e) => onChange({ lose_conditions: e.target.value })}
              placeholder="Define what constitutes failure in this scenario..."
              rows={2}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-sm">💡 Objective Writing Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-slate-400">
            <p>• Be specific and measurable</p>
            <p>• Focus on learning outcomes or skills</p>
            <p>• Keep objectives achievable within the scenario timeframe</p>
            <p>• Consider both individual and team objectives</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimplifiedObjectives;
