import { useState, useEffect, useCallback } from 'react';
import { Character, CharacterStats, CharacterFilters } from '@/types/character';
import { characterService } from '@/services/characterService';
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
}

export const useMyCharacters = (): UseMyCharactersReturn => {
  const { toast } = useToast();
  
  const [characters, setCharacters] = useState<Character[]>([]);
  const [characterStats, setCharacterStats] = useState<CharacterStats>({
    totalCharacters: 0,
    activeCharacters: 0,
    mostUsedCharacter: '',
    averageRating: 0
  });
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

  // Fetch characters data from Supabase
  const fetchCharacters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch characters and stats simultaneously
      const [charactersResult, statsResult] = await Promise.all([
        characterService.getUserCharacters(filters, pagination.page, pagination.limit),
        characterService.getCharacterStats()
      ]);

      setCharacters(charactersResult.characters);
      setPagination(prev => ({
        ...prev,
        total: charactersResult.total
      }));
      setCharacterStats(statsResult);
    } catch (err) {
      console.error('Error fetching characters:', err);
      setError('Failed to load characters. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

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
      
      await characterService.deleteCharacter(characterId);
      
      toast({
        title: "Character Deleted",
        description: "The character has been successfully removed.",
      });
      
      // Refresh the list
      await fetchCharacters();
    } catch (error) {
      console.error('Error deleting character:', error);
      toast({
        title: "Delete Failed",
        description: "Unable to delete the character. Please try again.",
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
  };
};
