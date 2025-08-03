
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Users, X } from 'lucide-react';
import { useMyCharacters } from '@/hooks/useMyCharacters';
import { Character } from '@/types/character';
import { CharacterData } from '@/types/scenario';
import SelectableCharacterCard from './SelectableCharacterCard';

interface CharacterBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacters: (characters: CharacterData[]) => void;
  excludeCharacterIds?: string[];
}

const CharacterBrowserModal: React.FC<CharacterBrowserModalProps> = ({
  isOpen,
  onClose,
  onSelectCharacters,
  excludeCharacterIds = []
}) => {
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const {
    characters,
    loading,
    error,
    filters,
    handleFilterChange
  } = useMyCharacters();

  // Update filters when search or role filter changes
  useEffect(() => {
    handleFilterChange({
      search: searchTerm,
      role: roleFilter === 'all' ? '' : roleFilter,
      sortBy: 'created'
    });
  }, [searchTerm, roleFilter, handleFilterChange]);

  // Filter out characters that are already in the scenario
  const availableCharacters = characters.filter(
    character => !excludeCharacterIds.includes(character.id)
  );

  const handleSelectionChange = (characterId: string, selected: boolean) => {
    setSelectedCharacterIds(prev => 
      selected 
        ? [...prev, characterId]
        : prev.filter(id => id !== characterId)
    );
  };

  const handleSelectAll = () => {
    const allIds = availableCharacters.map(char => char.id);
    setSelectedCharacterIds(allIds);
  };

  const handleClearSelection = () => {
    setSelectedCharacterIds([]);
  };

  const handleAddSelected = () => {
    const selectedCharacters = availableCharacters.filter(char => 
      selectedCharacterIds.includes(char.id)
    );

    // Convert Character format to CharacterData format
    const characterData: CharacterData[] = selectedCharacters.map(char => ({
      id: char.id, // Preserve the character ID for existing characters
      name: char.name,
      personality: char.personality,
      expertise_keywords: char.expertise_keywords,
      is_player_character: false // Default to AI character for scenarios
    }));

    onSelectCharacters(characterData);
    setSelectedCharacterIds([]);
    onClose();
  };

  const handleClose = () => {
    setSelectedCharacterIds([]);
    setSearchTerm('');
    setRoleFilter('all');
    onClose();
  };

  const uniqueRoles = Array.from(new Set(characters.map(char => char.role))).filter(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[80vh] bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            Browse My Characters
          </DialogTitle>
          <p className="text-slate-400 text-sm">
            Select existing characters to add to your scenario
          </p>
        </DialogHeader>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search characters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600 text-white"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-48 bg-slate-800 border-slate-600 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {uniqueRoles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selection Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
              {selectedCharacterIds.length} selected
            </Badge>
            {availableCharacters.length > 0 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  Select All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  className="text-slate-400 hover:text-slate-300"
                  disabled={selectedCharacterIds.length === 0}
                >
                  Clear
                </Button>
              </>
            )}
          </div>
          <Badge variant="outline" className="text-slate-400 border-slate-600">
            {availableCharacters.length} available
          </Badge>
        </div>

        {/* Character Grid */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400">{error}</p>
            </div>
          ) : availableCharacters.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">
                {excludeCharacterIds.length > 0 
                  ? "All your characters are already in this scenario"
                  : "No characters found matching your criteria"
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCharacters.map(character => (
                <SelectableCharacterCard
                  key={character.id}
                  character={character}
                  isSelected={selectedCharacterIds.includes(character.id)}
                  onSelectionChange={handleSelectionChange}
                />
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-slate-600 text-slate-300 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddSelected}
            disabled={selectedCharacterIds.length === 0}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            Add {selectedCharacterIds.length} Character{selectedCharacterIds.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterBrowserModal;
