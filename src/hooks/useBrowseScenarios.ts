
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Scenario } from '@/types/scenario';
import { scenarioService, ScenarioFilters } from '@/services/scenarioService';

export const useBrowseScenarios = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<ScenarioFilters>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    difficulty: (searchParams.get('difficulty') as ScenarioFilters['difficulty']) || '',
    sortBy: (searchParams.get('sortBy') as ScenarioFilters['sortBy']) || 'popularity'
  });

  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get('page') || '1'),
    limit: 12,
    total: 0
  });

  const fetchScenarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await scenarioService.getPublicScenarios(filters, pagination.page, pagination.limit);
      setScenarios(result.scenarios);
      setPagination(prev => ({ ...prev, total: result.total }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scenarios');
      console.error('Browse scenarios error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set('search', filters.search);
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.difficulty) params.set('difficulty', filters.difficulty);
    if (filters.sortBy !== 'popularity') params.set('sortBy', filters.sortBy);
    if (pagination.page !== 1) params.set('page', pagination.page.toString());
    
    setSearchParams(params, { replace: true });
  }, [filters, pagination.page, setSearchParams]);

  // Fetch scenarios when filters change
  useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);

  const handleFilterChange = (newFilters: Partial<ScenarioFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleLike = async (scenarioId: string) => {
    try {
      const scenario = scenarios.find(s => s.id === scenarioId);
      if (!scenario) return;

      const newLikedState = !scenario.is_liked;
      
      // Optimistic update
      setScenarios(prev => prev.map(s => 
        s.id === scenarioId ? { ...s, is_liked: newLikedState } : s
      ));

      await scenarioService.toggleScenarioLike(scenarioId, newLikedState);
      
      toast({
        title: newLikedState ? "Scenario Liked" : "Like Removed",
        description: newLikedState 
          ? "Added to your liked scenarios" 
          : "Removed from your liked scenarios",
      });
    } catch (error) {
      // Revert optimistic update
      setScenarios(prev => prev.map(s => 
        s.id === scenarioId ? { ...s, is_liked: !s.is_liked } : s
      ));
      
      console.error('Like error:', error);
      toast({
        title: "Action Failed",
        description: "Unable to update like status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBookmark = async (scenarioId: string) => {
    try {
      const scenario = scenarios.find(s => s.id === scenarioId);
      if (!scenario) return;

      const newBookmarkedState = !scenario.is_bookmarked;
      
      // Optimistic update
      setScenarios(prev => prev.map(s => 
        s.id === scenarioId ? { ...s, is_bookmarked: newBookmarkedState } : s
      ));

      await scenarioService.toggleScenarioBookmark(scenarioId, newBookmarkedState);
      
      toast({
        title: newBookmarkedState ? "Scenario Bookmarked" : "Bookmark Removed",
        description: newBookmarkedState 
          ? "Added to your bookmarks" 
          : "Removed from your bookmarks",
      });
    } catch (error) {
      // Revert optimistic update
      setScenarios(prev => prev.map(s => 
        s.id === scenarioId ? { ...s, is_bookmarked: !s.is_bookmarked } : s
      ));
      
      console.error('Bookmark error:', error);
      toast({
        title: "Action Failed",
        description: "Unable to update bookmark status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    scenarios,
    loading,
    error,
    filters,
    pagination,
    handleFilterChange,
    handlePageChange,
    handleLike,
    handleBookmark,
  };
};
