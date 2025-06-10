
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import BasicScenarioInfo from './scenario-creation/BasicScenarioInfo';
import CharacterAssignment from './scenario-creation/CharacterAssignment';
import ObjectiveConfiguration from './scenario-creation/ObjectiveConfiguration';
import NarrativeStructure from './scenario-creation/NarrativeStructure';
import PublicationSettings from './scenario-creation/PublicationSettings';
import ScenarioPreview from './scenario-creation/ScenarioPreview';

interface ScenarioData {
  // Basic Info
  title: string;
  description: string;
  category: string;
  tags: string[];
  difficulty: string;
  estimatedTime: number;
  maturityRating: string;
  
  // Characters
  assignedCharacters: Array<{
    characterId: string;
    characterName: string;
    role: string;
    introductionTiming: string;
    priority: number;
  }>;
  
  // Objectives
  primaryObjectives: Array<{
    id: string;
    title: string;
    description: string;
    successCriteria: string;
    points: number;
  }>;
  secondaryObjectives: Array<{
    id: string;
    title: string;
    description: string;
    points: number;
  }>;
  hiddenObjectives: Array<{
    id: string;
    title: string;
    description: string;
    triggerCondition: string;
  }>;
  
  // Narrative
  scenes: Array<{
    id: string;
    title: string;
    description: string;
    environmentContext: string;
    transitionType: string;
  }>;
  conversationStarters: string[];
  branchingPaths: Array<{
    condition: string;
    outcome: string;
  }>;
  
  // Publication
  visibility: string;
  targetAudience: string[];
  license: string;
  betaTesters: string[];
}

const defaultScenarioData: ScenarioData = {
  title: '',
  description: '',
  category: '',
  tags: [],
  difficulty: 'beginner',
  estimatedTime: 30,
  maturityRating: 'general',
  assignedCharacters: [],
  primaryObjectives: [],
  secondaryObjectives: [],
  hiddenObjectives: [],
  scenes: [],
  conversationStarters: [],
  branchingPaths: [],
  visibility: 'private',
  targetAudience: [],
  license: 'standard',
  betaTesters: []
};

const ScenarioCreationForm: React.FC = () => {
  const [scenarioData, setScenarioData] = useState<ScenarioData>(defaultScenarioData);
  const [activeTab, setActiveTab] = useState('basic');

  const updateScenarioData = (updates: Partial<ScenarioData>) => {
    setScenarioData(prev => ({ ...prev, ...updates }));
  };

  const calculateProgress = () => {
    const requiredFields = [
      scenarioData.title,
      scenarioData.description,
      scenarioData.category,
      scenarioData.assignedCharacters.length > 0,
      scenarioData.primaryObjectives.length > 0,
      scenarioData.scenes.length > 0
    ];
    
    const completedFields = requiredFields.filter(Boolean).length;
    return (completedFields / requiredFields.length) * 100;
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', component: BasicScenarioInfo },
    { id: 'characters', label: 'Characters', component: CharacterAssignment },
    { id: 'objectives', label: 'Objectives', component: ObjectiveConfiguration },
    { id: 'narrative', label: 'Narrative', component: NarrativeStructure },
    { id: 'publication', label: 'Publication', component: PublicationSettings },
    { id: 'preview', label: 'Preview', component: ScenarioPreview }
  ];

  const handleSave = () => {
    console.log('Saving scenario:', scenarioData);
    // TODO: Implement save functionality
  };

  const handlePublish = () => {
    console.log('Publishing scenario:', scenarioData);
    // TODO: Implement publish functionality
  };

  const isReadyToPublish = calculateProgress() >= 100;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Create Scenario</h1>
            <div className="flex items-center gap-2">
              <Badge variant={isReadyToPublish ? "default" : "secondary"} className="bg-cyan-500">
                {isReadyToPublish ? "Ready to Publish" : "In Development"}
              </Badge>
            </div>
          </div>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-400">Creation Progress</span>
                <span className="text-sm text-cyan-400">{Math.round(calculateProgress())}% Complete</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Basic Info</span>
                <span>Characters</span>
                <span>Objectives</span>
                <span>Narrative</span>
                <span>Publication</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 bg-slate-800 p-1">
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
                        <Component data={scenarioData} onChange={updateScenarioData} />
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
                  disabled={!isReadyToPublish}
                >
                  {isReadyToPublish ? 'Publish Scenario' : 'Complete Required Fields'}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-sm text-slate-400">Scenario Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Characters:</span>
                  <span className="text-cyan-400">{scenarioData.assignedCharacters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Primary Objectives:</span>
                  <span className="text-cyan-400">{scenarioData.primaryObjectives.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scenes:</span>
                  <span className="text-cyan-400">{scenarioData.scenes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Est. Duration:</span>
                  <span className="text-cyan-400">{scenarioData.estimatedTime}min</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-sm text-slate-400">Creation Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-300 space-y-2">
                <p>• Start with clear primary objectives</p>
                <p>• Assign character roles that create interesting dynamics</p>
                <p>• Break complex scenarios into multiple scenes</p>
                <p>• Test your scenario before publishing</p>
                <p>• Include branching paths for replayability</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioCreationForm;
