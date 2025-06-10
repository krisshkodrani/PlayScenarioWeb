
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Plus } from 'lucide-react';

interface BasicCharacterInfoProps {
  data: any;
  onChange: (data: any) => void;
}

const roleTemplates = [
  { id: 'protagonist', name: 'Protagonist', description: 'Main character driving the story' },
  { id: 'antagonist', name: 'Antagonist', description: 'Opposition to the main character' },
  { id: 'mentor', name: 'Mentor', description: 'Wise guide providing advice' },
  { id: 'ally', name: 'Ally', description: 'Supportive companion character' },
  { id: 'neutral', name: 'Neutral Party', description: 'Unbiased observer or mediator' },
  { id: 'authority', name: 'Authority Figure', description: 'Character with institutional power' },
];

const avatarOptions = [
  '/placeholder.svg?height=64&width=64&text=A1',
  '/placeholder.svg?height=64&width=64&text=A2',
  '/placeholder.svg?height=64&width=64&text=A3',
  '/placeholder.svg?height=64&width=64&text=A4',
  '/placeholder.svg?height=64&width=64&text=A5',
  '/placeholder.svg?height=64&width=64&text=A6',
];

const BasicCharacterInfo: React.FC<BasicCharacterInfoProps> = ({ data, onChange }) => {
  const handleNameChange = (field: 'name' | 'displayName', value: string) => {
    onChange({ [field]: value });
  };

  const handleRoleToggle = (roleId: string) => {
    const currentRoles = data.role || [];
    const newRoles = currentRoles.includes(roleId)
      ? currentRoles.filter((r: string) => r !== roleId)
      : [...currentRoles, roleId];
    onChange({ role: newRoles });
  };

  const handleAvatarSelect = (avatarUrl: string) => {
    onChange({ avatar: avatarUrl });
  };

  return (
    <div className="space-y-6">
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="character-name">Character Name *</Label>
          <Input
            id="character-name"
            value={data.name || ''}
            onChange={(e) => handleNameChange('name', e.target.value)}
            placeholder="Enter character name"
            maxLength={50}
            className="bg-input"
          />
          <p className="text-xs text-muted-foreground">
            {(data.name || '').length}/50 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="display-name">Display Name</Label>
          <Input
            id="display-name"
            value={data.displayName || ''}
            onChange={(e) => handleNameChange('displayName', e.target.value)}
            placeholder="Display name (optional)"
            maxLength={50}
            className="bg-input"
          />
        </div>
      </div>

      {/* Role Selection */}
      <div className="space-y-3">
        <Label>Character Role(s) *</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {roleTemplates.map((role) => (
            <div
              key={role.id}
              className={`p-3 rounded-md border cursor-pointer transition-colors ${
                (data.role || []).includes(role.id)
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleRoleToggle(role.id)}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm">{role.name}</h4>
                {(data.role || []).includes(role.id) && (
                  <Badge variant="secondary">Selected</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{role.description}</p>
            </div>
          ))}
        </div>
        {(data.role || []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.role.map((roleId: string) => {
              const role = roleTemplates.find(r => r.id === roleId);
              return role ? (
                <Badge key={roleId} variant="outline" className="flex items-center gap-1">
                  {role.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => handleRoleToggle(roleId)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* Avatar Selection */}
      <div className="space-y-3">
        <Label>Character Avatar</Label>
        <div className="grid grid-cols-6 md:grid-cols-8 gap-3">
          {avatarOptions.map((avatarUrl, index) => (
            <div
              key={index}
              className={`cursor-pointer rounded-full border-2 transition-colors ${
                data.avatar === avatarUrl
                  ? 'border-primary'
                  : 'border-transparent hover:border-primary/50'
              }`}
              onClick={() => handleAvatarSelect(avatarUrl)}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={avatarUrl} alt={`Avatar ${index + 1}`} />
                <AvatarFallback>{index + 1}</AvatarFallback>
              </Avatar>
            </div>
          ))}
        </div>
        
        <Button variant="outline" size="sm" className="w-fit">
          <Plus className="w-4 h-4 mr-2" />
          Upload Custom Avatar
        </Button>
      </div>
    </div>
  );
};

export default BasicCharacterInfo;
