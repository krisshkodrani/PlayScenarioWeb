
import { useState, useEffect, useCallback } from 'react';
import { Character, CharacterStats, CharacterFilters } from '@/types/character';
import { MOCK_CHARACTERS, MOCK_CHARACTER_STATS } from '@/data/mockCharacters';
import { useToast } from '@/hooks/use-toast';

interface UseMyCharactersReturn {
  characters: Character[];
  characterStats: CharacterStats;
  loading: boolean;
  error: string | null;
  filters: CharacterFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  handleFilterChange: (newFilters: Partial<CharacterFilters>) => void;
  handlePageChange: (page: number) => void;
  handleDelete: (characterId: string) => Promise<void>;
  handleDuplicate: (characterId: string) => Promise<void>;
}

export const useMyCharacters = (): UseMyCharactersReturn => {
  const { toast } = useToast();
  
  const [characters, setCharacters] = useState<Character[]>([]);
  const [characterStats, setCharacterStats] = useState<CharacterStats>(MOCK_CHARACTER_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<CharacterFilters>({
    search: '',
    role: '',
    expertise: '',
    sortBy: 'created'
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0
  });

  // Filter and sort characters
  const getFilteredCharacters = useCallback((chars: Character[], currentFilters: CharacterFilters) => {
    let filtered = [...chars];

    // Search filter
    if (currentFilters.search) {
      const searchLower = currentFilters.search.toLowerCase();
      filtered = filtered.filter(char => 
        char.name.toLowerCase().includes(searchLower) ||
        char.role.toLowerCase().includes(searchLower) ||
        char.personality.toLowerCase().includes(searchLower) ||
        char.expertise_keywords.some(keyword => keyword.toLowerCase().includes(searchLower))
      );
    }

    // Role filter
    if (currentFilters.role) {
      filtered = filtered.filter(char => char.role.includes(currentFilters.role));
    }

    // Expertise filter
    if (currentFilters.expertise) {
      filtered = filtered.filter(char => 
        char.expertise_keywords.some(keyword => keyword.includes(currentFilters.expertise))
      );
    }

    // Sort
    switch (currentFilters.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'created':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'usage':
        filtered.sort((a, b) => b.scenario_count - a.scenario_count);
        break;
      case 'rating':
        filtered.sort((a, b) => b.average_rating - a.average_rating);
        break;
      default:
        break;
    }

    return filtered;
  }, []);

  // Fetch characters data
  const fetchCharacters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Apply filters to mock data
      const filteredChars = getFilteredCharacters(MOCK_CHARACTERS, filters);
      
      // Apply pagination
      const startIndex = (pagination.page - 1) * pagination.limit;
      const endIndex = startIndex + pagination.limit;
      const paginatedChars = filteredChars.slice(startIndex, endIndex);

      setCharacters(paginatedChars);
      setPagination(prev => ({
        ...prev,
        total: filteredChars.length
      }));
      
      setCharacterStats(MOCK_CHARACTER_STATS);
    } catch (err) {
      console.error('Error fetching characters:', err);
      setError('Failed to load characters. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit, getFilteredCharacters]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<CharacterFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  // Handle character deletion
  const handleDelete = useCallback(async (characterId: string) => {
    try {
      console.log('Deleting character:', characterId);
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Character Deleted",
        description: "The character has been successfully removed.",
      });
      
      // Refresh the list
      fetchCharacters();
    } catch (error) {
      console.error('Error deleting character:', error);
      toast({
        title: "Delete Failed",
        description: "Unable to delete the character. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast, fetchCharacters]);

  // Handle character duplication
  const handleDuplicate = useCallback(async (characterId: string) => {
    try {
      console.log('Duplicating character:', characterId);
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Character Duplicated",
        description: "A copy of the character has been created.",
      });
      
      // Refresh the list
      fetchCharacters();
    } catch (error) {
      console.error('Error duplicating character:', error);
      toast({
        title: "Duplication Failed",
        description: "Unable to duplicate the character. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast, fetchCharacters]);

  // Initial data fetch
  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  return {
    characters,
    characterStats,
    loading,
    error,
    filters,
    pagination,
    handleFilterChange,
    handlePageChange,
    handleDelete,
    handleDuplicate,
  };
};
