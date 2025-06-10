
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';

interface PersonalityFrameworkProps {
  data: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
    description: string;
    traits: string[];
  };
  onChange: (data: any) => void;
}

const personalityTraits = {
  openness: {
    name: 'Openness to Experience',
    description: 'Curiosity, imagination, and willingness to try new things',
    low: 'Conventional, practical',
    high: 'Creative, curious'
  },
  conscientiousness: {
    name: 'Conscientiousness',
    description: 'Organization, discipline, and attention to detail',
    low: 'Flexible, spontaneous',
    high: 'Organized, disciplined'
  },
  extraversion: {
    name: 'Extraversion',
    description: 'Energy from social interaction and external stimulation',
    low: 'Reserved, introspective',
    high: 'Outgoing, energetic'
  },
  agreeableness: {
    name: 'Agreeableness',
    description: 'Cooperation, trust, and consideration for others',
    low: 'Competitive, skeptical',
    high: 'Cooperative, trusting'
  },
  neuroticism: {
    name: 'Neuroticism',
    description: 'Emotional stability and stress response',
    low: 'Calm, resilient',
    high: 'Anxious, sensitive'
  }
};

const behavioralTendencies = [
  'Optimistic outlook',
  'Pessimistic outlook',
  'Formal communication',
  'Casual communication',
  'Collaborative approach',
  'Competitive approach',
  'Cautious decision-making',
  'Impulsive decision-making',
  'Emotional reasoning',
  'Logical reasoning',
  'Detail-oriented',
  'Big-picture focused',
  'Risk-averse',
  'Risk-taking',
  'Structured routine',
  'Flexible adaptation'
];

const PersonalityFramework: React.FC<PersonalityFrameworkProps> = ({ data, onChange }) => {
  const handleTraitChange = (trait: string, value: number[]) => {
    onChange({ [trait]: value[0] });
  };

  const handleDescriptionChange = (description: string) => {
    onChange({ description });
  };

  const handleBehavioralToggle = (tendency: string) => {
    const currentTraits = data.traits || [];
    const newTraits = currentTraits.includes(tendency)
      ? currentTraits.filter(t => t !== tendency)
      : [...currentTraits, tendency];
    onChange({ traits: newTraits });
  };

  return (
    <div className="space-y-6">
      {/* Big Five Personality Traits */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Big Five Personality Traits</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Adjust the sliders to define your character's core personality dimensions
          </p>
        </div>

        {Object.entries(personalityTraits).map(([key, trait]) => (
          <Card key={key} className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <Label className="text-sm font-medium">{trait.name}</Label>
                  <p className="text-xs text-muted-foreground mt-1">{trait.description}</p>
                </div>
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                  {data[key as keyof typeof data] || 5}
                </span>
              </div>
              
              <div className="space-y-2">
                <Slider
                  value={[data[key as keyof typeof data] || 5]}
                  onValueChange={(value) => handleTraitChange(key, value)}
                  min={1}
                  max={10}
                  step={1}
                  className="flex-1"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{trait.low}</span>
                  <span>{trait.high}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Personality Description */}
      <div className="space-y-3">
        <Label htmlFor="personality-description">Personality Description *</Label>
        <Textarea
          id="personality-description"
          value={data.description || ''}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          placeholder="Describe your character's personality, motivations, fears, quirks, and behavioral tendencies in detail..."
          maxLength={1000}
          rows={6}
          className="bg-input"
        />
        <p className="text-xs text-muted-foreground">
          {(data.description || '').length}/1,000 characters
        </p>
      </div>

      {/* Behavioral Tendencies */}
      <div className="space-y-3">
        <Label>Behavioral Tendencies</Label>
        <p className="text-sm text-muted-foreground">
          Select tendencies that best describe your character's behavior patterns
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {behavioralTendencies.map((tendency) => (
            <div key={tendency} className="flex items-center space-x-2">
              <Checkbox
                id={tendency}
                checked={(data.traits || []).includes(tendency)}
                onCheckedChange={() => handleBehavioralToggle(tendency)}
              />
              <Label
                htmlFor={tendency}
                className="text-sm font-normal cursor-pointer"
              >
                {tendency}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalityFramework;
