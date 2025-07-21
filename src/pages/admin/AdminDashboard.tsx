
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, FileText, AlertTriangle, TrendingUp, Activity, BarChart3, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PageHeader from '@/components/navigation/PageHeader';
import MetricCard from '@/components/admin/MetricCard';
import TrendChart from '@/components/admin/charts/TrendChart';
import DistributionChart from '@/components/admin/charts/DistributionChart';
import ComparisonChart from '@/components/admin/charts/ComparisonChart';
import TimePeriodSelector from '@/components/admin/TimePeriodSelector';
import { adminAnalyticsService, PlatformMetrics, TimeSeriesData, ContentQualityMetrics, ModerationMetrics } from '@/services/admin/adminAnalyticsService';

interface DashboardStats {
  totalUsers: number;
  totalScenarios: number;
  blockedScenarios: number;
  recentActions: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalScenarios: 0,
    blockedScenarios: 0,
    recentActions: 0
  });
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [contentMetrics, setContentMetrics] = useState<ContentQualityMetrics | null>(null);
  const [moderationMetrics, setModerationMetrics] = useState<ModerationMetrics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load basic stats (existing functionality)
        const [usersResult, scenariosResult, blockedScenariosResult, actionsResult] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('scenarios').select('id', { count: 'exact', head: true }),
          supabase.from('scenarios').select('id', { count: 'exact', head: true }).eq('status', 'blocked'),
          supabase.from('admin_actions').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        ]);

        setStats({
          totalUsers: usersResult.count || 0,
          totalScenarios: scenariosResult.count || 0,
          blockedScenarios: blockedScenariosResult.count || 0,
          recentActions: actionsResult.count || 0
        });

        // Load analytics data
        const [platform, timeSeries, content, moderation] = await Promise.all([
          adminAnalyticsService.getPlatformMetrics(),
          adminAnalyticsService.getTimeSeriesData(getDaysFromPeriod(selectedPeriod)),
          adminAnalyticsService.getContentQualityMetrics(),
          adminAnalyticsService.getModerationMetrics()
        ]);

        setPlatformMetrics(platform);
        setTimeSeriesData(timeSeries);
        setContentMetrics(content);
        setModerationMetrics(moderation);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
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

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      action: () => navigate('/admin/users')
    },
    {
      title: 'Scenario Moderation',
      description: 'Review and moderate scenario content',
      icon: FileText,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      action: () => navigate('/admin/scenarios')
    },
    {
      title: 'Character Moderation',
      description: 'Review and moderate character content',
      icon: Shield,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      action: () => navigate('/admin/characters')
    },
    {
      title: 'Audit Trail',
      description: 'View admin action logs and history',
      icon: Activity,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      action: () => navigate('/admin/audit')
    }
  ];

  const analyticsActions = [
    {
      title: 'Content Analytics',
      description: 'Deep dive into content creation and performance',
      icon: BarChart3,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      action: () => navigate('/admin/analytics/content')
    },
    {
      title: 'User Analytics',
      description: 'User behavior and engagement insights',
      icon: Users,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
      borderColor: 'border-violet-500/20',
      action: () => navigate('/admin/analytics/users')
    },
    {
      title: 'Moderation Analytics',
      description: 'Track moderation effectiveness and trends',
      icon: Shield,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      action: () => navigate('/admin/analytics/moderation')
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Manage and moderate your PlayScenarioAI platform"
          actions={
            <TimePeriodSelector
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          }
        />

        {/* Enhanced Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Users"
            value={stats.totalUsers}
            change={platformMetrics?.userGrowthRate}
            icon={Users}
            iconColor="text-blue-400"
            iconBgColor="bg-blue-500/10"
          />
          <MetricCard
            title="Total Scenarios"
            value={stats.totalScenarios}
            change={platformMetrics?.contentGrowthRate}
            icon={FileText}
            iconColor="text-green-400"
            iconBgColor="bg-green-500/10"
          />
          <MetricCard
            title="Blocked Content"
            value={stats.blockedScenarios}
            icon={AlertTriangle}
            iconColor="text-red-400"
            iconBgColor="bg-red-500/10"
          />
          <MetricCard
            title="Recent Actions"
            value={stats.recentActions}
            changeLabel="last 7 days"
            icon={TrendingUp}
            iconColor="text-purple-400"
            iconBgColor="bg-purple-500/10"
          />
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Growth Trends */}
          <Card className="bg-slate-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Platform Growth Trends
              </CardTitle>
              <CardDescription className="text-slate-400">
                User registration and content creation over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!loading && timeSeriesData.length > 0 ? (
                <TrendChart
                  data={timeSeriesData}
                  dataKeys={['users', 'scenarios', 'characters']}
                  colors={['#22D3EE', '#10B981', '#8B5CF6']}
                  height={300}
                />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400">
                  {loading ? 'Loading...' : 'No data available'}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Quality Distribution */}
          <Card className="bg-slate-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-violet-400" />
                Content Status Distribution
              </CardTitle>
              <CardDescription className="text-slate-400">
                Breakdown of scenario and character statuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contentMetrics ? (
                <DistributionChart
                  data={[
                    { name: 'Active Scenarios', value: contentMetrics.activeScenarios, color: '#10B981' },
                    { name: 'Blocked Scenarios', value: contentMetrics.blockedScenarios, color: '#EF4444' },
                    { name: 'Total Likes', value: Math.floor(contentMetrics.totalLikes / 10), color: '#22D3EE' },
                    { name: 'Bookmarks', value: Math.floor(contentMetrics.totalBookmarks / 5), color: '#FACC15' }
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

        {/* Moderation Metrics */}
        {moderationMetrics && (
          <Card className="bg-slate-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                Moderation Overview
              </CardTitle>
              <CardDescription className="text-slate-400">
                Content violations and resolution metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ComparisonChart
                data={moderationMetrics.violationsByType}
                dataKeys={['count']}
                colors={['#FACC15']}
                height={250}
                xAxisKey="type"
              />
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-slate-400">
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className={`h-auto p-4 justify-start text-left ${action.bgColor} ${action.borderColor} border hover:bg-opacity-80`}
                    onClick={action.action}
                  >
                    <action.icon className={`w-6 h-6 ${action.color} mr-3`} />
                    <div>
                      <div className={`font-medium ${action.color}`}>{action.title}</div>
                      <div className="text-sm text-slate-400">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-cyan-400" />
                Analytics Dashboard
              </CardTitle>
              <CardDescription className="text-slate-400">
                Deep insights and detailed analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {analyticsActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className={`h-auto p-4 justify-start text-left ${action.bgColor} ${action.borderColor} border hover:bg-opacity-80`}
                    onClick={action.action}
                  >
                    <action.icon className={`w-6 h-6 ${action.color} mr-3`} />
                    <div>
                      <div className={`font-medium ${action.color}`}>{action.title}</div>
                      <div className="text-sm text-slate-400">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
