
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DashboardData, GameStats, ScenarioStats, ActivityItem } from '@/types/dashboard';

const processGameStats = (instances: any[]): GameStats => {
  const total = instances.length;
  const completed = instances.filter(i => ['completed', 'won', 'lost'].includes(i.status));
  const won = instances.filter(i => i.status === 'won');
  const winRate = completed.length > 0 ? Math.round((won.length / completed.length) * 100) : 0;
  
  return {
    total,
    completed: completed.length,
    inProgress: instances.filter(i => i.status === 'playing').length,
    winRate,
    averageScore: instances
      .filter(i => i.final_score)
      .reduce((acc, i) => acc + i.final_score, 0) / instances.filter(i => i.final_score).length || 0
  };
};

const processScenarioStats = (scenarios: any[]): ScenarioStats => {
  const total = scenarios.length;
  const published = scenarios.filter(s => s.is_public).length;
  const totalLikes = scenarios.reduce((acc, s) => acc + (s.like_count || 0), 0);
  const totalBookmarks = scenarios.reduce((acc, s) => acc + (s.bookmark_count || 0), 0);
  const totalPlays = scenarios.reduce((acc, s) => acc + (s.play_count || 0), 0);
  
  return { 
    total, 
    published, 
    private: total - published, 
    totalLikes, 
    totalBookmarks,
    totalPlays 
  };
};

const generateActivityFeed = (
  instances: any[],
  scenarios: any[],
  transactions: any[]
): ActivityItem[] => {
  const activities: ActivityItem[] = [];
  
  // Recent completed games
  instances
    .filter(i => ['completed', 'won', 'lost'].includes(i.status))
    .slice(0, 3)
    .forEach(instance => {
      activities.push({
        type: 'game_completed',
        title: `Completed scenario "${instance.scenario?.title || 'Unknown Scenario'}"`,
        description: `Result: ${instance.status} • Score: ${instance.final_score || 'N/A'}`,
        timestamp: instance.ended_at || instance.started_at,
        metadata: { instanceId: instance.id, scenarioId: instance.scenario_id }
      });
    });
  
  // Recent scenarios created
  scenarios
    .slice(0, 2)
    .forEach(scenario => {
      activities.push({
        type: 'scenario_created',
        title: `Created "${scenario.title}"`,
        description: `${scenario.is_public ? 'Published' : 'Private'} • ${scenario.play_count || 0} plays`,
        timestamp: scenario.created_at,
        metadata: { scenarioId: scenario.id }
      });
    });
  
  // Recent credit transactions
  transactions
    .slice(0, 2)
    .forEach(transaction => {
      activities.push({
        type: 'credit_transaction',
        title: transaction.amount > 0 ? 'Credits purchased' : 'Credits used',
        description: `${Math.abs(transaction.amount)} credits • ${transaction.description}`,
        timestamp: transaction.created_at,
        metadata: { transactionId: transaction.id }
      });
    });
  
  return activities.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 10);
};

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          throw new Error('Not authenticated');
        }

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw new Error('Failed to fetch profile');
        }

        // Fetch transactions
        const { data: transactions, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (transactionsError) {
          console.error('Failed to fetch transactions:', transactionsError);
        }

        // Mock scenarios and game instances for now (since tables don't exist yet)
        const mockScenarios = [
          {
            id: '1',
            title: 'Corporate Crisis Management',
            is_public: true,
            play_count: 45,
            like_count: 12,
            bookmark_count: 8,
            created_at: '2024-01-10T09:00:00Z'
          },
          {
            id: '2',
            title: 'Medieval Diplomacy',
            is_public: false,
            play_count: 3,
            like_count: 2,
            bookmark_count: 1,
            created_at: '2024-01-15T14:30:00Z'
          }
        ];

        const mockGameInstances = [
          {
            id: '1',
            scenario_id: '1',
            status: 'won',
            final_score: 85,
            started_at: '2024-01-20T13:00:00Z',
            ended_at: '2024-01-20T14:30:00Z',
            scenario: { title: 'Corporate Crisis Management' }
          },
          {
            id: '2',
            scenario_id: '3',
            status: 'completed',
            final_score: 72,
            started_at: '2024-01-19T16:00:00Z',
            ended_at: '2024-01-19T17:45:00Z',
            scenario: { title: 'Space Station Emergency' }
          },
          {
            id: '3',
            scenario_id: '1',
            status: 'playing',
            final_score: null,
            started_at: '2024-01-21T10:00:00Z',
            ended_at: null,
            scenario: { title: 'Corporate Crisis Management' }
          }
        ];
        
        const gameStats = processGameStats(mockGameInstances);
        const scenarioStats = processScenarioStats(mockScenarios);
        const activityFeed = generateActivityFeed(mockGameInstances, mockScenarios, transactions || []);
        
        setData({
          user: {
            id: user.id,
            email: user.email || '',
            username: profile?.username || null,
            created_at: user.created_at || new Date().toISOString()
          },
          credits: {
            credits: profile?.credits || 0,
            last_updated: profile?.updated_at || new Date().toISOString()
          },
          recentTransactions: (transactions || []).map(t => ({
            id: t.id,
            credits_change: t.amount,
            reason: t.description || 'Transaction',
            created_at: t.created_at
          })),
          scenarios: mockScenarios,
          gameInstances: mockGameInstances,
          gameStats,
          scenarioStats,
          activityFeed
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { data, loading, error };
};
