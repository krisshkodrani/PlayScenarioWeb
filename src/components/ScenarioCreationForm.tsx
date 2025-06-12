
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ScenarioData } from '@/types/scenario';
import ScenarioProgressHeader from './scenario-creation/ScenarioProgressHeader';
import ScenarioFormTabs from './scenario-creation/ScenarioFormTabs';
import ScenarioSidebar from './scenario-creation/ScenarioSidebar';
import CreationTips from './scenario-creation/CreationTips';

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
        <ScenarioProgressHeader progress={progress} isComplete={isComplete} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <ScenarioFormTabs
              scenarioData={scenarioData}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onDataChange={updateScenarioData}
            />
          </div>

          <div className="space-y-6">
            <ScenarioSidebar
              scenarioData={scenarioData}
              isComplete={isComplete}
              isLoading={isLoading}
              onSave={handleSave}
              onPublish={handlePublish}
            />
            <CreationTips />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioCreationForm;
