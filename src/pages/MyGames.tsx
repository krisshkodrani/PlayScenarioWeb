import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import PageHeader from '@/components/navigation/PageHeader';
import AppBreadcrumb from '@/components/navigation/AppBreadcrumb';
import GameFilters from '@/components/my-games/GameFilters';
import GameInstanceCard from '@/components/my-games/GameInstanceCard';
import EmptyGames from '@/components/my-games/EmptyGames';
import { Loader2 } from 'lucide-react';
import { logger } from '@/lib/logger';
import { toast } from '@/components/ui/use-toast';
interface GameInstance {
  id: string;
  scenario_id: string;
  status: string;
  current_turn: number;
  max_turns: number | null;
  started_at: string;
  ended_at: string | null;
  final_score: number | null;
  scenarios: {
    title: string;
    description: string;
  } | null;
}

interface GameFiltersState {
  status: 'all' | 'playing' | 'completed' | 'won' | 'lost';
  search: string;
  sortBy: 'started_desc' | 'started_asc' | 'title' | 'progress';
}

const MyGames: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [games, setGames] = useState<GameInstance[]>([]);
  const [filteredGames, setFilteredGames] = useState<GameInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<GameFiltersState>({
    status: 'all',
    search: '',
    sortBy: 'started_desc'
  });

  useEffect(() => {
    if (user) {
      fetchGames();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [games, filters]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      logger.debug('API', 'Fetching user games', { userId: user?.id });
      
      const { data, error } = await supabase
        .from('scenario_instances')
        .select(`
          *,
          scenarios:scenario_id(title, description)
        `)
        .eq('user_id', user?.id)
        .order('started_at', { ascending: false });

      if (error) throw error;
      
      logger.info('API', 'Games fetched successfully', { 
        userId: user?.id,
        gameCount: data?.length || 0 
      });
      
      setGames(data || []);
    } catch (error) {
      logger.error('API', 'Failed to fetch games', error, { userId: user?.id });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    logger.debug('UI', 'Applying game filters', { 
      status: filters.status,
      searchTerm: filters.search,
      sortBy: filters.sortBy,
      totalGames: games.length 
    });

    let filtered = [...games];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(game => game.status === filters.status);
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(game =>
        game.scenarios?.title.toLowerCase().includes(searchTerm) ||
        game.scenarios?.description.toLowerCase().includes(searchTerm)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'started_asc':
          return new Date(a.started_at).getTime() - new Date(b.started_at).getTime();
        case 'started_desc':
          return new Date(b.started_at).getTime() - new Date(a.started_at).getTime();
        case 'title':
          return (a.scenarios?.title || '').localeCompare(b.scenarios?.title || '');
        case 'progress':
          const aProgress = a.max_turns ? (a.current_turn / a.max_turns) : 0;
          const bProgress = b.max_turns ? (b.current_turn / b.max_turns) : 0;
          return bProgress - aProgress;
        default:
          return 0;
      }
    });

    logger.debug('UI', 'Filters applied', { 
      filteredCount: filtered.length,
      originalCount: games.length 
    });

    setFilteredGames(filtered);
  };

  const handleContinueGame = (instanceId: string, scenarioId: string) => {
    logger.info('UI', 'Continuing game', { instanceId, scenarioId });
    navigate(`/core-chat?instance=${instanceId}&scenario=${scenarioId}`);
  };

  const handleViewResults = (instanceId: string) => {
    logger.info('UI', 'Viewing game results', { instanceId });
    navigate(`/results/${instanceId}`);
  };

  const handleDeleteGame = async (instanceId: string) => {
    try {
      logger.info('UI', 'Deleting in-progress game', { instanceId });
      const { error } = await supabase
        .from('scenario_instances')
        .delete()
        .eq('id', instanceId);

      if (error) {
        logger.error('API', 'Failed to delete game', error, { instanceId });
        toast({
          title: 'Deletion failed',
          description: 'Could not delete this game. Please try again.',
        });
        return;
      }

      setGames((prev) => prev.filter((g) => g.id !== instanceId));
      toast({
        title: 'Game deleted',
        description: 'Your in-progress game has been removed.',
      });
    } catch (err) {
      logger.error('UI', 'Unexpected error deleting game', err, { instanceId });
      toast({
        title: 'Deletion failed',
        description: 'An unexpected error occurred.',
      });
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <AppBreadcrumb />
        <PageHeader
          title="My Games"
          subtitle="Manage your scenario game history"
          showBackButton={true}
        />

        <div className="mb-6">
          <GameFilters
            filters={filters}
            onFiltersChange={setFilters}
            totalGames={games.length}
            filteredCount={filteredGames.length}
          />
        </div>

        {filteredGames.length === 0 && !loading ? (
          <EmptyGames hasAnyGames={games.length > 0} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <GameInstanceCard
                key={game.id}
                game={game}
                onContinue={handleContinueGame}
                onViewResults={handleViewResults}
                onDelete={handleDeleteGame}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGames;
