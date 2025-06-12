
import { useState, useEffect } from 'react';
import { DashboardData, GameStats, ScenarioStats, ActivityItem } from '@/types/dashboard';

// Mock data
const mockUser = {
  id: '1',
  email: 'user@example.com',
  username: 'scenario_master',
  created_at: '2024-01-15T10:30:00Z'
};

const mockCredits = {
  credits: 25,
  last_updated: '2024-01-20T15:45:00Z'
};

const mockTransactions = [
  {
    id: '1',
    credits_change: -2,
    reason: 'Played scenario: Corporate Crisis',
    created_at: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    credits_change: 50,
    reason: 'Credit purchase',
    created_at: '2024-01-19T10:15:00Z'
  },
  {
    id: '3',
    credits_change: -3,
    reason: 'Played scenario: Space Station Emergency',
    created_at: '2024-01-18T16:20:00Z'
  }
];

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
        title: `Completed scenario "${instance.scenario?.title}"`,
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
        title: transaction.credits_change > 0 ? 'Credits purchased' : 'Credits used',
        description: `${Math.abs(transaction.credits_change)} credits • ${transaction.reason}`,
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
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const gameStats = processGameStats(mockGameInstances);
        const scenarioStats = processScenarioStats(mockScenarios);
        const activityFeed = generateActivityFeed(mockGameInstances, mockScenarios, mockTransactions);
        
        setData({
          user: mockUser,
          credits: mockCredits,
          recentTransactions: mockTransactions,
          scenarios: mockScenarios,
          gameInstances: mockGameInstances,
          gameStats,
          scenarioStats,
          activityFeed
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { data, loading, error };
};
