import { supabase } from '@/integrations/supabase/client';

export interface GameResults {
  id: string;
  status: 'completed' | 'won' | 'lost' | 'abandoned' | string;
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

    // Load scenario instance from Supabase
    const { data: instance, error: instErr } = await supabase
      .from('scenario_instances')
      .select('*')
      .eq('id', instanceId)
      .single();

    if (instErr || !instance) {
      throw new Error(instErr?.message || 'Instance not found');
    }

    // Load scenario metadata (title, description, objectives)
    const { data: scenario, error: scenErr } = await supabase
      .from('scenarios')
      .select('id,title,description,objectives')
      .eq('id', (instance as any).scenario_id)
      .single();

    // Load user profile (optional)
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    const results: GameResults = {
      id: instance.id as string,
      status: (instance.status as any) || 'completed',
      objectives_progress: (instance as any).objectives_progress || {},
      final_score: (instance as any).final_score ?? null,
      win_condition_met: (instance as any).win_condition_met ?? null,
      lose_condition_met: (instance as any).lose_condition_met ?? null,
      completion_reason: (instance as any).completion_reason ?? null,
      current_turn: (instance as any).current_turn ?? 0,
      max_turns: (instance as any).max_turns ?? null,
      started_at: (instance as any).started_at,
      ended_at: (instance as any).ended_at ?? null,
      scenario: {
        id: scenario?.id || (instance as any).scenario_id,
        title: scenario?.title || 'Scenario',
        description: scenario?.description || '',
        objectives: (scenario?.objectives as any[]) || [],
      },
      user: {
        username: (profile as any)?.username ?? (user.email?.split('@')[0] || 'Player'),
      },
    };

    return results;
  }

  async getConversationStats(instanceId: string): Promise<ConversationStats> {
    // Mock conversation statistics for now
    return {
      totalMessages: 24,
      playerMessages: 12,
      averageMessageLength: 75
    };
  }
}

export const resultsService = new ResultsService();
