
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
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-6">
      <TabsList className="grid grid-cols-3 bg-slate-800 p-1">
        <TabsTrigger
          value="basic"
          className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white text-xs"
        >
          Basic Info
        </TabsTrigger>
        <TabsTrigger
          value="personality"
          className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white text-xs"
        >
          Personality
        </TabsTrigger>
        <TabsTrigger
          value="expertise"
          className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white text-xs"
        >
          Expertise
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
        <SimplifiedBasicInfo
          characterData={characterData}
          characterContext={characterContext}
          setCharacterData={setCharacterData}
          setCharacterContext={setCharacterContext}
        />
      </TabsContent>

      <TabsContent value="personality">
        <EnhancedPersonality
          characterData={characterData}
          characterContext={characterContext}
          setCharacterData={setCharacterData}
        />
      </TabsContent>

      <TabsContent value="expertise">
        <SimplifiedExpertise
          characterData={characterData}
          setCharacterData={setCharacterData}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CharacterFormTabs;
