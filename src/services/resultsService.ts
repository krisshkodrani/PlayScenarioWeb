
import { supabase } from '@/integrations/supabase/client';

export interface GameResults {
  id: string;
  status: 'completed' | 'won' | 'lost' | 'abandoned';
  objectives_progress: Record<string, any>;
  final_score: number | null;
  win_condition_met: boolean | null;
  lose_condition_met: boolean | null;
  completion_reason: string | null;
  current_turn: number;
  max_turns: number | null;
  started_at: string;
  ended_at: string | null;
  scenario: {
    id: string;
    title: string;
    description: string;
    objectives: any[];
  };
  user: {
    username: string | null;
  };
}

export interface ConversationStats {
  totalMessages: number;
  playerMessages: number;
  averageMessageLength: number;
}

class ResultsService {
  async getGameResults(instanceId: string): Promise<GameResults> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // For now, we'll mock this data since the tables don't exist yet
    // In a real implementation, this would query the actual scenario_instances table
    const mockResults: GameResults = {
      id: instanceId,
      status: 'won',
      objectives_progress: {
        '1': { progress_percentage: 85, key_actions: ['negotiated with captain', 'analyzed sensor data'] },
        '2': { progress_percentage: 90, key_actions: ['coordinated rescue efforts'] },
        '3': { progress_percentage: 60, key_actions: ['attempted diplomatic solution'] }
      },
      final_score: 82,
      win_condition_met: true,
      lose_condition_met: false,
      completion_reason: "You successfully navigated the crisis through strategic thinking and effective leadership. Your diplomatic approach and quick decision-making saved lives while maintaining mission integrity.",
      current_turn: 8,
      max_turns: 12,
      started_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      ended_at: new Date().toISOString(),
      scenario: {
        id: 'kobayashi-maru',
        title: 'Kobayashi Maru Simulation',
        description: 'Navigate an impossible situation and test your leadership under pressure.',
        objectives: [
          { id: '1', description: 'Analyze the tactical situation and identify key threats' },
          { id: '2', description: 'Coordinate rescue operations while maintaining crew safety' },
          { id: '3', description: 'Find a diplomatic solution to avoid unnecessary conflict' }
        ]
      },
      user: {
        username: user.email?.split('@')[0] || 'Player'
      }
    };

    return mockResults;
  }

  async getConversationStats(instanceId: string): Promise<ConversationStats> {
    // Mock conversation statistics
    return {
      totalMessages: 24,
      playerMessages: 12,
      averageMessageLength: 75
    };
  }
}

export const resultsService = new ResultsService();
