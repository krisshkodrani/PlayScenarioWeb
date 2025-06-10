
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';

interface CommunicationData {
  vocabularyLevel: string;
  formality: string;
  emotionalRange: string;
  conflictStyle: string;
}

interface CommunicationPatternsProps {
  data: CommunicationData;
  onChange: (data: Partial<CommunicationData>) => void;
}

const communicationOptions = {
  vocabularyLevel: {
    title: 'Vocabulary Level',
    description: 'Complexity and sophistication of language use',
    options: [
      { value: 'elementary', label: 'Elementary', description: 'Simple, everyday language' },
      { value: 'intermediate', label: 'Intermediate', description: 'Standard vocabulary with some complexity' },
      { value: 'advanced', label: 'Advanced', description: 'Sophisticated, nuanced language' },
      { value: 'academic', label: 'Academic', description: 'Highly technical, scholarly language' }
    ]
  },
  formality: {
    title: 'Communication Formality',
    description: 'Level of formality in speech and interaction',
    options: [
      { value: 'very-casual', label: 'Very Casual', description: 'Relaxed, informal, lots of slang' },
      { value: 'casual', label: 'Casual', description: 'Friendly and approachable' },
      { value: 'balanced', label: 'Balanced', description: 'Adapts to situation appropriately' },
      { value: 'formal', label: 'Formal', description: 'Professional and respectful' },
      { value: 'very-formal', label: 'Very Formal', description: 'Highly structured, ceremonial' }
    ]
  },
  emotionalRange: {
    title: 'Emotional Expression',
    description: 'Range and intensity of emotional expression',
    options: [
      { value: 'minimal', label: 'Minimal', description: 'Reserved, controlled emotional expression' },
      { value: 'moderate', label: 'Moderate', description: 'Balanced emotional responses' },
      { value: 'expressive', label: 'Expressive', description: 'Open, demonstrative emotions' },
      { value: 'intense', label: 'Intense', description: 'Strong, passionate emotional displays' }
    ]
  },
  conflictStyle: {
    title: 'Conflict Resolution Style',
    description: 'Approach to handling disagreements and disputes',
    options: [
      { value: 'avoidant', label: 'Avoidant', description: 'Prefers to avoid confrontation' },
      { value: 'accommodating', label: 'Accommodating', description: 'Yields to others to maintain harmony' },
      { value: 'collaborative', label: 'Collaborative', description: 'Seeks win-win solutions' },
      { value: 'competitive', label: 'Competitive', description: 'Assertive, seeks to win' },
      { value: 'direct', label: 'Direct', description: 'Straightforward, honest confrontation' }
    ]
  }
};

const CommunicationPatterns: React.FC<CommunicationPatternsProps> = ({ data, onChange }) => {
  const handleOptionChange = (category: keyof CommunicationData, value: string) => {
    onChange({ [category]: value });
  };

  return (
    <div className="space-y-6">
      {Object.entries(communicationOptions).map(([category, config]) => (
        <Card key={category} className="p-4">
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">{config.title}</Label>
              <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
            </div>

            <RadioGroup
              value={data[category as keyof CommunicationData]}
              onValueChange={(value) => handleOptionChange(category as keyof CommunicationData, value)}
              className="space-y-3"
            >
              {config.options.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted/50">
                  <RadioGroupItem 
                    value={option.value} 
                    id={`${category}-${option.value}`}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={`${category}-${option.value}`}
                      className="font-medium cursor-pointer"
                    >
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CommunicationPatterns;
