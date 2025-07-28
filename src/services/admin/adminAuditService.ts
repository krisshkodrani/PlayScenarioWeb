
import { supabase } from '@/integrations/supabase/client';

export interface AdminAction {
  id: string;
  admin_id: string;
  action_type: 'user_blocked' | 'user_unblocked' | 'content_blocked' | 'content_unblocked' | 'content_deleted';
  target_type: 'user' | 'scenario' | 'character';
  target_id: string;
  reason?: string;
  details?: Record<string, any>;
  created_at: string;
  admin_profile?: {
    username?: string;
    display_name?: string;
  };
  target_info?: {
    name?: string;
    title?: string;
  };
}

export interface AuditFilters {
  startDate?: string;
  endDate?: string;
  adminId?: string;
  actionType?: string;
  targetType?: string;
  targetId?: string;
  searchKeyword?: string;
}

export interface AuditStats {
  totalActions: number;
  recentActions: number;
  topActionTypes: Array<{ action_type: string; count: number }>;
  activeAdmins: number;
}

export const adminAuditService = {
  async getAdminActions(
    filters: AuditFilters = {},
    page: number = 1,
    pageSize: number = 50
  ): Promise<{ data: AdminAction[]; count: number }> {
    let query = supabase
      .from('admin_actions')
      .select(`
        *,
        admin_profile:profiles!admin_actions_admin_id_fkey(username, display_name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.startDate) {
      query = query.gte('created_at', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('created_at', filters.endDate);
    }
    if (filters.adminId) {
      query = query.eq('admin_id', filters.adminId);
    }
    if (filters.actionType) {
      query = query.eq('action_type', filters.actionType);
    }
    if (filters.targetType) {
      query = query.eq('target_type', filters.targetType);
    }
    if (filters.targetId) {
      query = query.eq('target_id', filters.targetId);
    }
    if (filters.searchKeyword) {
      query = query.or(`reason.ilike.%${filters.searchKeyword}%,details->>'reason'.ilike.%${filters.searchKeyword}%`);
    }

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching admin actions:', error);
      throw new Error('Failed to fetch admin actions');
    }

    // Enrich data with target information
    const enrichedData = await this.enrichTargetInfo(data || []);

    return {
      data: enrichedData,
      count: count || 0
    };
  },

  async enrichTargetInfo(actions: AdminAction[]): Promise<AdminAction[]> {
    const enrichedActions = await Promise.all(
      actions.map(async (action) => {
        let targetInfo: { name?: string; title?: string } = {};

        try {
          if (action.target_type === 'scenario') {
            const { data } = await supabase
              .from('scenarios')
              .select('title')
              .eq('id', action.target_id)
              .single();
            if (data) {
              targetInfo.title = data.title;
            }
          } else if (action.target_type === 'character') {
            const { data } = await supabase
              .from('scenario_characters')
              .select('name')
              .eq('id', action.target_id)
              .single();
            if (data) {
              targetInfo.name = data.name;
            }
          } else if (action.target_type === 'user') {
            const { data } = await supabase
              .from('profiles')
              .select('username, display_name')
              .eq('id', action.target_id)
              .single();
            if (data) {
              targetInfo.name = data.display_name || data.username || 'Unknown User';
            }
          }
        } catch (error) {
          console.warn('Failed to enrich target info for action:', action.id);
        }

        return {
          ...action,
          target_info: targetInfo
        };
      })
    );

    return enrichedActions;
  },

  async getActionDetails(actionId: string): Promise<AdminAction | null> {
    const { data, error } = await supabase
      .from('admin_actions')
      .select(`
        *,
        admin_profile:profiles!admin_actions_admin_id_fkey(username, display_name)
      `)
      .eq('id', actionId)
      .single();

    if (error) {
      console.error('Error fetching action details:', error);
      return null;
    }

    const enrichedData = await this.enrichTargetInfo([data]);
    return enrichedData[0] || null;
  },

  async getAuditStats(): Promise<AuditStats> {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    try {
      // Get total actions count
      const { count: totalActions } = await supabase
        .from('admin_actions')
        .select('id', { count: 'exact', head: true });

      // Get recent actions (last 7 days)
      const { count: recentActions } = await supabase
        .from('admin_actions')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      // Get top action types
      const { data: actionTypeData } = await supabase
        .from('admin_actions')
        .select('action_type')
        .gte('created_at', sevenDaysAgo.toISOString());

      const actionTypeCounts = actionTypeData?.reduce((acc, action) => {
        acc[action.action_type] = (acc[action.action_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const topActionTypes = Object.entries(actionTypeCounts)
        .map(([action_type, count]) => ({ action_type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get active admins count
      const { data: activeAdminsData } = await supabase
        .from('admin_actions')
        .select('admin_id')
        .gte('created_at', sevenDaysAgo.toISOString());

      const uniqueAdmins = new Set(activeAdminsData?.map(action => action.admin_id) || []);

      return {
        totalActions: totalActions || 0,
        recentActions: recentActions || 0,
        topActionTypes,
        activeAdmins: uniqueAdmins.size
      };
    } catch (error) {
      console.error('Error fetching audit stats:', error);
      return {
        totalActions: 0,
        recentActions: 0,
        topActionTypes: [],
        activeAdmins: 0
      };
    }
  },

  async getAdminUsers(): Promise<Array<{ id: string; name: string }>> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name')
      .eq('is_super_admin', true);

    if (error) {
      console.error('Error fetching admin users:', error);
      return [];
    }

    return data?.map(admin => ({
      id: admin.id,
      name: admin.display_name || admin.username || 'Unknown Admin'
    })) || [];
  },

  async exportAuditLog(filters: AuditFilters): Promise<Blob> {
    // Get all matching records without pagination for export
    const { data } = await this.getAdminActions(filters, 1, 10000);
    
    const csvHeaders = ['Timestamp', 'Admin', 'Action Type', 'Target Type', 'Target ID', 'Target Name', 'Reason'];
    const csvRows = data.map(action => [
      new Date(action.created_at).toISOString(),
      action.admin_profile?.display_name || action.admin_profile?.username || 'Unknown',
      action.action_type,
      action.target_type,
      action.target_id,
      action.target_info?.name || action.target_info?.title || '',
      action.reason || ''
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  }
};
