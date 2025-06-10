
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Save, Eye } from 'lucide-react';
import BasicCharacterInfo from './character-creation/BasicCharacterInfo';
import PersonalityFramework from './character-creation/PersonalityFramework';
import ExpertiseAndKnowledge from './character-creation/ExpertiseAndKnowledge';
import CommunicationPatterns from './character-creation/CommunicationPatterns';
import RelationshipDynamics from './character-creation/RelationshipDynamics';
import GoalsAndMotivations from './character-creation/GoalsAndMotivations';
import ContextualModifiers from './character-creation/ContextualModifiers';
import CharacterPreview from './character-creation/CharacterPreview';

interface CharacterData {
  // Basic Info
  name: string;
  displayName: string;
  role: string[];
  avatar: string;
  
  // Personality
  personality: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
    description: string;
    traits: string[];
  };
  
  // Expertise
  expertise: {
    domains: string[];
    knowledgeDepth: Record<string, string>;
    experience: string;
    education: string;
  };
  
  // Communication
  communication: {
    vocabularyLevel: string;
    formalityLevel: string;
    emotionalExpression: string;
    conflictStyle: string;
  };
  
  // Relationships
  relationships: Array<{
    characterId: string;
    type: string;
    intensity: number;
    description: string;
  }>;
  
  // Goals
  goals: {
    primary: string[];
    secondary: string[];
    hidden: string[];
    motivations: string;
    moralFramework: string;
  };
  
  // Contextual
  contextual: {
    stressResponse: string;
    authorityInteraction: string;
    culturalBackground: string;
    adaptability: number;
  };
}

const sections = [
  { id: 'basic', title: 'Basic Information', component: BasicCharacterInfo },
  { id: 'personality', title: 'Personality Framework', component: PersonalityFramework },
  { id: 'expertise', title: 'Expertise & Knowledge', component: ExpertiseAndKnowledge },
  { id: 'communication', title: 'Communication Patterns', component: CommunicationPatterns },
  { id: 'relationships', title: 'Relationship Dynamics', component: RelationshipDynamics },
  { id: 'goals', title: 'Goals & Motivations', component: GoalsAndMotivations },
  { id: 'contextual', title: 'Contextual Modifiers', component: ContextualModifiers },
];

const CharacterCreationForm = () => {
  const [activeSection, setActiveSection] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);
  const [characterData, setCharacterData] = useState<CharacterData>({
    name: '',
    displayName: '',
    role: [],
    avatar: '',
    personality: {
      openness: 5,
      conscientiousness: 5,
      extraversion: 5,
      agreeableness: 5,
      neuroticism: 5,
      description: '',
      traits: []
    },
    expertise: {
      domains: [],
      knowledgeDepth: {},
      experience: '',
      education: ''
    },
    communication: {
      vocabularyLevel: 'intermediate',
      formalityLevel: 'professional',
      emotionalExpression: 'moderate',
      conflictStyle: 'collaborative'
    },
    relationships: [],
    goals: {
      primary: [],
      secondary: [],
      hidden: [],
      motivations: '',
      moralFramework: ''
    },
    contextual: {
      stressResponse: 'composed',
      authorityInteraction: 'respectful',
      culturalBackground: '',
      adaptability: 5
    }
  });

  const handleDataChange = (sectionId: string, updates: any) => {
    setCharacterData(prev => ({
      ...prev,
      [sectionId]: typeof updates === 'function' ? updates(prev[sectionId]) : { ...prev[sectionId], ...updates }
    }));
  };

  const getCompletionProgress = () => {
    const requiredFields = [
      characterData.name,
      characterData.role.length > 0,
      characterData.personality.description,
      characterData.expertise.domains.length > 0,
      characterData.goals.primary.length > 0
    ];
    
    const completed = requiredFields.filter(Boolean).length;
    return (completed / requiredFields.length) * 100;
  };

  const getSectionCompletionStatus = (sectionId: string) => {
    switch (sectionId) {
      case 'basic':
        return characterData.name && characterData.role.length > 0;
      case 'personality':
        return characterData.personality.description.length > 0;
      case 'expertise':
        return characterData.expertise.domains.length > 0;
      case 'communication':
        return true; // Always has defaults
      case 'relationships':
        return true; // Optional section
      case 'goals':
        return characterData.goals.primary.length > 0;
      case 'contextual':
        return true; // Always has defaults
      default:
        return false;
    }
  };

  const ActiveComponent = sections.find(s => s.id === activeSection)?.component;

  if (showPreview) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setShowPreview(false)}
              className="text-primary"
            >
              ← Back to Editor
            </Button>
            <Button className="glow-primary">
              <Save className="w-4 h-4 mr-2" />
              Save Character
            </Button>
          </div>
          <CharacterPreview data={characterData} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create Character</h1>
              <p className="text-muted-foreground mt-1">
                Design an AI personality for your scenarios
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(true)}
                className="border-primary/30 hover:border-primary"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button className="glow-primary">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Character Development Progress</span>
              <span className="text-primary font-medium">{Math.round(getCompletionProgress())}% Complete</span>
            </div>
            <Progress value={getCompletionProgress()} className="h-2" />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-80 shrink-0">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Character Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary/20 border border-primary/30'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{section.title}</span>
                      <div className="flex items-center space-x-2">
                        {getSectionCompletionStatus(section.id) && (
                          <Badge variant="secondary" className="text-xs">Complete</Badge>
                        )}
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <Card>
              <CardHeader>
                <CardTitle>{sections.find(s => s.id === activeSection)?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {ActiveComponent && (
                  <ActiveComponent
                    data={activeSection === 'basic' ? characterData : characterData[activeSection]}
                    onChange={(updates: any) => handleDataChange(activeSection, updates)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreationForm;
