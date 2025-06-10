
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, X, User } from 'lucide-react';

interface CharacterAssignmentProps {
  data: any;
  onChange: (data: any) => void;
}

// Mock available characters - in a real app, this would come from an API
const availableCharacters = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    role: 'Medical Expert',
    avatar: '/placeholder.svg?height=40&width=40&text=SC',
    description: 'Emergency medicine specialist with crisis management experience'
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    role: 'Business Analyst',
    avatar: '/placeholder.svg?height=40&width=40&text=MJ',
    description: 'Strategic planning expert with corporate background'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    role: 'Mediator',
    avatar: '/placeholder.svg?height=40&width=40&text=ER',
    description: 'Conflict resolution specialist and trained negotiator'
  },
  {
    id: '4',
    name: 'Captain James Wright',
    role: 'Authority Figure',
    avatar: '/placeholder.svg?height=40&width=40&text=JW',
    description: 'Military leadership with emergency response expertise'
  }
];

const introductionTimings = [
  { value: 'immediate', label: 'Immediate', description: 'Available from scenario start' },
  { value: 'trigger-based', label: 'Trigger-Based', description: 'Appears based on user actions' },
  { value: 'progressive', label: 'Progressive', description: 'Revealed as scenario unfolds' }
];

const CharacterAssignment: React.FC<CharacterAssignmentProps> = ({ data, onChange }) => {
  const [selectedCharacterId, setSelectedCharacterId] = useState('');

  const assignedCharacterIds = (data.assignedCharacters || []).map((char: any) => char.characterId);

  const handleAssignCharacter = () => {
    if (!selectedCharacterId) return;

    const character = availableCharacters.find(char => char.id === selectedCharacterId);
    if (!character) return;

    const newAssignment = {
      characterId: character.id,
      characterName: character.name,
      role: character.role,
      introductionTiming: 'immediate',
      priority: (data.assignedCharacters || []).length + 1
    };

    onChange({
      assignedCharacters: [...(data.assignedCharacters || []), newAssignment]
    });

    setSelectedCharacterId('');
  };

  const handleRemoveCharacter = (characterId: string) => {
    onChange({
      assignedCharacters: (data.assignedCharacters || []).filter((char: any) => char.characterId !== characterId)
    });
  };

  const handleUpdateCharacter = (characterId: string, field: string, value: any) => {
    onChange({
      assignedCharacters: (data.assignedCharacters || []).map((char: any) =>
        char.characterId === characterId ? { ...char, [field]: value } : char
      )
    });
  };

  const availableToAssign = availableCharacters.filter(
    char => !assignedCharacterIds.includes(char.id)
  );

  return (
    <div className="space-y-6">
      {/* Character Assignment Interface */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Assign Characters</h3>
          <p className="text-sm text-slate-400 mb-4">
            Select AI characters to participate in your scenario. Each character brings unique perspectives and expertise.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Select value={selectedCharacterId} onValueChange={setSelectedCharacterId}>
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue placeholder="Select a character to assign" />
              </SelectTrigger>
              <SelectContent>
                {availableToAssign.map((character) => (
                  <SelectItem key={character.id} value={character.id}>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={character.avatar} alt={character.name} />
                        <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{character.name}</div>
                        <div className="text-xs text-slate-400">{character.role}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleAssignCharacter}
            disabled={!selectedCharacterId}
            className="bg-cyan-500 hover:bg-cyan-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Assign Character
          </Button>
        </div>
      </div>

      {/* Assigned Characters List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Assigned Characters</h3>
          <Badge variant="secondary">
            {(data.assignedCharacters || []).length} Characters
          </Badge>
        </div>

        {data.assignedCharacters && data.assignedCharacters.length > 0 ? (
          <div className="space-y-4">
            {data.assignedCharacters.map((assignment: any) => {
              const character = availableCharacters.find(char => char.id === assignment.characterId);
              if (!character) return null;

              return (
                <Card key={assignment.characterId} className="p-4 bg-slate-700 border-slate-600">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={character.avatar} alt={character.name} />
                        <AvatarFallback><User className="w-6 h-6" /></AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{character.name}</h4>
                        <p className="text-sm text-cyan-400 mb-2">{character.role}</p>
                        <p className="text-sm text-slate-400">{character.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCharacter(assignment.characterId)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Introduction Timing</Label>
                      <Select
                        value={assignment.introductionTiming}
                        onValueChange={(value) => handleUpdateCharacter(assignment.characterId, 'introductionTiming', value)}
                      >
                        <SelectTrigger className="bg-slate-600 border-slate-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {introductionTimings.map((timing) => (
                            <SelectItem key={timing.value} value={timing.value}>
                              <div>
                                <div className="font-medium">{timing.label}</div>
                                <div className="text-xs text-slate-400">{timing.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Priority Level</Label>
                      <Select
                        value={assignment.priority.toString()}
                        onValueChange={(value) => handleUpdateCharacter(assignment.characterId, 'priority', parseInt(value))}
                      >
                        <SelectTrigger className="bg-slate-600 border-slate-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">High Priority</SelectItem>
                          <SelectItem value="2">Medium Priority</SelectItem>
                          <SelectItem value="3">Low Priority</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 bg-slate-700 border-slate-600 text-center">
            <User className="w-12 h-12 mx-auto text-slate-500 mb-4" />
            <h3 className="text-lg font-medium text-slate-300 mb-2">No Characters Assigned</h3>
            <p className="text-slate-400 mb-4">
              Assign AI characters to bring your scenario to life. Characters provide different perspectives and expertise.
            </p>
            <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10">
              Browse Character Library
            </Button>
          </Card>
        )}
      </div>

      {/* Character Tips */}
      <Card className="p-4 bg-slate-800 border-slate-600">
        <h4 className="font-medium text-cyan-400 mb-2">Character Assignment Tips</h4>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>• Assign 2-4 characters for balanced conversations</li>
          <li>• Mix personality types to create interesting dynamics</li>
          <li>• Consider character expertise relevant to your scenario</li>
          <li>• Use priority levels to control conversation flow</li>
          <li>• Progressive introduction can build narrative tension</li>
        </ul>
      </Card>
    </div>
  );
};

export default CharacterAssignment;
