import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface Relationship {
  type: string;
  description: string;
  intensity: number;
}

interface RelationshipDynamicsProps {
  data: Relationship[];
  onChange: (data: Relationship[]) => void;
}

const relationshipTypes = [
  { value: 'family', label: 'Family Member' },
  { value: 'friend', label: 'Friend' },
  { value: 'colleague', label: 'Professional Colleague' },
  { value: 'mentor', label: 'Mentor/Student' },
  { value: 'romantic', label: 'Romantic Partner' },
  { value: 'rival', label: 'Rival/Competitor' },
  { value: 'enemy', label: 'Enemy/Adversary' },
  { value: 'authority', label: 'Authority Figure' },
  { value: 'subordinate', label: 'Subordinate' },
  { value: 'ally', label: 'Strategic Ally' },
  { value: 'acquaintance', label: 'Acquaintance' },
  { value: 'stranger', label: 'Stranger' }
];

const RelationshipDynamics: React.FC<RelationshipDynamicsProps> = ({ data, onChange }) => {
  const [newRelationship, setNewRelationship] = useState<Relationship>({
    type: '',
    description: '',
    intensity: 5
  });

  const handleAddRelationship = () => {
    if (newRelationship.type && newRelationship.description) {
      onChange([...data, newRelationship]);
      setNewRelationship({ type: '', description: '', intensity: 5 });
    }
  };

  const handleRemoveRelationship = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  const handleUpdateRelationship = (index: number, field: keyof Relationship, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Relationship Definitions</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Define relationships your character has with other characters in scenarios
        </p>
      </div>

      {/* Existing Relationships */}
      {data.length > 0 && (
        <div className="space-y-4">
          <Label className="text-sm">Current Relationships:</Label>
          {data.map((relationship, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      value={relationship.type}
                      onValueChange={(value) => handleUpdateRelationship(index, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship type" />
                      </SelectTrigger>
                      <SelectContent>
                        {relationshipTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Intensity:</Label>
                      <div className="flex-1">
                        <Slider
                          value={[relationship.intensity]}
                          onValueChange={(value) => handleUpdateRelationship(index, 'intensity', value[0])}
                          min={1}
                          max={10}
                          step={1}
                          className="flex-1"
                        />
                      </div>
                      <span className="text-sm font-mono w-8">{relationship.intensity}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveRelationship(index)}
                    className="ml-4"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <Textarea
                  value={relationship.description}
                  onChange={(e) => handleUpdateRelationship(index, 'description', e.target.value)}
                  placeholder="Describe the nature of this relationship, history, and dynamics..."
                  rows={3}
                  className="bg-input"
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Relationship */}
      <Card className="p-4 border-dashed">
        <div className="space-y-4">
          <Label className="text-sm font-medium">Add New Relationship</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={newRelationship.type}
              onValueChange={(value) => setNewRelationship(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship type" />
              </SelectTrigger>
              <SelectContent>
                {relationshipTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Label className="text-sm">Intensity:</Label>
              <div className="flex-1">
                <Slider
                  value={[newRelationship.intensity]}
                  onValueChange={(value) => setNewRelationship(prev => ({ ...prev, intensity: value[0] }))}
                  min={1}
                  max={10}
                  step={1}
                  className="flex-1"
                />
              </div>
              <span className="text-sm font-mono w-8">{newRelationship.intensity}</span>
            </div>
          </div>

          <Textarea
            value={newRelationship.description}
            onChange={(e) => setNewRelationship(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the nature of this relationship, history, and dynamics..."
            rows={3}
            className="bg-input"
          />

          <Button
            onClick={handleAddRelationship}
            disabled={!newRelationship.type || !newRelationship.description}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Relationship
          </Button>
        </div>
      </Card>

      <div className="text-xs text-muted-foreground">
        <p><strong>Intensity Scale:</strong> 1-3 = Weak connection, 4-6 = Moderate connection, 7-10 = Strong connection</p>
      </div>
    </div>
  );
};

export default RelationshipDynamics;
