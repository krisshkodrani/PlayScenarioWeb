import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, Activity, Clock, TrendingUp, Zap } from 'lucide-react';
import PageHeader from '@/components/navigation/PageHeader';
import MetricCard from '@/components/admin/MetricCard';
import TrendChart from '@/components/admin/charts/TrendChart';
import DistributionChart from '@/components/admin/charts/DistributionChart';
import ComparisonChart from '@/components/admin/charts/ComparisonChart';
import TimePeriodSelector from '@/components/admin/TimePeriodSelector';
import { adminAnalyticsService, UserEngagementMetrics, TimeSeriesData } from '@/services/admin/adminAnalyticsService';
import { supabase } from '@/integrations/supabase/client';

interface UserStats {
  totalUsers: number;
  newUsersThisPeriod: number;
  activeUsers: number;
  engagedUsers: number;
}

const UserAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState<UserStats>({
    totalUsers: 0,
    newUsersThisPeriod: 0,
    activeUsers: 0,
    engagedUsers: 0
  });
  const [engagementMetrics, setEngagementMetrics] = useState<UserEngagementMetrics | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [userActivity, setUserActivity] = useState<any[]>([]);

  useEffect(() => {
    const loadUserAnalytics = async () => {
      try {
        setLoading(true);
        
        const periodDays = getDaysFromPeriod(selectedPeriod);
        const periodStart = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

        // Load basic user stats
        const [totalUsersResult, newUsersResult, activeUsersResult] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true })
            .gte('created_at', periodStart.toISOString()),
          supabase.from('scenario_instances').select('user_id')
            .gte('started_at', periodStart.toISOString())
        ]);

        // Calculate engaged users (users who have created content or played scenarios)
        const engagedUsersResult = await supabase
          .from('scenarios')
          .select('creator_id')
          .gte('created_at', periodStart.toISOString());

        const uniqueActiveUsers = new Set(activeUsersResult.data?.map(u => u.user_id) || []).size;
        const uniqueEngagedUsers = new Set(engagedUsersResult.data?.map(s => s.creator_id) || []).size;

        setUserStats({
          totalUsers: totalUsersResult.count || 0,
          newUsersThisPeriod: newUsersResult.count || 0,
          activeUsers: uniqueActiveUsers,
          engagedUsers: uniqueEngagedUsers
        });

        // Load analytics data
        const [engagement, timeSeries] = await Promise.all([
          adminAnalyticsService.getUserEngagementMetrics(),
          adminAnalyticsService.getTimeSeriesData(periodDays)
        ]);

        setEngagementMetrics(engagement);
        setTimeSeriesData(timeSeries);

        // Load user activity distribution
        const activityData = await supabase
          .from('scenario_instances')
          .select('started_at, status')
          .gte('started_at', periodStart.toISOString());

        if (activityData.data) {
          const activityByDay = activityData.data.reduce((acc: any, instance) => {
            const day = new Date(instance.started_at).toLocaleDateString();
            acc[day] = (acc[day] || 0) + 1;
            return acc;
          }, {});

          const activityArray = Object.entries(activityByDay).map(([date, count]) => ({
            date,
            activity: count
          }));

          setUserActivity(activityArray.slice(-7)); // Last 7 days
        }

      } catch (error) {
        console.error('Error loading user analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserAnalytics();
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
          title="User Analytics"
          subtitle="Comprehensive insights into user behavior, engagement, and platform adoption"
          actions={
            <TimePeriodSelector
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          }
        />

        {/* User Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value={userStats.totalUsers}
            icon={Users}
            iconColor="text-blue-400"
            iconBgColor="bg-blue-500/10"
          />
          <MetricCard
            title="New Users"
            value={userStats.newUsersThisPeriod}
            changeLabel={selectedPeriod}
            icon={UserPlus}
            iconColor="text-emerald-400"
            iconBgColor="bg-emerald-500/10"
          />
          <MetricCard
            title="Active Users"
            value={userStats.activeUsers}
            changeLabel="playing scenarios"
            icon={Activity}
            iconColor="text-violet-400"
            iconBgColor="bg-violet-500/10"
          />
          <MetricCard
            title="Engaged Users"
            value={userStats.engagedUsers}
            changeLabel="creating content"
            icon={Zap}
            iconColor="text-amber-400"
            iconBgColor="bg-amber-500/10"
          />
        </div>

        {/* User Growth Trends & Engagement Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Trends */}
          <Card className="bg-slate-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                User Growth Trends
              </CardTitle>
              <CardDescription className="text-slate-400">
                New user registrations and growth patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!loading && timeSeriesData.length > 0 ? (
                <TrendChart
                  data={timeSeriesData}
                  dataKeys={['users']}
                  colors={['#3B82F6']}
                  height={300}
                />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400">
                  {loading ? 'Loading...' : 'No data available'}
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Engagement Distribution */}
          <Card className="bg-slate-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-violet-400" />
                User Engagement Levels
              </CardTitle>
              <CardDescription className="text-slate-400">
                Distribution of user activity and engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              {engagementMetrics ? (
                <DistributionChart
                  data={[
                    { name: 'Daily Active', value: engagementMetrics.dailyActiveUsers, color: '#10B981' },
                    { name: 'Weekly Active', value: engagementMetrics.weeklyActiveUsers, color: '#3B82F6' },
                    { name: 'Monthly Active', value: engagementMetrics.monthlyActiveUsers, color: '#8B5CF6' }
                  ]}
                  height={300}
                  innerRadius={40}
                />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400">
                  {loading ? 'Loading...' : 'No data available'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity Patterns & Session Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Activity Patterns */}
          <Card className="bg-slate-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Daily Activity Patterns
              </CardTitle>
              <CardDescription className="text-slate-400">
                User activity distribution over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userActivity.length > 0 ? (
                <ComparisonChart
                  data={userActivity}
                  dataKeys={['activity']}
                  colors={['#22D3EE']}
                  height={250}
                  xAxisKey="date"
                />
              ) : (
                <div className="h-[250px] flex items-center justify-center text-slate-400">
                  {loading ? 'Loading...' : 'No activity data available'}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session & Retention Metrics */}
          <Card className="bg-slate-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Session & Retention Metrics
              </CardTitle>
              <CardDescription className="text-slate-400">
                Average session duration and user retention rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {engagementMetrics ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Average Session Duration</span>
                    <span className="text-emerald-400 font-semibold">
                      {Math.round(engagementMetrics.avgSessionDuration / 60)} minutes
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Completion Rate</span>
                    <span className="text-emerald-400 font-semibold">
                      {Math.round(engagementMetrics.completionRate * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Daily Active Users</span>
                    <span className="text-blue-400 font-semibold">
                      {engagementMetrics.dailyActiveUsers}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">Monthly Active Users</span>
                    <span className="text-violet-400 font-semibold">
                      {engagementMetrics.monthlyActiveUsers}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-400 py-8">
                  {loading ? 'Loading...' : 'No engagement metrics available'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;