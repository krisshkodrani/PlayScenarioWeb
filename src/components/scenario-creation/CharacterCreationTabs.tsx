
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, User, Users, Library } from 'lucide-react';
import { CharacterData } from '@/types/scenario';
import InlineCharacterForm from './InlineCharacterForm';

interface CharacterCreationTabsProps {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  formData: CharacterData;
  setFormData: React.Dispatch<React.SetStateAction<CharacterData>>;
  newKeyword: string;
  setNewKeyword: React.Dispatch<React.SetStateAction<string>>;
  editingIndex: number | null;
  onSaveCharacter: () => void;
  onResetForm: () => void;
  onAddKeyword: () => void;
  onRemoveKeyword: (index: number) => void;
  onShowCharacterBrowser: () => void;
}

const CharacterCreationTabs: React.FC<CharacterCreationTabsProps> = ({
  showForm,
  setShowForm,
  formData,
  setFormData,
  newKeyword,
  setNewKeyword,
  editingIndex,
  onSaveCharacter,
  onResetForm,
  onAddKeyword,
  onRemoveKeyword,
  onShowCharacterBrowser
}) => {
  return (
    <Tabs defaultValue="create" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-slate-700">
        <TabsTrigger value="create" className="data-[state=active]:bg-slate-600">
          <Plus className="w-4 h-4 mr-2" />
          Create New
        </TabsTrigger>
        <TabsTrigger value="browse" className="data-[state=active]:bg-slate-600">
          <Library className="w-4 h-4 mr-2" />
          Browse Library
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="create" className="space-y-4 mt-6">
        {!showForm && (
          <div className="text-center py-6 border-2 border-dashed border-slate-600 rounded-lg">
            <User className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-400 mb-3">Quickly create a new character for this scenario</p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Character
            </Button>
          </div>
        )}

        {showForm && (
          <InlineCharacterForm
            formData={formData}
            setFormData={setFormData}
            newKeyword={newKeyword}
            setNewKeyword={setNewKeyword}
            editingIndex={editingIndex}
            onSave={onSaveCharacter}
            onCancel={onResetForm}
            onAddKeyword={onAddKeyword}
            onRemoveKeyword={onRemoveKeyword}
          />
        )}
      </TabsContent>

      <TabsContent value="browse" className="space-y-4 mt-6">
        <div className="text-center py-6 border-2 border-dashed border-slate-600 rounded-lg">
          <Users className="w-8 h-8 text-slate-500 mx-auto mb-2" />
          <p className="text-slate-400 mb-3">Browse and select from your existing characters</p>
          <Button
            onClick={onShowCharacterBrowser}
            className="bg-violet-500 hover:bg-violet-600 text-white"
          >
            <Library className="w-4 h-4 mr-2" />
            Browse My Characters
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default CharacterCreationTabs;
