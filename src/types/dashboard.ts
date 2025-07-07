
export interface User {
  id: string;
  username?: string;
  created_at: string;
  bio?: string;
  display_name?: string;
  profile_visibility?: string;
  show_email_publicly?: boolean;
  updated_at: string;
  credits: number;
}

export interface Credits {
  credits: number;
}

export interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  created_at: string;
  user_id: string;
}

export interface GameStats {
  total: number;
  won: number;
  lost: number;
  inProgress: number;
}

export interface ScenarioStats {
  total: number;
  public: number;
  private: number;
  totalLikes: number;
}

export interface ActivityItem {
  id: string;
  type: 'game_played' | 'scenario_created' | 'scenario_liked' | 'credit_transaction';
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
