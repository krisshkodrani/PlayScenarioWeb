
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Plus, X, Eye, EyeOff } from 'lucide-react';

interface GoalsData {
  primary: string[];
  hidden: string[];
  moralFramework: string;
}

interface GoalsAndMotivationsProps {
  data: GoalsData;
  onChange: (data: Partial<GoalsData>) => void;
}

const GoalsAndMotivations: React.FC<GoalsAndMotivationsProps> = ({ data, onChange }) => {
  const [newPrimaryGoal, setNewPrimaryGoal] = useState('');
  const [newHiddenGoal, setNewHiddenGoal] = useState('');

  const handleAddGoal = (type: 'primary' | 'hidden', goal: string) => {
    if (goal.trim()) {
      const currentGoals = data[type] || [];
      onChange({
        [type]: [...currentGoals, goal.trim()]
      });
      
      if (type === 'primary') {
        setNewPrimaryGoal('');
      } else {
        setNewHiddenGoal('');
      }
    }
  };

  const handleRemoveGoal = (type: 'primary' | 'hidden', index: number) => {
    const currentGoals = data[type] || [];
    onChange({
      [type]: currentGoals.filter((_, i) => i !== index)
    });
  };

  const handleMoralFrameworkChange = (moralFramework: string) => {
    onChange({ moralFramework });
  };

  return (
    <div className="space-y-6">
      {/* Primary Goals */}
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Primary Goals (Visible)
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Explicit objectives that users and other characters can see
            </p>
          </div>

          {data.primary && data.primary.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm">Current Primary Goals:</Label>
              <div className="space-y-2">
                {data.primary.map((goal, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span className="text-sm flex-1">{goal}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveGoal('primary', index)}
                      className="ml-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={newPrimaryGoal}
              onChange={(e) => setNewPrimaryGoal(e.target.value)}
              placeholder="Add a primary goal..."
              className="bg-input"
              onKeyPress={(e) => e.key === 'Enter' && handleAddGoal('primary', newPrimaryGoal)}
            />
            <Button
              onClick={() => handleAddGoal('primary', newPrimaryGoal)}
              disabled={!newPrimaryGoal.trim()}
              variant="outline"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Hidden Motivations */}
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium flex items-center gap-2">
              <EyeOff className="w-4 h-4" />
              Hidden Motivations (AI Only)
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Secret motivations that influence behavior but remain hidden from users
            </p>
          </div>

          {data.hidden && data.hidden.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm">Current Hidden Motivations:</Label>
              <div className="space-y-2">
                {data.hidden.map((motivation, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md border border-dashed">
                    <span className="text-sm flex-1 italic">{motivation}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveGoal('hidden', index)}
                      className="ml-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={newHiddenGoal}
              onChange={(e) => setNewHiddenGoal(e.target.value)}
              placeholder="Add a hidden motivation..."
              className="bg-input"
              onKeyPress={(e) => e.key === 'Enter' && handleAddGoal('hidden', newHiddenGoal)}
            />
            <Button
              onClick={() => handleAddGoal('hidden', newHiddenGoal)}
              disabled={!newHiddenGoal.trim()}
              variant="outline"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Moral Framework */}
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Moral Framework</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Define your character's ethical principles, values, and moral boundaries
            </p>
          </div>

          <Textarea
            value={data.moralFramework || ''}
            onChange={(e) => handleMoralFrameworkChange(e.target.value)}
            placeholder="Describe your character's ethical principles, value hierarchy, moral flexibility, and lines they won't cross..."
            rows={6}
            className="bg-input"
          />

          <div className="text-xs text-muted-foreground">
            <p><strong>Examples:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Utilitarian: Greatest good for greatest number</li>
              <li>Deontological: Duty-based, rules are absolute</li>
              <li>Virtue Ethics: Character-based, what would a virtuous person do?</li>
              <li>Pragmatic: Situational, adapts to circumstances</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GoalsAndMotivations;
