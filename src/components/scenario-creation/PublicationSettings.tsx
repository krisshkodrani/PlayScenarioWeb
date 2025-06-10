
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Globe, Lock, Users, Eye } from 'lucide-react';

interface PublicationSettingsProps {
  data: any;
  onChange: (data: any) => void;
}

const visibilityOptions = [
  { 
    value: 'private', 
    label: 'Private', 
    description: 'Only you can access this scenario',
    icon: Lock 
  },
  { 
    value: 'unlisted', 
    label: 'Unlisted', 
    description: 'Accessible via direct link only',
    icon: Eye 
  },
  { 
    value: 'public', 
    label: 'Public', 
    description: 'Visible in scenario library',
    icon: Globe 
  },
  { 
    value: 'beta', 
    label: 'Beta Testing', 
    description: 'Limited access for feedback',
    icon: Users 
  }
];

const targetAudiences = [
  'Business professionals',
  'Students',
  'Educators',
  'Healthcare workers',
  'Emergency responders',
  'Team leaders',
  'General public',
  'Researchers'
];

const licenseOptions = [
  { 
    value: 'standard', 
    label: 'Standard License', 
    description: 'Standard platform terms apply' 
  },
  { 
    value: 'creative-commons', 
    label: 'Creative Commons', 
    description: 'Open for modification and sharing' 
  },
  { 
    value: 'educational', 
    label: 'Educational Use Only', 
    description: 'Restricted to educational contexts' 
  },
  { 
    value: 'commercial', 
    label: 'Commercial License', 
    description: 'Available for commercial use' 
  }
];

const PublicationSettings: React.FC<PublicationSettingsProps> = ({ data, onChange }) => {
  const [newBetaTester, setNewBetaTester] = React.useState('');

  const handleVisibilityChange = (visibility: string) => {
    onChange({ visibility });
  };

  const handleAudienceToggle = (audience: string) => {
    const currentAudiences = data.targetAudience || [];
    const newAudiences = currentAudiences.includes(audience)
      ? currentAudiences.filter((a: string) => a !== audience)
      : [...currentAudiences, audience];
    onChange({ targetAudience: newAudiences });
  };

  const addBetaTester = () => {
    if (!newBetaTester.trim()) return;
    
    onChange({
      betaTesters: [...(data.betaTesters || []), newBetaTester.trim()]
    });
    setNewBetaTester('');
  };

  const removeBetaTester = (email: string) => {
    onChange({
      betaTesters: (data.betaTesters || []).filter((tester: string) => tester !== email)
    });
  };

  return (
    <div className="space-y-6">
      {/* Visibility Settings */}
      <Card className="p-4 bg-slate-800 border-slate-600">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Visibility & Access</h3>
            <p className="text-sm text-slate-400">
              Control who can discover and access your scenario
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibilityOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={option.value}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    data.visibility === option.value
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() => handleVisibilityChange(option.value)}
                >
                  <div className="flex items-start gap-3">
                    <IconComponent className={`w-5 h-5 mt-0.5 ${
                      data.visibility === option.value ? 'text-cyan-400' : 'text-slate-400'
                    }`} />
                    <div>
                      <h4 className="font-medium text-white mb-1">{option.label}</h4>
                      <p className="text-sm text-slate-400">{option.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Target Audience */}
      <Card className="p-4 bg-slate-800 border-slate-600">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Target Audience</h3>
            <p className="text-sm text-slate-400">
              Select the primary audiences for your scenario
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {targetAudiences.map((audience) => (
              <div key={audience} className="flex items-center space-x-2">
                <Checkbox
                  id={audience}
                  checked={(data.targetAudience || []).includes(audience)}
                  onCheckedChange={() => handleAudienceToggle(audience)}
                />
                <Label
                  htmlFor={audience}
                  className="text-sm font-normal cursor-pointer"
                >
                  {audience}
                </Label>
              </div>
            ))}
          </div>

          {data.targetAudience && data.targetAudience.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {data.targetAudience.map((audience: string) => (
                <Badge key={audience} variant="secondary">
                  {audience}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* License Settings */}
      <Card className="p-4 bg-slate-800 border-slate-600">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">License & Usage Rights</h3>
            <p className="text-sm text-slate-400">
              Define how others can use your scenario
            </p>
          </div>

          <div className="space-y-2">
            <Label>License Type</Label>
            <Select
              value={data.license || 'standard'}
              onValueChange={(value) => onChange({ license: value })}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {licenseOptions.map((license) => (
                  <SelectItem key={license.value} value={license.value}>
                    <div>
                      <div className="font-medium">{license.label}</div>
                      <div className="text-xs text-slate-400">{license.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Beta Testing */}
      {data.visibility === 'beta' && (
        <Card className="p-4 bg-slate-800 border-slate-600">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Beta Testing</h3>
              <p className="text-sm text-slate-400">
                Invite specific users to test your scenario before public release
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newBetaTester}
                  onChange={(e) => setNewBetaTester(e.target.value)}
                  placeholder="Enter email address"
                  className="bg-slate-700 border-slate-600"
                  onKeyPress={(e) => e.key === 'Enter' && addBetaTester()}
                />
                <Button
                  onClick={addBetaTester}
                  disabled={!newBetaTester.trim()}
                  variant="outline"
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                >
                  Add Tester
                </Button>
              </div>

              {data.betaTesters && data.betaTesters.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm">Beta Testers:</Label>
                  <div className="space-y-2">
                    {data.betaTesters.map((email: string, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-700 rounded">
                        <span className="text-sm text-slate-200">{email}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBetaTester(email)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Release Notes */}
      <Card className="p-4 bg-slate-800 border-slate-600">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Release Information</h3>
            <p className="text-sm text-slate-400">
              Additional information for users about this scenario
            </p>
          </div>

          <div className="space-y-2">
            <Label>Release Notes (Optional)</Label>
            <Textarea
              value={data.releaseNotes || ''}
              onChange={(e) => onChange({ releaseNotes: e.target.value })}
              placeholder="Describe what's new, special features, or important information for users..."
              rows={4}
              className="bg-slate-700 border-slate-600"
            />
          </div>
        </div>
      </Card>

      {/* Publication Status Summary */}
      <Card className="p-4 bg-slate-700 border-slate-600">
        <div className="space-y-3">
          <h4 className="font-medium text-cyan-400">Publication Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Visibility: </span>
              <Badge variant="outline" className="ml-2">
                {visibilityOptions.find(opt => opt.value === data.visibility)?.label || 'Private'}
              </Badge>
            </div>
            <div>
              <span className="text-slate-400">License: </span>
              <span className="text-slate-200">
                {licenseOptions.find(opt => opt.value === data.license)?.label || 'Standard License'}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Target Audiences: </span>
              <span className="text-cyan-400">
                {(data.targetAudience || []).length || 0} selected
              </span>
            </div>
            {data.visibility === 'beta' && (
              <div>
                <span className="text-slate-400">Beta Testers: </span>
                <span className="text-violet-400">
                  {(data.betaTesters || []).length} invited
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PublicationSettings;
