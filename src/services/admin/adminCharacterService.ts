
import { supabase } from '@/integrations/supabase/client';

export interface AdminCharacter {
  id: string;
  name: string;
  role: string;
  personality: string;
  expertise_keywords: string[];
  creator_id: string;
  creator_username: string;
  status: 'active' | 'blocked' | 'pending_review';
  created_at: string;
  blocked_at: string | null;
  blocked_by: string | null;
  blocked_reason: string | null;
  scenario_count: number;
  total_responses: number;
  average_rating: number | null;
  last_used: string | null;
}

export interface AdminCharacterFilters {
  search: string;
  status: 'all' | 'active' | 'blocked' | 'pending_review';
  creator: string;
  role: string;
  dateFrom: string;
  dateTo: string;
}

export interface CharacterModerationResult {
  characters: AdminCharacter[];
  total: number;
  page: number;
  pageSize: number;
}

class AdminCharacterService {
  async getCharacters(
    filters: AdminCharacterFilters,
    page: number = 1,
    pageSize: number = 10
  ): Promise<CharacterModerationResult> {
    let query = supabase
      .from('characters')
      .select(`
        *,
        profiles!creator_id(username),
        character_usage_stats(scenario_count, total_responses, average_rating, last_used)
      `, { count: 'exact' });

    // Apply filters
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,personality.ilike.%${filters.search}%,role.ilike.%${filters.search}%`);
    }

    if (filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters.creator) {
      query = query.eq('profiles.username', filters.creator);
    }

    if (filters.role) {
      query = query.ilike('role', `%${filters.role}%`);
    }


    if (filters.dateFrom) {
      query = query.gte('created_at', filters.dateFrom);
    }

    if (filters.dateTo) {
      query = query.lte('created_at', filters.dateTo);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    // Order by creation date (newest first)
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching characters:', error);
      throw error;
    }

    const characters: AdminCharacter[] = data?.map((character: any) => ({
      id: character.id,
      name: character.name,
      role: character.role,
      personality: character.personality,
      expertise_keywords: character.expertise_keywords,
      creator_id: character.creator_id,
      creator_username: (character.profiles as any)?.username || 'Unknown',
      status: (character.status || 'active') as 'active' | 'blocked' | 'pending_review',
      created_at: character.created_at,
      blocked_at: character.blocked_at,
      blocked_by: character.blocked_by,
      blocked_reason: character.blocked_reason,
      scenario_count: character.character_usage_stats?.scenario_count || 0,
      total_responses: character.character_usage_stats?.total_responses || 0,
      average_rating: character.character_usage_stats?.average_rating || null,
      last_used: character.character_usage_stats?.last_used || null,
    })) || [];

    return {
      characters,
      total: count || 0,
      page,
      pageSize
    };
  }

  async blockCharacter(characterId: string, reason: string): Promise<void> {
    const { data: adminUser } = await supabase.auth.getUser();
    if (!adminUser.user) throw new Error('Not authenticated');

    const { error: blockError } = await supabase
      .from('characters')
      .update({
        status: 'blocked',
        blocked_at: new Date().toISOString(),
        blocked_by: adminUser.user.id,
        blocked_reason: reason
      })
      .eq('id', characterId);

    if (blockError) throw blockError;

    // Log admin action
    await this.logAdminAction(adminUser.user.id, characterId, 'block', 'character', { reason });
  }

  async unblockCharacter(characterId: string, reason: string): Promise<void> {
    const { data: adminUser } = await supabase.auth.getUser();
    if (!adminUser.user) throw new Error('Not authenticated');

    const { error: unblockError } = await supabase
      .from('characters')
      .update({
        status: 'active',
        blocked_at: null,
        blocked_by: null,
        blocked_reason: null
      })
      .eq('id', characterId);

    if (unblockError) throw unblockError;

    // Log admin action
    await this.logAdminAction(adminUser.user.id, characterId, 'unblock', 'character', { reason });
  }

  async setPendingReview(characterId: string, reason: string): Promise<void> {
    const { data: adminUser } = await supabase.auth.getUser();
    if (!adminUser.user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('characters')
      .update({
        status: 'pending_review'
      })
      .eq('id', characterId);

    if (error) throw error;

    // Log admin action
    await this.logAdminAction(adminUser.user.id, characterId, 'mark_pending_review', 'character', { reason });
  }

  // Bulk operations
  async bulkBlockCharacters(characterIds: string[], reason: string): Promise<void> {
    const { data: adminUser } = await supabase.auth.getUser();
    if (!adminUser.user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('characters')
      .update({
        status: 'blocked',
        blocked_at: new Date().toISOString(),
        blocked_by: adminUser.user.id,
        blocked_reason: reason
      })
      .in('id', characterIds);

    if (error) throw error;

    // Log bulk admin action
    await this.logAdminAction(
      adminUser.user.id, 
      characterIds[0], 
      'bulk_character_blocked', 
      'character', 
      { 
        character_ids: characterIds,
        bulk_count: characterIds.length,
        reason 
      }
    );
  }

  async bulkUnblockCharacters(characterIds: string[]): Promise<void> {
    const { data: adminUser } = await supabase.auth.getUser();
    if (!adminUser.user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('characters')
      .update({
        status: 'active',
        blocked_at: null,
        blocked_by: null,
        blocked_reason: null
      })
      .in('id', characterIds);

    if (error) throw error;

    // Log bulk admin action
    await this.logAdminAction(
      adminUser.user.id, 
      characterIds[0], 
      'bulk_character_unblocked', 
      'character', 
      { 
        character_ids: characterIds,
        bulk_count: characterIds.length
      }
    );
  }

  async bulkSetPendingReview(characterIds: string[], reason: string): Promise<void> {
    const { data: adminUser } = await supabase.auth.getUser();
    if (!adminUser.user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('characters')
      .update({
        status: 'pending_review'
      })
      .in('id', characterIds);

    if (error) throw error;

    // Log bulk admin action
    await this.logAdminAction(
      adminUser.user.id, 
      characterIds[0], 
      'bulk_character_pending_review', 
      'character', 
      { 
        character_ids: characterIds,
        bulk_count: characterIds.length,
        reason 
      }
    );
  }

  private async logAdminAction(
    adminId: string,
    targetId: string,
    actionType: string,
    targetType: string,
    details: any
  ): Promise<void> {
    const { error } = await supabase
      .from('admin_actions')
      .insert({
        admin_id: adminId,
        target_id: targetId,
        action_type: actionType,
        target_type: targetType,
        details
      });

    if (error) {
      console.error('Error logging admin action:', error);
    }
  }
}

export const adminCharacterService = new AdminCharacterService();
