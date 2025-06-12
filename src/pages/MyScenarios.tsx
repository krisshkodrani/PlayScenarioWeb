
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import MyScenariosHeader from '@/components/my-scenarios/MyScenariosHeader';
import ScenarioStatsCards from '@/components/my-scenarios/ScenarioStatsCards';
import ScenarioFilters from '@/components/my-scenarios/ScenarioFilters';
import ScenarioList from '@/components/my-scenarios/ScenarioList';
import ScenarioPagination from '@/components/my-scenarios/ScenarioPagination';
import EmptyScenarios from '@/components/my-scenarios/EmptyScenarios';
import NoSearchResults from '@/components/my-scenarios/NoSearchResults';
import { Scenario } from '@/types/scenario';

interface FilterState {
  status: 'all' | 'published' | 'draft' | 'private';
  search: string;
  sortBy: 'created_desc' | 'created_asc' | 'title' | 'plays_desc' | 'likes_desc';
}

interface ScenarioStats {
  totalScenarios: number;
  publishedScenarios: number;
  draftScenarios: number;
  totalPlays: number;
  totalLikes: number;
  averageRating: number;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

const MyScenarios: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  // State management
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
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

  // Mock data for development - replace with actual API calls
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

  // Action handlers
  const handleCreateNew = () => {
    navigate('/create-scenario');
  };

  const handleEdit = (scenarioId: string) => {
    navigate(`/create-scenario?edit=${scenarioId}`);
  };

  const handleView = (scenarioId: string) => {
    navigate(`/scenario/${scenarioId}`);
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

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-800 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-800 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-slate-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 px-6 py-2 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const hasScenarios = scenarios.length > 0;
  const hasSearchResults = filters.search ? scenarios.length > 0 : true;

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <MyScenariosHeader
          totalScenarios={scenarioStats.totalScenarios}
          onCreateNew={handleCreateNew}
        />

        <ScenarioStatsCards stats={scenarioStats} />

        {hasScenarios && (
          <>
            <ScenarioFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {hasSearchResults ? (
              <>
                <ScenarioList
                  scenarios={scenarios}
                  viewMode={viewMode}
                  onEdit={handleEdit}
                  onView={handleView}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  onTogglePublic={handleTogglePublic}
                />

                {pagination.total > pagination.limit && (
                  <ScenarioPagination
                    currentPage={pagination.page}
                    totalPages={Math.ceil(pagination.total / pagination.limit)}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <NoSearchResults query={filters.search} />
            )}
          </>
        )}

        {!hasScenarios && !filters.search && (
          <EmptyScenarios onCreateNew={handleCreateNew} />
        )}
      </div>
    </div>
  );
};

export default MyScenarios;
