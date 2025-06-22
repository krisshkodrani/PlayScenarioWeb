
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useScenarioCreation } from '@/hooks/useScenarioCreation';
import PageHeader from '@/components/navigation/PageHeader';
import ScenarioProgressHeader from './scenario-creation/ScenarioProgressHeader';
import ScenarioFormTabs from './scenario-creation/ScenarioFormTabs';
import ScenarioSidebar from './scenario-creation/ScenarioSidebar';
import CreationTips from './scenario-creation/CreationTips';

const ScenarioCreationForm: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('basic');
  
  const {
    scenarioData,
    updateScenarioData,
    calculateProgress,
    handleSave,
    handlePublish,
    isLoading
  } = useScenarioCreation();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const headerActions = (
    <Button
      variant="outline"
      onClick={handleLogout}
      className="border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );

  const isComplete = calculateProgress() >= 100;
  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Create Scenario"
          subtitle="Build an interactive AI-powered scenario"
          showBackButton={true}
          actions={headerActions}
        />

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
              onSave={() => handleSave(false)}
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
