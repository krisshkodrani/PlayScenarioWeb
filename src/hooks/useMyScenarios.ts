
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Scenario } from '@/types/scenario';
import { FilterState, ScenarioStats, PaginationState } from '@/types/my-scenarios';
import { scenarioService, ScenarioFilters } from '@/services/scenarioService';

export const useMyScenarios = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [scenarioStats, setScenarioStats] = useState<ScenarioStats>({
    totalScenarios: 0,
    publishedScenarios: 0,
    draftScenarios: 0,
    totalPlays: 0,
    totalLikes: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    status: (searchParams.get('status') as FilterState['status']) || 'all',
    search: searchParams.get('search') || '',
    sortBy: (searchParams.get('sortBy') as FilterState['sortBy']) || 'created_desc'
  });

  const [pagination, setPagination] = useState<PaginationState>({
    page: parseInt(searchParams.get('page') || '1'),
    limit: 12,
    total: 0
  });

  const fetchScenarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert FilterState to ScenarioFilters
      const scenarioFilters: ScenarioFilters = {
        search: filters.search,
        category: 'all',
        difficulty: '',
        isPublic: filters.status === 'published' ? true : filters.status === 'private' ? false : undefined,
        sortBy: filters.sortBy
      };

      const [scenariosResult, statsResult] = await Promise.all([
        scenarioService.getUserScenarios(scenarioFilters, pagination.page, pagination.limit),
        scenarioService.getScenarioStats()
      ]);

      setScenarios(scenariosResult.scenarios);
      setPagination(prev => ({ ...prev, total: scenariosResult.total }));
      
      // Map stats format
      setScenarioStats({
        totalScenarios: statsResult.totalScenarios,
        publishedScenarios: statsResult.publicScenarios,
        draftScenarios: statsResult.privateScenarios,
        totalPlays: statsResult.totalPlays,
        totalLikes: statsResult.totalLikes,
        averageRating: statsResult.averageRating
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scenarios');
      console.error('Scenario fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.status !== 'all') params.set('status', filters.status);
    if (filters.search) params.set('search', filters.search);
    if (filters.sortBy !== 'created_desc') params.set('sortBy', filters.sortBy);
    if (pagination.page !== 1) params.set('page', pagination.page.toString());
    
    setSearchParams(params, { replace: true });
  }, [filters, pagination.page, setSearchParams]);

  // Fetch scenarios when filters change
  useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleDelete = async (scenarioId: string) => {
    if (!confirm('Are you sure you want to delete this scenario? This action cannot be undone.')) {
      return;
    }
    
    try {
      await scenarioService.deleteScenario(scenarioId);
      
      setScenarios(prev => prev.filter(s => s.id !== scenarioId));
      toast({
        title: "Scenario Deleted",
        description: "The scenario has been permanently deleted.",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete scenario. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async (scenarioId: string) => {
    try {
      await scenarioService.duplicateScenario(scenarioId);
      
      // Refresh scenarios list
      await fetchScenarios();
      
      toast({
        title: "Scenario Duplicated",
        description: "A copy of the scenario has been created.",
      });
    } catch (error) {
      console.error('Duplicate error:', error);
      toast({
        title: "Duplication Failed",
        description: "Failed to duplicate scenario. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublic = async (scenarioId: string, makePublic: boolean) => {
    try {
      await scenarioService.toggleScenarioPublic(scenarioId, makePublic);
      
      setScenarios(prev => prev.map(s => 
        s.id === scenarioId ? { ...s, is_public: makePublic } : s
      ));
      
      toast({
        title: makePublic ? "Scenario Published" : "Scenario Made Private",
        description: makePublic 
          ? "Your scenario is now visible to the public."
          : "Your scenario has been made private.",
      });
    } catch (error) {
      console.error('Toggle public error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update scenario visibility.",
        variant: "destructive",
      });
    }
  };

  return {
    scenarios,
    scenarioStats,
    loading,
    error,
    filters,
    pagination,
    handleFilterChange,
    handlePageChange,
    handleDelete,
    handleDuplicate,
    handleTogglePublic,
  };
};
