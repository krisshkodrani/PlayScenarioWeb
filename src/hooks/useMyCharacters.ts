import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Character, CharacterStats, CharacterFilters } from '@/types/character';
import { characterService } from '@/services/characterService';
import { useToast } from '@/hooks/use-toast';

interface UseMyCharactersReturn {
  characters: Character[];
  characterStats: CharacterStats;
  loading: boolean;
  isFiltering: boolean;
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

interface UseMyCharactersOptions {
  preventUrlUpdates?: boolean;
}

export const useMyCharacters = (options: UseMyCharactersOptions = {}): UseMyCharactersReturn => {
  const { preventUrlUpdates = false } = options;
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [isFiltering, setIsFiltering] = useState(false);
  const isFirstLoadRef = useRef(true);
  
  const [filters, setFilters] = useState<CharacterFilters>({
    search: preventUrlUpdates ? '' : (searchParams.get('search') || ''),
    role: preventUrlUpdates ? '' : (searchParams.get('role') || ''),
    expertise: preventUrlUpdates ? '' : (searchParams.get('expertise') || ''),
    sortBy: preventUrlUpdates ? 'created' : ((searchParams.get('sortBy') as CharacterFilters['sortBy']) || 'created')
  });
  
  // Debounced search term for fetching
  const [debouncedSearch, setDebouncedSearch] = useState<string>(filters.search);
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 400);
    return () => clearTimeout(t);
  }, [filters.search]);

  const [pagination, setPagination] = useState({
    page: preventUrlUpdates ? 1 : parseInt(searchParams.get('page') || '1'),
    limit: 12,
    total: 0
  });

  // Stable fetch function that doesn't recreate on filter changes
  const fetchCharacters = useCallback(async (currentFilters: CharacterFilters, currentPage: number, currentLimit: number) => {
    try {
      if (isFirstLoadRef.current) {
        setLoading(true);
      } else {
        setIsFiltering(true);
      }
      setError(null);

      const shouldFetchStats = isFirstLoadRef.current;

      // Fetch characters and stats simultaneously (stats only on first load)
      const [charactersResult, statsResult] = await Promise.all([
        characterService.getUserCharacters(currentFilters, currentPage, currentLimit),
        shouldFetchStats ? characterService.getCharacterStats() : Promise.resolve(null)
      ]);

      setCharacters(charactersResult.characters);
      setPagination(prev => ({
        ...prev,
        total: charactersResult.total
      }));
      if (statsResult) setCharacterStats(statsResult);
    } catch (err) {
      console.error('Error fetching characters:', err);
      setError('Failed to load characters. Please try again.');
    } finally {
      if (isFirstLoadRef.current) {
        setLoading(false);
        isFirstLoadRef.current = false;
      } else {
        setIsFiltering(false);
      }
    }
  }, []); // No dependencies - stable function

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
      await fetchCharacters(filters, pagination.page, pagination.limit);
    } catch (error) {
      console.error('Error deleting character:', error);
      toast({
        title: "Delete Failed",
        description: "Unable to delete the character. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast, fetchCharacters, filters, pagination.page, pagination.limit]);

  // Debounced URL update (only when not in modal mode)
  useEffect(() => {
    if (preventUrlUpdates) return;

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      
      // Update character-specific parameters while preserving others
      if (filters.search) {
        params.set('search', filters.search);
      } else {
        params.delete('search');
      }
      
      if (filters.role) {
        params.set('role', filters.role);
      } else {
        params.delete('role');
      }
      
      if (filters.expertise) {
        params.set('expertise', filters.expertise);
      } else {
        params.delete('expertise');
      }
      
      if (filters.sortBy !== 'created') {
        params.set('sortBy', filters.sortBy);
      } else {
        params.delete('sortBy');
      }
      
      if (pagination.page !== 1) {
        params.set('page', pagination.page.toString());
      } else {
        params.delete('page');
      }
      
      // Only update URL if the params actually changed
      const currentParams = searchParams.toString();
      const newParams = params.toString();
      
      if (currentParams !== newParams) {
        setSearchParams(params, { replace: true });
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [preventUrlUpdates, filters.search, filters.role, filters.expertise, filters.sortBy, pagination.page, searchParams, setSearchParams]);

  // Fetch characters when filters or pagination change
  useEffect(() => {
    fetchCharacters(filters, pagination.page, pagination.limit);
  }, [fetchCharacters, filters.search, filters.role, filters.expertise, filters.sortBy, pagination.page, pagination.limit]);

  return {
    characters,
    characterStats,
    loading,
    isFiltering,
    error,
    filters,
    pagination,
    handleFilterChange,
    handlePageChange,
    handleDelete,
  };
};
