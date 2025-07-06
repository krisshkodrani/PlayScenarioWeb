
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import PageHeader from '@/components/navigation/PageHeader';
import GameFilters from '@/components/my-games/GameFilters';
import GameInstanceCard from '@/components/my-games/GameInstanceCard';
import EmptyGames from '@/components/my-games/EmptyGames';
import { Loader2 } from 'lucide-react';

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

interface GameFilters {
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
  const [filters, setFilters] = useState<GameFilters>({
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
      
      const { data, error } = await supabase
        .from('scenario_instances')
        .select(`
          *,
          scenarios:scenario_id(title, description)
        `)
        .eq('user_id', user?.id)
        .order('started_at', { ascending: false });

      if (error) throw error;
      
      setGames(data || []);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
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

    setFilteredGames(filtered);
  };

  const handleContinueGame = (instanceId: string, scenarioId: string) => {
    navigate(`/core-chat?instance=${instanceId}&scenario=${scenarioId}`);
  };

  const handleViewResults = (instanceId: string) => {
    navigate(`/results/${instanceId}`);
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
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGames;
