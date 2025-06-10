
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

interface ContextualData {
  stressResponse: string;
  authorityInteraction: string;
  culturalBackground: string;
}

interface ContextualModifiersProps {
  data: ContextualData;
  onChange: (data: Partial<ContextualData>) => void;
}

const modifierOptions = {
  stressResponse: {
    title: 'Stress Response Pattern',
    description: 'How the character behaves under pressure and high-stress situations',
    options: [
      { value: 'composed', label: 'Composed', description: 'Remains calm and rational under pressure' },
      { value: 'moderate', label: 'Moderate', description: 'Shows some stress but maintains functionality' },
      { value: 'reactive', label: 'Reactive', description: 'Becomes emotional or agitated under stress' },
      { value: 'shutdown', label: 'Shutdown', description: 'Withdraws or becomes non-responsive' },
      { value: 'aggressive', label: 'Aggressive', description: 'Becomes confrontational or hostile' }
    ]
  },
  authorityInteraction: {
    title: 'Authority Interaction Style',
    description: 'How the character responds to hierarchy and power structures',
    options: [
      { value: 'deferential', label: 'Deferential', description: 'Shows respect and obedience to authority' },
      { value: 'respectful', label: 'Respectful', description: 'Polite but maintains independence' },
      { value: 'skeptical', label: 'Skeptical', description: 'Questions authority and demands justification' },
      { value: 'rebellious', label: 'Rebellious', description: 'Actively challenges or defies authority' },
      { value: 'manipulative', label: 'Manipulative', description: 'Uses authority for personal gain' }
    ]
  }
};

const ContextualModifiers: React.FC<ContextualModifiersProps> = ({ data, onChange }) => {
  const handleOptionChange = (category: 'stressResponse' | 'authorityInteraction', value: string) => {
    onChange({ [category]: value });
  };

  const handleCulturalBackgroundChange = (culturalBackground: string) => {
    onChange({ culturalBackground });
  };

  return (
    <div className="space-y-6">
      {/* Stress Response */}
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">{modifierOptions.stressResponse.title}</Label>
            <p className="text-sm text-muted-foreground mt-1">{modifierOptions.stressResponse.description}</p>
          </div>

          <Select
            value={data.stressResponse}
            onValueChange={(value) => handleOptionChange('stressResponse', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select stress response pattern" />
            </SelectTrigger>
            <SelectContent>
              {modifierOptions.stressResponse.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Authority Interaction */}
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">{modifierOptions.authorityInteraction.title}</Label>
            <p className="text-sm text-muted-foreground mt-1">{modifierOptions.authorityInteraction.description}</p>
          </div>

          <Select
            value={data.authorityInteraction}
            onValueChange={(value) => handleOptionChange('authorityInteraction', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select authority interaction style" />
            </SelectTrigger>
            <SelectContent>
              {modifierOptions.authorityInteraction.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Cultural Background */}
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Cultural Background Integration</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Regional origins, cultural traditions, religious affiliations, and linguistic influences
            </p>
          </div>

          <Textarea
            value={data.culturalBackground || ''}
            onChange={(e) => handleCulturalBackgroundChange(e.target.value)}
            placeholder="Describe your character's cultural background, including regional origins, religious beliefs, cultural traditions, linguistic influences, and how these shape their worldview and communication patterns..."
            rows={6}
            className="bg-input"
          />

          <div className="text-xs text-muted-foreground">
            <p><strong>Consider including:</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Geographic/regional origins and their influence</li>
              <li>Religious or spiritual beliefs and practices</li>
              <li>Cultural traditions and customs that matter to them</li>
              <li>Language background and communication patterns</li>
              <li>Social class and economic background influences</li>
              <li>Generational and historical context</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ContextualModifiers;
