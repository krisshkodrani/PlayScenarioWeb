import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/navigation/PageHeader';
import ScenarioProgressHeader from './ScenarioProgressHeader';
import ScenarioFormTabs from './ScenarioFormTabs';
import ScenarioSidebar from './ScenarioSidebar';
import AIAssistanceModal from './AIAssistanceModal';
import { useScenarioEdit } from '@/hooks/useScenarioEdit';
import { ScenarioData } from '@/types/scenario';

interface ScenarioEditFormProps {
  scenarioId: string;
  isDuplicate?: boolean;
}

const ScenarioEditForm: React.FC<ScenarioEditFormProps> = ({ scenarioId, isDuplicate = false }) => {
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
    isLoadingScenario
  } = useScenarioEdit(scenarioId, isDuplicate);

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

  // Show loading state while fetching scenario data
  if (isLoadingScenario) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading scenario...</p>
        </div>
      </div>
    );
  }

  const getPageTitle = () => {
    if (isDuplicate) return 'Duplicate Scenario';
    return scenarioData.title || 'Edit Scenario';
  };

  const getPageSubtitle = () => {
    if (isDuplicate) return 'Create a copy of an existing scenario';
    return 'Modify your interactive AI scenario';
  };

  const getCustomBreadcrumbs = () => {
    const baseBreadcrumbs = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'My Scenarios', href: '/my-scenarios' }
    ];

    if (isDuplicate) {
      baseBreadcrumbs.push({ label: 'Duplicate Scenario', href: '' });
    } else {
      baseBreadcrumbs.push({ label: scenarioData.title || 'Edit Scenario', href: '' });
    }

    return baseBreadcrumbs;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title={getPageTitle()}
          subtitle={getPageSubtitle()}
          showBackButton={true}
          customBreadcrumbs={getCustomBreadcrumbs()}
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
              isEditMode={!isDuplicate}
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

export default ScenarioEditForm;