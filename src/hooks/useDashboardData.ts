
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardData } from '@/types/dashboard';
import { logger } from '@/lib/logger';

export const useDashboardData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        logger.debug('API', 'Fetching dashboard data', { userId: user.id });
        setLoading(true);
        setError(null);

        // Fetch user profile with credits
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        // Fetch scenarios created by user
        const { data: scenarios, error: scenariosError } = await supabase
          .from('scenarios')
          .select('*')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false });

        if (scenariosError) throw scenariosError;

        // Fetch characters created by user  
        const { data: characters, error: charactersError } = await supabase
          .from('characters')
          .select('*')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false });

        if (charactersError) throw charactersError;

        // Fetch game instances
        const { data: gameInstances, error: gameInstancesError } = await supabase
          .from('scenario_instances')
          .select(`
            *,
            scenarios:scenario_id(title, description)
          `)
          .eq('user_id', user.id)
          .order('started_at', { ascending: false });

        if (gameInstancesError) throw gameInstancesError;

        // Fetch recent transactions
        const { data: transactions, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (transactionsError) throw transactionsError;

        // Calculate statistics
        const gameStats = {
          total: gameInstances?.length || 0,
          won: gameInstances?.filter(g => g.status === 'won').length || 0,
          lost: gameInstances?.filter(g => g.status === 'lost').length || 0,
          inProgress: gameInstances?.filter(g => g.status === 'playing').length || 0
        };

        const scenarioStats = {
          total: scenarios?.length || 0,
          public: scenarios?.filter(s => s.is_public).length || 0,
          private: scenarios?.filter(s => !s.is_public).length || 0,
          totalLikes: scenarios?.reduce((sum, s) => sum + (s.like_count || 0), 0) || 0
        };

        // Create activity feed
        const activityFeed = [
          ...(gameInstances || []).slice(0, 3).map(game => ({
            id: game.id,
            type: 'game_played' as const,
            title: `Played "${game.scenarios?.title || 'Unknown Scenario'}"`,
            description: `Status: ${game.status} | Turn ${game.current_turn}`,
            timestamp: game.started_at,
            metadata: { scenarioId: game.scenario_id, status: game.status }
          })),
          ...(scenarios || []).slice(0, 2).map(scenario => ({
            id: scenario.id,
            type: 'scenario_created' as const,
            title: `Created "${scenario.title}"`,
            description: scenario.description,
            timestamp: scenario.created_at,
            metadata: { isPublic: scenario.is_public, likes: scenario.like_count }
          }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

        const dashboardData: DashboardData = {
          user: {
            id: profile.id,
            username: profile.username,
            created_at: profile.created_at,
            bio: profile.bio,
            display_name: profile.display_name,
            profile_visibility: profile.profile_visibility,
            show_email_publicly: profile.show_email_publicly,
            updated_at: profile.updated_at,
            credits: profile.credits
          },
          credits: { credits: profile.credits },
          scenarios: scenarios || [],
          characters: characters || [],
          gameInstances: gameInstances || [],
          recentTransactions: transactions || [],
          gameStats,
          scenarioStats,
          activityFeed
        };

        logger.info('API', 'Dashboard data fetched successfully', {
          userId: user.id,
          scenarioCount: scenarios?.length || 0,
          characterCount: characters?.length || 0,
          gameCount: gameInstances?.length || 0,
          credits: profile.credits
        });

        setData(dashboardData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data';
        logger.error('API', 'Failed to fetch dashboard data', err, { userId: user.id });
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return { data, loading, error };
};
