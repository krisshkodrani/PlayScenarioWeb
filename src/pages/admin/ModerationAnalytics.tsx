import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, Clock, CheckCircle, XCircle, TrendingDown } from 'lucide-react';
import PageHeader from '@/components/navigation/PageHeader';
import MetricCard from '@/components/admin/MetricCard';
import TrendChart from '@/components/admin/charts/TrendChart';
import DistributionChart from '@/components/admin/charts/DistributionChart';
import ComparisonChart from '@/components/admin/charts/ComparisonChart';
import TimePeriodSelector from '@/components/admin/TimePeriodSelector';
import { adminAnalyticsService, ModerationMetrics } from '@/services/admin/adminAnalyticsService';
import { supabase } from '@/integrations/supabase/client';

interface ModerationStats {
  totalActions: number;
  pendingReviews: number;
  resolvedToday: number;
  averageResponseTime: number;
}

interface ViolationTrend {
  date: string;
  violations: number;
  resolved: number;
}

const ModerationAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [moderationStats, setModerationStats] = useState<ModerationStats>({
    totalActions: 0,
    pendingReviews: 0,
    resolvedToday: 0,
    averageResponseTime: 0
  });
  const [moderationMetrics, setModerationMetrics] = useState<ModerationMetrics | null>(null);
  const [violationTrends, setViolationTrends] = useState<ViolationTrend[]>([]);
  const [adminPerformance, setAdminPerformance] = useState<any[]>([]);

  useEffect(() => {
    const loadModerationAnalytics = async () => {
      try {
        setLoading(true);
        
        const periodDays = getDaysFromPeriod(selectedPeriod);
        const periodStart = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        // Load basic moderation stats
        const [totalActionsResult, pendingResult, resolvedTodayResult] = await Promise.all([
          supabase.from('admin_actions').select('id', { count: 'exact', head: true })
            .gte('created_at', periodStart.toISOString()),
          supabase.from('scenarios').select('id', { count: 'exact', head: true })
            .is('blocked_at', null)
            .neq('status', 'blocked'),
          supabase.from('admin_actions').select('id', { count: 'exact', head: true })
            .gte('created_at', todayStart.toISOString())
        ]);

        setModerationStats({
          totalActions: totalActionsResult.count || 0,
          pendingReviews: pendingResult.count || 0,
          resolvedToday: resolvedTodayResult.count || 0,
          averageResponseTime: 24 // Mock data - would calculate from actual response times
        });

        // Load moderation metrics
        const moderation = await adminAnalyticsService.getModerationMetrics();
        setModerationMetrics(moderation);

        // Load violation trends over time
        const actionsResult = await supabase
          .from('admin_actions')
          .select('created_at, action_type')
          .gte('created_at', periodStart.toISOString())
          .order('created_at');

        if (actionsResult.data) {
          const trendsByDay = actionsResult.data.reduce((acc: any, action) => {
            const day = new Date(action.created_at).toLocaleDateString();
            if (!acc[day]) {
              acc[day] = { date: day, violations: 0, resolved: 0 };
            }
            if (action.action_type === 'block') {
              acc[day].violations += 1;
            } else if (action.action_type === 'unblock') {
              acc[day].resolved += 1;
            }
            return acc;
          }, {});

          setViolationTrends(Object.values(trendsByDay));
        }

        // Load admin performance data
        const adminActionsResult = await supabase
          .from('admin_actions')
          .select('admin_id, action_type, created_at')
          .gte('created_at', periodStart.toISOString());

        if (adminActionsResult.data) {
          const performanceByAdmin = adminActionsResult.data.reduce((acc: any, action) => {
            const adminId = action.admin_id;
            if (!acc[adminId]) {
              acc[adminId] = { admin: adminId.slice(0, 8), actions: 0, blocks: 0, unblocks: 0 };
            }
            acc[adminId].actions += 1;
            if (action.action_type === 'block') {
              acc[adminId].blocks += 1;
            } else if (action.action_type === 'unblock') {
              acc[adminId].unblocks += 1;
            }
            return acc;
          }, {});

          setAdminPerformance(Object.values(performanceByAdmin).slice(0, 5));
        }

      } catch (error) {
        console.error('Error loading moderation analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadModerationAnalytics();
  }, [selectedPeriod]);

  const getDaysFromPeriod = (period: string): number => {
    switch (period) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      case '1y': return 365;
      default: return 30;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="Moderation Analytics"
          subtitle="Track content violations, response times, and moderation effectiveness"
          actions={
            <TimePeriodSelector
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          }
        />

        {/* Moderation Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Actions"
            value={moderationStats.totalActions}
            changeLabel={selectedPeriod}
            icon={Shield}
            iconColor="text-amber-400"
            iconBgColor="bg-amber-500/10"
          />
          <MetricCard
            title="Pending Reviews"
            value={moderationStats.pendingReviews}
            icon={Clock}
            iconColor="text-blue-400"
            iconBgColor="bg-blue-500/10"
          />
          <MetricCard
            title="Resolved Today"
            value={moderationStats.resolvedToday}
            icon={CheckCircle}
            iconColor="text-emerald-400"
            iconBgColor="bg-emerald-500/10"
          />
          <MetricCard
            title="Avg Response Time"
            value={moderationStats.averageResponseTime}
            changeLabel="hours"
            icon={Clock}
            iconColor="text-violet-400"
            iconBgColor="bg-violet-500/10"
          />
        </div>

        {/* Violation Trends & Resolution Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Violation Trends Over Time */}
          <Card className="bg-slate-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-400" />
                Violation Trends
              </CardTitle>
              <CardDescription className="text-slate-400">
                Content violations and resolutions over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {violationTrends.length > 0 ? (
                <TrendChart
                  data={violationTrends}
                  dataKeys={['violations', 'resolved']}
                  colors={['#EF4444', '#10B981']}
                  height={300}
                />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400">
                  {loading ? 'Loading...' : 'No violation data available'}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Violation Types Distribution */}
          <Card className="bg-slate-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Violation Types
              </CardTitle>
              <CardDescription className="text-slate-400">
                Distribution of different violation categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {moderationMetrics && moderationMetrics.violationsByType.length > 0 ? (
                <DistributionChart
                  data={moderationMetrics.violationsByType.map(item => ({
                    name: item.type || 'Unknown',
                    value: item.count || 0,
                    color: getViolationColor(item.type || 'Unknown')
                  }))}
                  height={300}
                  innerRadius={40}
                />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400">
                  {loading ? 'Loading...' : 'No violation types data available'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Admin Performance & Response Time Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Admin Performance */}
          <Card className="bg-slate-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-cyan-400" />
                Admin Performance
              </CardTitle>
              <CardDescription className="text-slate-400">
                Actions taken by different administrators
              </CardDescription>
            </CardHeader>
            <CardContent>
              {adminPerformance.length > 0 ? (
                <ComparisonChart
                  data={adminPerformance}
                  dataKeys={['actions']}
                  colors={['#22D3EE']}
                  height={250}
                  xAxisKey="admin"
                />
              ) : (
                <div className="h-[250px] flex items-center justify-center text-slate-400">
                  {loading ? 'Loading...' : 'No admin performance data available'}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Moderation Effectiveness */}
          <Card className="bg-slate-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Moderation Effectiveness
              </CardTitle>
              <CardDescription className="text-slate-400">
                Resolution rates and response time metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {moderationMetrics ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Total Admin Actions</span>
                    <span className="text-amber-400 font-semibold">
                      {moderationMetrics.totalAdminActions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Average Response Time</span>
                    <span className="text-blue-400 font-semibold">
                      {Math.round(moderationMetrics.averageResponseTime)} hours
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Resolution Rate</span>
                    <span className="text-emerald-400 font-semibold">
                      {Math.round(moderationMetrics.resolutionRate * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Pending Reviews</span>
                    <span className="text-violet-400 font-semibold">
                      {moderationMetrics.pendingReviews}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-400 py-8">
                  {loading ? 'Loading...' : 'No moderation metrics available'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper function to assign colors to violation types
const getViolationColor = (type: string): string => {
  const colorMap: { [key: string]: string } = {
    'inappropriate': '#EF4444',
    'spam': '#F59E0B',
    'harassment': '#DC2626',
    'copyright': '#7C3AED',
    'violence': '#B91C1C',
    'other': '#6B7280'
  };
  return colorMap[type.toLowerCase()] || '#6B7280';
};

export default ModerationAnalytics;