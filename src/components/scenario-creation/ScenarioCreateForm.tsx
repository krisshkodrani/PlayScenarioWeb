import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/navigation/PageHeader';
import ScenarioProgressHeader from './ScenarioProgressHeader';
import ScenarioFormTabs from './ScenarioFormTabs';
import ScenarioSidebar from './ScenarioSidebar';
import AIAssistanceModal from './AIAssistanceModal';
import { useScenarioCreate } from '@/hooks/useScenarioCreate';
import { ScenarioData } from '@/types/scenario';

const ScenarioCreateForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('settings');
  const [showAIModal, setShowAIModal] = useState(false);
  
  const {
    scenarioData,
    updateScenarioData,
    calculateProgress,
    handleSave,
    handlePublish,
    isLoading,
    resetScenario
  } = useScenarioCreate();

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

  const customBreadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Scenarios', href: '/my-scenarios' },
    { label: 'Create Scenario', href: '' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Create Scenario"
          subtitle="Build an interactive AI-powered scenario"
          showBackButton={true}
          customBreadcrumbs={customBreadcrumbs}
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
              isEditMode={false}
            />
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

export default ScenarioCreateForm;