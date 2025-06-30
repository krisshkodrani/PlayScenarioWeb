
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CharacterData, CharacterContext } from '@/types/character';
import SimplifiedBasicInfo from './SimplifiedBasicInfo';
import EnhancedPersonality from './EnhancedPersonality';
import SimplifiedExpertise from './SimplifiedExpertise';

interface CharacterFormTabsProps {
  characterData: CharacterData;
  characterContext: CharacterContext;
  setCharacterData: React.Dispatch<React.SetStateAction<CharacterData>>;
  setCharacterContext: React.Dispatch<React.SetStateAction<CharacterContext>>;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CharacterFormTabs: React.FC<CharacterFormTabsProps> = ({
  characterData,
  characterContext,
  setCharacterData,
  setCharacterContext,
  activeTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'basic', label: 'Basic Info', component: SimplifiedBasicInfo },
    { id: 'personality', label: 'Personality', component: EnhancedPersonality },
    { id: 'expertise', label: 'Expertise', component: SimplifiedExpertise }
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid grid-cols-3 bg-slate-800 p-1">
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
            <Component
              characterData={characterData}
              characterContext={characterContext}
              setCharacterData={setCharacterData}
              setCharacterContext={setCharacterContext}
            />
          </TabsContent>
        );
      })}
    </Tabs>
  );
};

export default CharacterFormTabs;
