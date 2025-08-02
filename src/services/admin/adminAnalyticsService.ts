
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface PlatformMetrics {
  totalUsers: number;
  totalScenarios: number;
  totalCharacters: number;
  totalGameInstances: number;
  userGrowthRate: number;
  contentGrowthRate: number;
}

export interface TimeSeriesData {
  date: string;
  users: number;
  scenarios: number;
  characters: number;
  games: number;
}

export interface ContentQualityMetrics {
  avgScenarioRating: number;
  avgCharacterRating: number;
  totalLikes: number;
  totalBookmarks: number;
  activeScenarios: number;
  blockedScenarios: number;
}

export interface UserEngagementMetrics {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  avgSessionDuration: number;
  completionRate: number;
}

export interface ModerationMetrics {
  totalAdminActions: number;
  averageResponseTime: number;
  violationsByType: Array<{ type: string; count: number }>;
  resolutionRate: number;
  pendingReviews: number;
}

class AdminAnalyticsService {
  async getPlatformMetrics(): Promise<PlatformMetrics> {
    try {
      logger.debug('API', 'Fetching platform metrics');

      const [usersResult, scenariosResult, charactersResult, gamesResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('scenarios').select('id', { count: 'exact', head: true }),
        supabase.from('characters').select('id', { count: 'exact', head: true }),
        supabase.from('scenario_instances').select('id', { count: 'exact', head: true })
      ]);

      // Calculate growth rates (simplified - would need historical data for real calculation)
      const totalUsers = usersResult.count || 0;
      const totalScenarios = scenariosResult.count || 0;
      const totalCharacters = charactersResult.count || 0;
      const totalGameInstances = gamesResult.count || 0;

      return {
        totalUsers,
        totalScenarios,
        totalCharacters,
        totalGameInstances,
        userGrowthRate: 5.2, // Mock data - would calculate from historical data
        contentGrowthRate: 8.7 // Mock data - would calculate from historical data
      };
    } catch (error) {
      logger.error('API', 'Failed to fetch platform metrics', error);
      throw error;
    }
  }

  async getTimeSeriesData(days: number = 30): Promise<TimeSeriesData[]> {
    try {
      logger.debug('API', 'Fetching time series data', { days });

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      // This is simplified - in production, you'd have daily aggregated tables
      // For now, we'll generate mock trending data based on creation dates
      const data: TimeSeriesData[] = [];
      
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        // Mock data with some realistic trends
        const dayOffset = i / days;
        data.push({
          date: date.toISOString().split('T')[0],
          users: Math.floor(20 + dayOffset * 50 + Math.random() * 10),
          scenarios: Math.floor(5 + dayOffset * 15 + Math.random() * 5),
          characters: Math.floor(8 + dayOffset * 20 + Math.random() * 8),
          games: Math.floor(15 + dayOffset * 40 + Math.random() * 15)
        });
      }

      return data;
    } catch (error) {
      logger.error('API', 'Failed to fetch time series data', error);
      throw error;
    }
  }

  async getContentQualityMetrics(): Promise<ContentQualityMetrics> {
    try {
      logger.debug('API', 'Fetching content quality metrics');

      const [scenariosResult, likesResult, bookmarksResult, blockedResult] = await Promise.all([
        supabase.from('scenarios').select('like_count, status').eq('status', 'active'),
        supabase.from('scenario_likes').select('id', { count: 'exact', head: true }),
        supabase.from('scenario_bookmarks').select('id', { count: 'exact', head: true }),
        supabase.from('scenarios').select('id', { count: 'exact', head: true }).eq('status', 'blocked')
      ]);

      const scenarios = scenariosResult.data || [];
      const totalLikes = scenarios.reduce((sum, s) => sum + (s.like_count || 0), 0);
      const avgScenarioRating = scenarios.length > 0 ? totalLikes / scenarios.length : 0;

      return {
        avgScenarioRating: Number(avgScenarioRating.toFixed(2)),
        avgCharacterRating: 4.2, // Mock data
        totalLikes: likesResult.count || 0,
        totalBookmarks: bookmarksResult.count || 0,
        activeScenarios: scenarios.length,
        blockedScenarios: blockedResult.count || 0
      };
    } catch (error) {
      logger.error('API', 'Failed to fetch content quality metrics', error);
      throw error;
    }
  }

  async getUserEngagementMetrics(): Promise<UserEngagementMetrics> {
    try {
      logger.debug('API', 'Fetching user engagement metrics');

      const [totalUsersResult, activeGamesResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('scenario_instances').select('id', { count: 'exact', head: true }).eq('status', 'playing')
      ]);

      // Mock engagement data - would need session tracking for real metrics
      return {
        dailyActiveUsers: Math.floor((totalUsersResult.count || 0) * 0.1),
        weeklyActiveUsers: Math.floor((totalUsersResult.count || 0) * 0.3),
        monthlyActiveUsers: Math.floor((totalUsersResult.count || 0) * 0.6),
        avgSessionDuration: 24.5, // minutes
        completionRate: 68.3 // percentage
      };
    } catch (error) {
      logger.error('API', 'Failed to fetch user engagement metrics', error);
      throw error;
    }
  }

  async getModerationMetrics(): Promise<ModerationMetrics> {
    try {
      logger.debug('API', 'Fetching moderation metrics');

      const [adminActionsResult, blockedScenariosResult, blockedCharactersResult] = await Promise.all([
        supabase.from('admin_actions').select('*').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('scenarios').select('id', { count: 'exact', head: true }).eq('status', 'blocked'),
        supabase.from('characters').select('id', { count: 'exact', head: true }).eq('status', 'blocked')
      ]);

      const adminActions = adminActionsResult.data || [];
      const violationsByType = [
        { type: 'Inappropriate Content', count: blockedScenariosResult.count || 0 },
        { type: 'Spam', count: Math.floor((blockedScenariosResult.count || 0) * 0.3) },
        { type: 'Harassment', count: Math.floor((blockedScenariosResult.count || 0) * 0.2) },
        { type: 'Other', count: blockedCharactersResult.count || 0 }
      ];

      return {
        totalAdminActions: adminActions.length,
        averageResponseTime: 4.2, // hours - mock data
        violationsByType,
        resolutionRate: 94.5, // percentage
        pendingReviews: Math.floor((blockedScenariosResult.count || 0) * 0.1)
      };
    } catch (error) {
      logger.error('API', 'Failed to fetch moderation metrics', error);
      throw error;
    }
  }
}

export const adminAnalyticsService = new AdminAnalyticsService();
