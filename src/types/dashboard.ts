
export interface User {
  id: string;
  email: string;
  username?: string;
  created_at: string;
}

export interface Credits {
  credits: number;
  last_updated: string;
}

export interface Transaction {
  id: string;
  credits_change: number;
  reason: string;
  created_at: string;
}

export interface GameStats {
  total: number;
  completed: number;
  inProgress: number;
  winRate: number;
  averageScore: number;
}

export interface ScenarioStats {
  total: number;
  published: number;
  private: number;
  totalLikes: number;
  totalBookmarks: number;
  totalPlays: number;
}

export interface ActivityItem {
  type: 'game_completed' | 'scenario_created' | 'scenario_liked' | 'credit_transaction';
  title: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

export interface DashboardData {
  user: User;
  credits: Credits;
  recentTransactions: Transaction[];
  scenarios: any[];
  gameInstances: any[];
  characters: any[];
  gameStats: GameStats;
  scenarioStats: ScenarioStats;
  activityFeed: ActivityItem[];
}
