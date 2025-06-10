
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X, Plus } from 'lucide-react';

interface ExpertiseData {
  domains: string[];
  depth: Record<string, 'basic' | 'professional' | 'expert'>;
  background: string;
}

interface ExpertiseAndKnowledgeProps {
  data: ExpertiseData;
  onChange: (data: Partial<ExpertiseData>) => void;
}

const expertiseDomains = {
  'Technology': ['Software Development', 'Cybersecurity', 'AI/Machine Learning', 'Hardware Engineering', 'Data Science'],
  'Healthcare': ['Medicine', 'Nursing', 'Psychology', 'Therapy', 'Public Health'],
  'Business': ['Management', 'Finance', 'Marketing', 'Sales', 'Entrepreneurship'],
  'Education': ['Teaching', 'Research', 'Academia', 'Training & Development'],
  'Creative Arts': ['Writing', 'Visual Arts', 'Music', 'Theater', 'Film'],
  'Law Enforcement': ['Police Work', 'Investigation', 'Security', 'Legal Studies'],
  'Military': ['Strategy', 'Tactics', 'Leadership', 'Intelligence'],
  'Politics': ['Government', 'Diplomacy', 'Public Policy', 'International Relations'],
  'Science': ['Physics', 'Chemistry', 'Biology', 'Environmental Science'],
  'Social Services': ['Social Work', 'Community Organizing', 'Non-profit Management']
};

const ExpertiseAndKnowledge: React.FC<ExpertiseAndKnowledgeProps> = ({ data, onChange }) => {
  const [customDomain, setCustomDomain] = useState('');

  const handleDomainToggle = (domain: string) => {
    const currentDomains = data.domains || [];
    const newDomains = currentDomains.includes(domain)
      ? currentDomains.filter(d => d !== domain)
      : [...currentDomains, domain];
    
    // Remove depth setting if domain is removed
    const newDepth = { ...data.depth };
    if (!newDomains.includes(domain)) {
      delete newDepth[domain];
    }
    
    onChange({ domains: newDomains, depth: newDepth });
  };

  const handleDepthChange = (domain: string, depth: 'basic' | 'professional' | 'expert') => {
    onChange({
      depth: { ...data.depth, [domain]: depth }
    });
  };

  const handleAddCustomDomain = () => {
    if (customDomain.trim() && !data.domains.includes(customDomain.trim())) {
      onChange({
        domains: [...data.domains, customDomain.trim()]
      });
      setCustomDomain('');
    }
  };

  const handleBackgroundChange = (background: string) => {
    onChange({ background });
  };

  return (
    <div className="space-y-6">
      {/* Domain Selection */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Expertise Domains</Label>
          <p className="text-sm text-muted-foreground mt-1">
            Select areas where your character has knowledge or experience
          </p>
        </div>

        {Object.entries(expertiseDomains).map(([category, domains]) => (
          <div key={category} className="space-y-2">
            <h4 className="text-sm font-medium text-primary">{category}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {domains.map((domain) => (
                <Button
                  key={domain}
                  variant={data.domains.includes(domain) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDomainToggle(domain)}
                  className="justify-start text-xs h-8"
                >
                  {domain}
                </Button>
              ))}
            </div>
          </div>
        ))}

        {/* Custom Domain Input */}
        <div className="flex gap-2">
          <Input
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="Add custom expertise domain..."
            className="bg-input"
            onKeyPress={(e) => e.key === 'Enter' && handleAddCustomDomain()}
          />
          <Button onClick={handleAddCustomDomain} variant="outline" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Selected Domains */}
        {data.domains.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm">Selected Domains:</Label>
            <div className="flex flex-wrap gap-2">
              {data.domains.map((domain) => (
                <Badge key={domain} variant="secondary" className="flex items-center gap-1">
                  {domain}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => handleDomainToggle(domain)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Knowledge Depth */}
      {data.domains.length > 0 && (
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Knowledge Depth</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Specify the level of expertise for each selected domain
            </p>
          </div>

          {data.domains.map((domain) => (
            <div key={domain} className="space-y-2 p-4 border rounded-md">
              <Label className="font-medium">{domain}</Label>
              <RadioGroup
                value={data.depth[domain] || 'basic'}
                onValueChange={(value) => handleDepthChange(domain, value as 'basic' | 'professional' | 'expert')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="basic" id={`${domain}-basic`} />
                  <Label htmlFor={`${domain}-basic`} className="text-sm">
                    Basic <span className="text-muted-foreground">(Familiar)</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professional" id={`${domain}-professional`} />
                  <Label htmlFor={`${domain}-professional`} className="text-sm">
                    Professional <span className="text-muted-foreground">(Competent)</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expert" id={`${domain}-expert`} />
                  <Label htmlFor={`${domain}-expert`} className="text-sm">
                    Expert <span className="text-muted-foreground">(Master)</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>
      )}

      {/* Experience Background */}
      <div className="space-y-3">
        <Label htmlFor="background">Experience Background</Label>
        <Textarea
          id="background"
          value={data.background || ''}
          onChange={(e) => handleBackgroundChange(e.target.value)}
          placeholder="Describe your character's educational background, professional experience, significant life events, and specialized training..."
          rows={6}
          className="bg-input"
        />
        <p className="text-xs text-muted-foreground">
          Provide context for how your character gained their expertise and knowledge
        </p>
      </div>
    </div>
  );
};

export default ExpertiseAndKnowledge;
