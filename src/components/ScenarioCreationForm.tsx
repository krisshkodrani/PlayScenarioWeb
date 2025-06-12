
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Save, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScenarioData } from '@/types/scenario';
import SimplifiedBasicInfo from './scenario-creation/SimplifiedBasicInfo';
import SimplifiedObjectives from './scenario-creation/SimplifiedObjectives';
import SimplifiedCharacters from './scenario-creation/SimplifiedCharacters';
import SimplifiedSettings from './scenario-creation/SimplifiedSettings';

const defaultScenarioData: ScenarioData = {
  title: '',
  description: '',
  objectives: [],
  win_conditions: '',
  lose_conditions: '',
  max_turns: 20,
  initial_scene_prompt: '',
  is_public: false,
  characters: []
};

const ScenarioCreationForm: React.FC = () => {
  const [scenarioData, setScenarioData] = useState<ScenarioData>(defaultScenarioData);
  const [activeTab, setActiveTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateScenarioData = (updates: Partial<ScenarioData>) => {
    setScenarioData(prev => ({ ...prev, ...updates }));
  };

  const calculateProgress = () => {
    const requiredFields = [
      scenarioData.title.trim(),
      scenarioData.description.trim(),
      scenarioData.initial_scene_prompt.trim(),
      scenarioData.objectives.length > 0,
      scenarioData.characters.length > 0
    ];
    
    const completedFields = requiredFields.filter(Boolean).length;
    return (completedFields / requiredFields.length) * 100;
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', component: SimplifiedBasicInfo },
    { id: 'objectives', label: 'Objectives', component: SimplifiedObjectives },
    { id: 'characters', label: 'Characters', component: SimplifiedCharacters },
    { id: 'settings', label: 'Settings', component: SimplifiedSettings }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      console.log('Saving scenario:', scenarioData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Scenario Saved",
        description: "Your scenario has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your scenario. Please try again.",
        variant: "destructive",
      });
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (calculateProgress() < 100) {
      toast({
        title: "Incomplete Scenario",
        description: "Please complete all required fields before publishing.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with actual API call when backend is ready
      const publishData = { ...scenarioData, is_public: true };
      console.log('Publishing scenario:', publishData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      setScenarioData(prev => ({ ...prev, is_public: true }));
      
      toast({
        title: "Scenario Published",
        description: "Your scenario is now available in the public library.",
      });
    } catch (error) {
      toast({
        title: "Publish Failed",
        description: "There was an error publishing your scenario. Please try again.",
        variant: "destructive",
      });
      console.error('Publish error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isComplete = calculateProgress() >= 100;
  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Create Scenario</h1>
              <p className="text-slate-400 mt-1">
                Design an interactive AI scenario for training or entertainment
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isComplete ? "default" : "secondary"} className="bg-cyan-500">
                {isComplete ? "Ready to Publish" : "In Development"}
              </Badge>
            </div>
          </div>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-400">Creation Progress</span>
                <span className="text-sm text-cyan-400 font-medium">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Basic Info</span>
                <span>Objectives</span>
                <span>Characters</span>
                <span>Settings</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-2 lg:grid-cols-4 bg-slate-800 p-1">
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
                    <Component data={scenarioData} onChange={updateScenarioData} />
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
                <Button 
                  onClick={handleSave} 
                  variant="outline" 
                  className="w-full border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Draft'}
                </Button>
                <Button 
                  onClick={handlePublish} 
                  className="w-full bg-cyan-500 hover:bg-cyan-600"
                  disabled={!isComplete || isLoading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isLoading ? 'Publishing...' : isComplete ? 'Publish Scenario' : 'Complete Required Fields'}
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
                  <span className="text-cyan-400">{scenarioData.characters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Objectives:</span>
                  <span className="text-cyan-400">{scenarioData.objectives.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Max Turns:</span>
                  <span className="text-cyan-400">{scenarioData.max_turns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Visibility:</span>
                  <span className="text-cyan-400">{scenarioData.is_public ? 'Public' : 'Private'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-sm text-slate-400">Creation Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-300 space-y-2">
                <p>• Start with clear objectives that guide the experience</p>
                <p>• Create characters with distinct personalities and expertise</p>
                <p>• Write an engaging initial scene prompt</p>
                <p>• Define clear win and lose conditions</p>
                <p>• Test your scenario before publishing</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioCreationForm;
