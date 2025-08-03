import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, Users, Heart, Bookmark, Eye } from 'lucide-react';
import PageHeader from '@/components/navigation/PageHeader';
import MetricCard from '@/components/admin/MetricCard';
import TrendChart from '@/components/admin/charts/TrendChart';
import DistributionChart from '@/components/admin/charts/DistributionChart';
import ComparisonChart from '@/components/admin/charts/ComparisonChart';
import TimePeriodSelector from '@/components/admin/TimePeriodSelector';
import { adminAnalyticsService, ContentQualityMetrics, TimeSeriesData } from '@/services/admin/adminAnalyticsService';
import { supabase } from '@/integrations/supabase/client';

interface ContentStats {
  totalScenarios: number;
  totalCharacters: number;
  activeContent: number;
  topCreators: number;
}

interface PopularContent {
  title: string;
  type: 'scenario' | 'character';
  plays: number;
  likes: number;
  creator: string;
}

const ContentAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [contentStats, setContentStats] = useState<ContentStats>({
    totalScenarios: 0,
    totalCharacters: 0,
    activeContent: 0,
    topCreators: 0
  });
  const [contentMetrics, setContentMetrics] = useState<ContentQualityMetrics | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [popularContent, setPopularContent] = useState<PopularContent[]>([]);

  useEffect(() => {
    const loadContentAnalytics = async () => {
      try {
        setLoading(true);
        
        // Load basic content stats
        const [scenariosResult, charactersResult, activeResult, creatorsResult] = await Promise.all([
          supabase.from('scenarios').select('id', { count: 'exact', head: true }),
          supabase.from('characters').select('id', { count: 'exact', head: true }),
          supabase.from('scenarios').select('id', { count: 'exact', head: true }).eq('status', 'active'),
          supabase.from('scenarios').select('creator_id').neq('creator_id', null)
        ]);

        const uniqueCreators = new Set(creatorsResult.data?.map(s => s.creator_id) || []).size;

        setContentStats({
          totalScenarios: scenariosResult.count || 0,
          totalCharacters: charactersResult.count || 0,
          activeContent: activeResult.count || 0,
          topCreators: uniqueCreators
        });

        // Load analytics data
        const [contentQuality, timeSeries] = await Promise.all([
          adminAnalyticsService.getContentQualityMetrics(),
          adminAnalyticsService.getTimeSeriesData(getDaysFromPeriod(selectedPeriod))
        ]);

        setContentMetrics(contentQuality);
        setTimeSeriesData(timeSeries);

        // Load popular content
        const popularScenariosResult = await supabase
          .from('scenarios')
          .select('title, play_count, like_count, creator_id')
          .eq('status', 'active')
          .order('play_count', { ascending: false })
          .limit(5);

        if (popularScenariosResult.data) {
          const popular: PopularContent[] = popularScenariosResult.data.map(scenario => ({
            title: scenario.title,
            type: 'scenario' as const,
            plays: scenario.play_count || 0,
            likes: scenario.like_count || 0,
            creator: scenario.creator_id || 'Unknown'
          }));
          setPopularContent(popular);
        }

      } catch (error) {
        console.error('Error loading content analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContentAnalytics();
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
          title="Content Analytics"
          subtitle="Deep insights into scenario and character creation, performance, and quality"
          actions={
            <TimePeriodSelector
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
          }
        />

        {/* Content Overview Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Scenarios"
            value={contentStats.totalScenarios}
            icon={FileText}
            iconColor="text-cyan-400"
            iconBgColor="bg-cyan-500/10"
          />
          <MetricCard
            title="Total Characters"
            value={contentStats.totalCharacters}
            icon={Users}
            iconColor="text-violet-400"
            iconBgColor="bg-violet-500/10"
          />
          <MetricCard
            title="Active Content"
            value={contentStats.activeContent}
            icon={TrendingUp}
            iconColor="text-emerald-400"
            iconBgColor="bg-emerald-500/10"
          />
          <MetricCard
            title="Active Creators"
            value={contentStats.topCreators}
            icon={Users}
            iconColor="text-amber-400"
            iconBgColor="bg-amber-500/10"
          />
        </div>

        {/* Content Creation Trends & Quality Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Creation Trends */}
          <Card className="bg-slate-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Content Creation Trends
              </CardTitle>
              <CardDescription className="text-slate-400">
                Scenario and character creation over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!loading && timeSeriesData.length > 0 ? (
                <TrendChart
                  data={timeSeriesData}
                  dataKeys={['scenarios', 'characters']}
                  colors={['#22D3EE', '#8B5CF6']}
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
                <Heart className="w-5 h-5 text-red-400" />
                Content Engagement
              </CardTitle>
              <CardDescription className="text-slate-400">
                Likes, bookmarks, and engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contentMetrics ? (
                <DistributionChart
                  data={[
                    { name: 'Total Likes', value: contentMetrics.totalLikes, color: '#EF4444' },
                    { name: 'Bookmarks', value: contentMetrics.totalBookmarks, color: '#FACC15' },
                    { name: 'High Rating', value: 85, color: '#10B981' }
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

        {/* Popular Content & Creator Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Content */}
          <Card className="bg-slate-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-400" />
                Most Popular Content
              </CardTitle>
              <CardDescription className="text-slate-400">
                Top-performing scenarios by engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {popularContent.length > 0 ? (
                popularContent.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-white font-medium truncate">{content.title}</h4>
                      <p className="text-sm text-slate-400 capitalize">{content.type}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-emerald-400">
                        <Eye className="w-4 h-4" />
                        {content.plays}
                      </div>
                      <div className="flex items-center gap-1 text-red-400">
                        <Heart className="w-4 h-4" />
                        {content.likes}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 py-8">
                  No popular content data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Status Breakdown */}
          <Card className="bg-slate-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-400" />
                Content Status Overview
              </CardTitle>
              <CardDescription className="text-slate-400">
                Active vs blocked content breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contentMetrics ? (
                <ComparisonChart
                  data={[
                    {
                      name: 'Content Status',
                      active: contentMetrics.activeScenarios,
                      blocked: contentMetrics.blockedScenarios
                    }
                  ]}
                  dataKeys={['active', 'blocked']}
                  colors={['#10B981', '#EF4444']}
                  height={250}
                />
              ) : (
                <div className="h-[250px] flex items-center justify-center text-slate-400">
                  {loading ? 'Loading...' : 'No data available'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContentAnalytics;