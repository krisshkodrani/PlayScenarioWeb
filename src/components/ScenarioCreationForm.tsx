
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useScenarioCreation } from '@/hooks/useScenarioCreation';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/navigation/PageHeader';
import ScenarioProgressHeader from './scenario-creation/ScenarioProgressHeader';
import ScenarioFormTabs from './scenario-creation/ScenarioFormTabs';
import ScenarioSidebar from './scenario-creation/ScenarioSidebar';
import CreationTips from './scenario-creation/CreationTips';
import AIAssistanceModal from './scenario-creation/AIAssistanceModal';
import { ScenarioData } from '@/types/scenario';

const ScenarioCreationForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const [showAIModal, setShowAIModal] = useState(false);
  
  const {
    scenarioData,
    updateScenarioData,
    calculateProgress,
    handleSave,
    handlePublish,
    isLoading
  } = useScenarioCreation();

  const handleUseAI = () => {
    setShowAIModal(true);
  };

  const handleApplyAIChanges = (updates: Partial<ScenarioData>) => {
    updateScenarioData(updates);
    toast({
      title: "AI Enhancement Applied",
      description: "Your scenario has been enhanced with AI-generated content.",
    });
  };

  const progress = calculateProgress();
  const isComplete = progress >= 100;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Create Scenario"
          subtitle="Build an interactive AI-powered scenario"
          showBackButton={true}
        />

        <ScenarioProgressHeader 
          progress={progress} 
          isComplete={isComplete}
          scenarioData={scenarioData}
        />

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
              onSave={() => handleSave(false)}
              onPublish={handlePublish}
              onUseAI={handleUseAI}
            />
            <CreationTips />
          </div>
        </div>
      </div>

      <AIAssistanceModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        scenarioData={scenarioData}
        onApplyChanges={handleApplyAIChanges}
      />
    </div>
  );
};

export default ScenarioCreationForm;
