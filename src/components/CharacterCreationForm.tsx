
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Save, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import BasicCharacterInfo from './character-creation/BasicCharacterInfo';
import PersonalityFramework from './character-creation/PersonalityFramework';
import ExpertiseAndKnowledge from './character-creation/ExpertiseAndKnowledge';
import CommunicationPatterns from './character-creation/CommunicationPatterns';
import RelationshipDynamics from './character-creation/RelationshipDynamics';
import GoalsAndMotivations from './character-creation/GoalsAndMotivations';
import ContextualModifiers from './character-creation/ContextualModifiers';
import CharacterPreview from './character-creation/CharacterPreview';

interface CharacterData {
  name: string;
  displayName: string;
  role: string[];
  avatar: string;
  personality: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
    description: string;
    traits: string[];
  };
  expertise: {
    domains: string[];
    depth: Record<string, 'basic' | 'professional' | 'expert'>;
    background: string;
  };
  communication: {
    vocabularyLevel: string;
    formality: string;
    emotionalRange: string;
    conflictStyle: string;
  };
  relationships: Array<{
    type: string;
    description: string;
    intensity: number;
  }>;
  goals: {
    primary: string[];
    hidden: string[];
    moralFramework: string;
  };
  modifiers: {
    stressResponse: string;
    authorityInteraction: string;
    culturalBackground: string;
  };
}

const CharacterCreationForm = () => {
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
      traits: [],
    },
    expertise: {
      domains: [],
      depth: {},
      background: '',
    },
    communication: {
      vocabularyLevel: 'intermediate',
      formality: 'balanced',
      emotionalRange: 'moderate',
      conflictStyle: 'collaborative',
    },
    relationships: [],
    goals: {
      primary: [],
      hidden: [],
      moralFramework: '',
    },
    modifiers: {
      stressResponse: 'moderate',
      authorityInteraction: 'respectful',
      culturalBackground: '',
    },
  });

  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const calculateProgress = () => {
    const required = [
      characterData.name,
      characterData.role.length > 0,
      characterData.personality.description,
      characterData.expertise.domains.length > 0,
      characterData.goals.primary.length > 0,
    ];
    return (required.filter(Boolean).length / required.length) * 100;
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    setLastSaved(new Date());
    console.log('Character saved:', characterData);
  };

  const updateCharacterData = (section: string, data: any) => {
    setCharacterData(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof CharacterData], ...data }
    }));
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link to="/browse" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Character Creation</h1>
                <p className="text-muted-foreground">Define your AI character's personality and behavior</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide Preview' : 'Preview'}
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completion Progress</span>
              <span className="text-primary">{Math.round(calculateProgress())}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
          </div>

          {lastSaved && (
            <p className="text-xs text-muted-foreground mt-2">
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Main Content */}
        <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
          <div className={showPreview ? 'lg:col-span-2' : 'lg:col-span-1'}>
            <div className="space-y-6">
              {/* Basic Character Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Basic Character Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <BasicCharacterInfo
                    data={characterData}
                    onChange={(data) => updateCharacterData('basic', data)}
                  />
                </CardContent>
              </Card>

              {/* Personality Framework */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Personality Framework</CardTitle>
                </CardHeader>
                <CardContent>
                  <PersonalityFramework
                    data={characterData.personality}
                    onChange={(data) => updateCharacterData('personality', data)}
                  />
                </CardContent>
              </Card>

              {/* Expertise and Knowledge */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Expertise & Knowledge Domain</CardTitle>
                </CardHeader>
                <CardContent>
                  <ExpertiseAndKnowledge
                    data={characterData.expertise}
                    onChange={(data) => updateCharacterData('expertise', data)}
                  />
                </CardContent>
              </Card>

              {/* Communication Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Communication & Interaction Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <CommunicationPatterns
                    data={characterData.communication}
                    onChange={(data) => updateCharacterData('communication', data)}
                  />
                </CardContent>
              </Card>

              {/* Relationship Dynamics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Relationship & Social Dynamics</CardTitle>
                </CardHeader>
                <CardContent>
                  <RelationshipDynamics
                    data={characterData.relationships}
                    onChange={(data) => updateCharacterData('relationships', data)}
                  />
                </CardContent>
              </Card>

              {/* Goals and Motivations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Goals & Motivations Framework</CardTitle>
                </CardHeader>
                <CardContent>
                  <GoalsAndMotivations
                    data={characterData.goals}
                    onChange={(data) => updateCharacterData('goals', data)}
                  />
                </CardContent>
              </Card>

              {/* Contextual Modifiers */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Contextual Behavior Modifiers</CardTitle>
                </CardHeader>
                <CardContent>
                  <ContextualModifiers
                    data={characterData.modifiers}
                    onChange={(data) => updateCharacterData('modifiers', data)}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <CharacterPreview data={characterData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterCreationForm;
