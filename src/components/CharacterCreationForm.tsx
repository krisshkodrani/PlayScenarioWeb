
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  description: string;
  traits: string[];
  
  // Expertise
  primaryExpertise: string[];
  knowledgeDomains: string[];
  experienceLevel: string;
  specializations: string[];
  
  // Communication
  vocabularyLevel: string;
  formality: string;
  emotionalRange: string;
  conflictStyle: string;
  
  // Relationships
  relationships: Array<{
    characterName: string;
    relationshipType: string;
    intensity: number;
    description: string;
  }>;
  socialGroups: string[];
  
  // Goals
  primary: string[];
  hidden: string[];
  moralFramework: string;
  
  // Contextual
  stressResponse: string;
  authorityInteraction: string;
  culturalBackground: string;
}

const defaultCharacterData: CharacterData = {
  name: '',
  displayName: '',
  role: [],
  avatar: '',
  openness: 5,
  conscientiousness: 5,
  extraversion: 5,
  agreeableness: 5,
  neuroticism: 5,
  description: '',
  traits: [],
  primaryExpertise: [],
  knowledgeDomains: [],
  experienceLevel: 'intermediate',
  specializations: [],
  vocabularyLevel: 'intermediate',
  formality: 'balanced',
  emotionalRange: 'moderate',
  conflictStyle: 'collaborative',
  relationships: [],
  socialGroups: [],
  primary: [],
  hidden: [],
  moralFramework: '',
  stressResponse: 'moderate',
  authorityInteraction: 'respectful',
  culturalBackground: ''
};

const CharacterCreationForm: React.FC = () => {
  const [characterData, setCharacterData] = useState<CharacterData>(defaultCharacterData);
  const [activeTab, setActiveTab] = useState('basic');

  const updateCharacterData = (updates: Partial<CharacterData>) => {
    setCharacterData(prev => ({ ...prev, ...updates }));
  };

  const calculateProgress = () => {
    const requiredFields = [
      characterData.name,
      characterData.role.length > 0,
      characterData.description,
      characterData.primaryExpertise.length > 0
    ];
    
    const completedFields = requiredFields.filter(Boolean).length;
    return (completedFields / requiredFields.length) * 100;
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', component: BasicCharacterInfo },
    { id: 'personality', label: 'Personality', component: PersonalityFramework },
    { id: 'expertise', label: 'Expertise', component: ExpertiseAndKnowledge },
    { id: 'communication', label: 'Communication', component: CommunicationPatterns },
    { id: 'relationships', label: 'Relationships', component: RelationshipDynamics },
    { id: 'goals', label: 'Goals', component: GoalsAndMotivations },
    { id: 'contextual', label: 'Contextual', component: ContextualModifiers },
    { id: 'preview', label: 'Preview', component: CharacterPreview }
  ];

  const handleSave = () => {
    console.log('Saving character:', characterData);
    // TODO: Implement save functionality
  };

  const handlePublish = () => {
    console.log('Publishing character:', characterData);
    // TODO: Implement publish functionality
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Create Character</h1>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-400">Creation Progress</span>
                <span className="text-sm text-cyan-400">{Math.round(calculateProgress())}% Complete</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-4 lg:grid-cols-8 bg-slate-800 p-1">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white text-xs"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabs.map((tab) => {
                const Component = tab.component;
                return (
                  <TabsContent key={tab.id} value={tab.id}>
                    <Card className="bg-slate-800 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-cyan-400">{tab.label}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Component data={characterData} onChange={updateCharacterData} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700 sticky top-8">
              <CardHeader>
                <CardTitle className="text-sm text-slate-400">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleSave} variant="outline" className="w-full">
                  Save Draft
                </Button>
                <Button 
                  onClick={handlePublish} 
                  className="w-full bg-cyan-500 hover:bg-cyan-600"
                  disabled={calculateProgress() < 100}
                >
                  Publish Character
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-sm text-slate-400">Creation Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-300 space-y-2">
                <p>• Provide detailed personality descriptions for more realistic AI behavior</p>
                <p>• Define clear expertise areas to ensure accurate responses</p>
                <p>• Set appropriate communication patterns for your scenario context</p>
                <p>• Test your character in the preview before publishing</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreationForm;
