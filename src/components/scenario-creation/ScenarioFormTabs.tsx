
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScenarioData } from '@/types/scenario';
import SimplifiedBasicInfo from './SimplifiedBasicInfo';
import SimplifiedObjectives from './SimplifiedObjectives';
import SimplifiedCharacters from './SimplifiedCharacters';
import SimplifiedSettings from './SimplifiedSettings';

interface ScenarioFormTabsProps {
  scenarioData: ScenarioData;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onDataChange: (updates: Partial<ScenarioData>) => void;
}

const ScenarioFormTabs: React.FC<ScenarioFormTabsProps> = ({
  scenarioData,
  activeTab,
  onTabChange,
  onDataChange
}) => {
  const tabs = [
    { id: 'basic', label: 'Basic Info', component: SimplifiedBasicInfo },
    { id: 'objectives', label: 'Objectives', component: SimplifiedObjectives },
    { id: 'characters', label: 'Characters', component: SimplifiedCharacters },
    { id: 'settings', label: 'Settings', component: SimplifiedSettings }
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
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
            <Component data={scenarioData} onChange={onDataChange} />
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default ScenarioFormTabs;
