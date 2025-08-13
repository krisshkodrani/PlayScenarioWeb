
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScenarioData } from '@/types/scenario';
import MergedSettings from './MergedSettings';
import SimplifiedObjectives from './SimplifiedObjectives';
import AICharactersTab from './AICharactersTab';
import PlayerCharacterTab from './PlayerCharacterTab';

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
    { id: 'settings', label: 'Settings', component: MergedSettings },
    { id: 'objectives', label: 'Objectives', component: SimplifiedObjectives },
    { id: 'ai-characters', label: 'AI Characters', component: AICharactersTab },
    { id: 'player-character', label: 'Player Character', component: PlayerCharacterTab }
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid grid-cols-4 bg-slate-800 p-1">
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
