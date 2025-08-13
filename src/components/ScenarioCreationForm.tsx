
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useScenarioCreation } from '@/hooks/useScenarioCreation';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/navigation/PageHeader';
import ScenarioProgressHeader from './scenario-creation/ScenarioProgressHeader';
import ScenarioFormTabs from './scenario-creation/ScenarioFormTabs';
import ScenarioSidebar from './scenario-creation/ScenarioSidebar';
import AIAssistanceModal from './scenario-creation/AIAssistanceModal';
import { ScenarioData } from '@/types/scenario';

const ScenarioCreationForm: React.FC = () => {
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
    isLoadingScenario,
    isEditMode,
    isDuplicateMode,
    editScenarioId,
    duplicateScenarioId
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

  // Show loading state while fetching scenario data for editing
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

  // Determine page title and subtitle based on mode
  const getPageTitle = () => {
    if (isEditMode) return scenarioData.title || 'Edit Scenario';
    if (isDuplicateMode) return 'Duplicate Scenario';
    return 'Create Scenario';
  };

  const getPageSubtitle = () => {
    if (isEditMode) return 'Modify your existing scenario';
    if (isDuplicateMode) return 'Create a copy of an existing scenario';
    return 'Build an interactive AI-powered scenario';
  };

  const getCustomBreadcrumbs = () => {
    const baseBreadcrumbs = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'My Scenarios', href: '/my-scenarios' }
    ];

    if (isEditMode) {
      baseBreadcrumbs.push({ label: scenarioData.title || 'Edit Scenario', href: '' });
    } else if (isDuplicateMode) {
      baseBreadcrumbs.push({ label: 'Duplicate Scenario', href: '' });
    } else {
      baseBreadcrumbs.push({ label: 'Create Scenario', href: '' });
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
              isEditMode={isEditMode}
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

export default ScenarioCreationForm;
