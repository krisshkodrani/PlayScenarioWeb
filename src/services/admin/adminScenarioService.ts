
import { supabase } from '@/integrations/supabase/client';

export interface AdminScenarioFilters {
  search: string;
  status: 'all' | 'active' | 'blocked' | 'pending_review';
  creator: string;
  dateFrom: string;
  dateTo: string;
}

export interface AdminScenario {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  creator_username: string;
  status: 'active' | 'blocked' | 'pending_review';
  is_public: boolean;
  created_at: string;
  blocked_at?: string;
  blocked_by?: string;
  blocked_reason?: string;
  play_count: number;
  like_count: number;
  character_count: number;
}

export const getAdminScenarios = async (
  filters: AdminScenarioFilters,
  page = 1,
  limit = 20
): Promise<{ scenarios: AdminScenario[]; total: number }> => {
  let query = supabase
    .from('scenarios')
    .select(`
      *,
      profiles!creator_id(username),
      scenario_character_assignments(id)
    `, { count: 'exact' });

  // Apply filters
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  if (filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters.creator) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .ilike('username', `%${filters.creator}%`);
    
    if (profiles && profiles.length > 0) {
      const creatorIds = profiles.map(p => p.id);
      query = query.in('creator_id', creatorIds);
    } else {
      // No matching creators found
      return { scenarios: [], total: 0 };
    }
  }

  if (filters.dateFrom) {
    query = query.gte('created_at', filters.dateFrom);
  }

  if (filters.dateTo) {
    query = query.lte('created_at', filters.dateTo);
  }

  // Apply pagination
  const startRange = (page - 1) * limit;
  const endRange = startRange + limit - 1;
  query = query.range(startRange, endRange);

  // Order by creation date (newest first)
  query = query.order('created_at', { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching admin scenarios:', error);
    throw error;
  }

  const scenarios: AdminScenario[] = (data || []).map(scenario => ({
    id: scenario.id,
    title: scenario.title,
    description: scenario.description,
    creator_id: scenario.creator_id,
    creator_username: (scenario.profiles as any)?.username || 'Unknown',
    status: (scenario.status || 'active') as 'active' | 'blocked' | 'pending_review',
    is_public: scenario.is_public,
    created_at: scenario.created_at,
    blocked_at: scenario.blocked_at,
    blocked_by: scenario.blocked_by,
    blocked_reason: scenario.blocked_reason,
    play_count: scenario.play_count || 0,
    like_count: scenario.like_count || 0,
    character_count: scenario.scenario_character_assignments?.length || 0
  }));

  return {
    scenarios,
    total: count || 0
  };
};

export const blockScenario = async (scenarioId: string, reason: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('scenarios')
    .update({
      status: 'blocked',
      blocked_reason: reason,
      blocked_at: new Date().toISOString(),
      blocked_by: user.id
    })
    .eq('id', scenarioId);

  if (error) {
    console.error('Error blocking scenario:', error);
    throw error;
  }

  // Log the admin action
  await supabase
    .from('admin_actions')
    .insert({
      admin_id: user.id,
      action_type: 'content_blocked',
      target_type: 'scenario',
      target_id: scenarioId,
      reason: reason,
      details: { scenario_id: scenarioId }
    });
};

export const unblockScenario = async (scenarioId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('scenarios')
    .update({
      status: 'active',
      blocked_reason: null,
      blocked_at: null,
      blocked_by: null
    })
    .eq('id', scenarioId);

  if (error) {
    console.error('Error unblocking scenario:', error);
    throw error;
  }

  // Log the admin action
  await supabase
    .from('admin_actions')
    .insert({
      admin_id: user.id,
      action_type: 'content_unblocked',
      target_type: 'scenario',
      target_id: scenarioId,
      reason: 'Content unblocked by admin'
    });
};

// Bulk operations
export const bulkBlockScenarios = async (scenarioIds: string[], reason: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('scenarios')
    .update({
      status: 'blocked',
      blocked_reason: reason,
      blocked_at: new Date().toISOString(),
      blocked_by: user.id
    })
    .in('id', scenarioIds);

  if (error) {
    console.error('Error bulk blocking scenarios:', error);
    throw error;
  }

  // Log the bulk admin action
  await supabase
    .from('admin_actions')
    .insert({
      admin_id: user.id,
      action_type: 'bulk_content_blocked',
      target_type: 'scenario',
      target_id: scenarioIds[0], // Use first ID as representative
      reason: reason,
      details: { 
        scenario_ids: scenarioIds,
        bulk_count: scenarioIds.length
      }
    });
};

export const bulkUnblockScenarios = async (scenarioIds: string[]): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('scenarios')
    .update({
      status: 'active',
      blocked_reason: null,
      blocked_at: null,
      blocked_by: null
    })
    .in('id', scenarioIds);

  if (error) {
    console.error('Error bulk unblocking scenarios:', error);
    throw error;
  }

  // Log the bulk admin action
  await supabase
    .from('admin_actions')
    .insert({
      admin_id: user.id,
      action_type: 'bulk_content_unblocked',
      target_type: 'scenario',
      target_id: scenarioIds[0], // Use first ID as representative
      reason: 'Bulk content unblocked by admin',
      details: { 
        scenario_ids: scenarioIds,
        bulk_count: scenarioIds.length
      }
    });
};
