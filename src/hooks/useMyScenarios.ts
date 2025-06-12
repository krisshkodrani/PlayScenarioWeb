
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Scenario } from '@/types/scenario';
import { FilterState, ScenarioStats, PaginationState } from '@/types/my-scenarios';

// Mock data - replace with actual API calls
const mockScenarios: Scenario[] = [
  {
    id: '1',
    title: 'Cyberpunk Corporate Espionage',
    description: 'Navigate the dark underbelly of corporate warfare in a dystopian future.',
    category: 'cyberpunk',
    difficulty: 'Advanced',
    estimated_duration: 45,
    character_count: 4,
    characters: [],
    objectives: [],
    created_at: '2024-01-15T10:30:00Z',
    created_by: 'Current User',
    play_count: 245,
    average_rating: 4.7,
    tags: ['cyberpunk', 'corporate', 'espionage'],
    is_liked: false,
    is_bookmarked: false
  },
  {
    id: '2',
    title: 'Medieval Kingdom Diplomacy',
    description: 'Forge alliances and navigate court intrigue in a medieval fantasy setting.',
    category: 'fantasy',
    difficulty: 'Intermediate',
    estimated_duration: 30,
    character_count: 3,
    characters: [],
    objectives: [],
    created_at: '2024-01-10T14:20:00Z',
    created_by: 'Current User',
    play_count: 156,
    average_rating: 4.3,
    tags: ['medieval', 'diplomacy', 'fantasy'],
    is_liked: true,
    is_bookmarked: true
  }
];

const mockStats: ScenarioStats = {
  totalScenarios: 8,
  publishedScenarios: 6,
  draftScenarios: 2,
  totalPlays: 1247,
  totalLikes: 89,
  averageRating: 4.5
};

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

  // Simulate API calls with mock data
  const fetchScenarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Filter mock scenarios based on current filters
      let filteredScenarios = [...mockScenarios];
      
      if (filters.search) {
        filteredScenarios = filteredScenarios.filter(scenario =>
          scenario.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          scenario.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      // Set mock data
      setScenarios(filteredScenarios);
      setPagination(prev => ({ ...prev, total: filteredScenarios.length }));
      setScenarioStats(mockStats);
    } catch (err) {
      setError('Failed to load scenarios. Please try again.');
      console.error('Scenario fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

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
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setScenarios(prev => prev.filter(s => s.id !== scenarioId));
      toast({
        title: "Scenario Deleted",
        description: "The scenario has been permanently deleted.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete scenario. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async (scenarioId: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const originalScenario = scenarios.find(s => s.id === scenarioId);
      if (originalScenario) {
        const duplicatedScenario = {
          ...originalScenario,
          id: Date.now().toString(),
          title: `${originalScenario.title} (Copy)`,
          created_at: new Date().toISOString(),
          play_count: 0,
          average_rating: 0
        };
        
        setScenarios(prev => [duplicatedScenario, ...prev]);
        toast({
          title: "Scenario Duplicated",
          description: "A copy of the scenario has been created.",
        });
      }
    } catch (error) {
      toast({
        title: "Duplication Failed",
        description: "Failed to duplicate scenario. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublic = async (scenarioId: string, makePublic: boolean) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
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
