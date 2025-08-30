import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Trophy, XCircle, Clock, CheckCircle, Star, Brain } from 'lucide-react';
import { resultsService, GameResults, ConversationStats } from '@/services/resultsService';
import { feedbackService, FeedbackResponse, DetailLevel } from '@/services/feedbackService';
import PageHeader from '@/components/navigation/PageHeader';
import PerformanceMetrics from '@/components/results/PerformanceMetrics';
import HeaderObjectivesPanel from '@/components/results/HeaderObjectivesPanel';
import ActionButtons from '@/components/results/ActionButtons';
import LoadingResults from '@/components/results/LoadingResults';
import ResultsNotFound from '@/components/results/ResultsNotFound';

// New feedback components
import SummaryCard from '@/components/feedback/SummaryCard';
import TimelineTab from '@/components/feedback/tabs/TimelineTab';
import RelationshipsTab from '@/components/feedback/tabs/RelationshipsTab';
import SkillsTab from '@/components/feedback/tabs/SkillsTab';
import AchievementsTab from '@/components/feedback/tabs/AchievementsTab';
import RecommendationsTab from '@/components/feedback/tabs/RecommendationsTab';
import WhatIfTab from '@/components/feedback/tabs/WhatIfTab';
const Results: React.FC = () => {
  const {
    instance_id
  } = useParams<{
    instance_id: string;
  }>();
  const [results, setResults] = useState<GameResults | null>(null);
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Feedback state
  const [detail, setDetail] = useState<DetailLevel>('standard');
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  useEffect(() => {
    if (instance_id) {
      loadResults();
    }
  }, [instance_id]);
  useEffect(() => {
    if (instance_id) {
      loadFeedback(detail);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instance_id, detail]);
  const loadResults = async () => {
    if (!instance_id) {
      setError('No instance ID provided');
      setLoading(false);
      return;
    }
    try {
      const [gameResults, conversationStats] = await Promise.all([resultsService.getGameResults(instance_id), resultsService.getConversationStats(instance_id)]);
      setResults(gameResults);
      setStats(conversationStats);
    } catch (error) {
      console.error('Failed to load results:', error);
      setError(error instanceof Error ? error.message : 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };
  const loadFeedback = async (level: DetailLevel) => {
    if (!instance_id) return;
    setFeedbackLoading(true);
    setFeedbackError(null);
    try {
      const force = level === 'deep';
      const res = await feedbackService.getResults(instance_id, level, force);
      setFeedback(res);
      // Persist user preference
      try {
        localStorage.setItem('feedback_detail_level', level);
      } catch {}
    } catch (e: any) {
      console.error('Failed to load AI feedback:', e);
      setFeedbackError(e?.message || 'Failed to load AI feedback');
    } finally {
      setFeedbackLoading(false);
    }
  };

  // Restore saved detail level once on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('feedback_detail_level') as DetailLevel | null;
      if (saved && ['short', 'standard', 'deep'].includes(saved)) {
        setDetail(saved as DetailLevel);
      }
    } catch {}
  }, []);

  // Compute available feedback sections to show/hide tabs
  const f = feedback?.feedback;
  const hasTimeline = (f?.key_events?.length ?? 0) > 0;
  const hasRelationships = (f?.relationships?.characters?.length ?? 0) > 0;
  const hasSkills = (f?.skills?.items?.length ?? 0) > 0;
  const hasAchievements = (f?.achievements?.length ?? 0) > 0;
  const hasRecommendations = (f?.suggestions?.next_attempt?.length ?? 0) > 0;
  const hasWhatIf = (f?.deep_dive?.alternative_paths?.length ?? 0) > 0;
  const tabsAvailable = hasTimeline || hasRelationships || hasSkills || hasAchievements || hasRecommendations || hasWhatIf;
  const firstTab = hasTimeline ? 'timeline' : hasRelationships ? 'relationships' : hasSkills ? 'skills' : hasAchievements ? 'achievements' : hasRecommendations ? 'recommendations' : hasWhatIf ? 'whatif' : 'timeline';
  const getOutcomeIcon = () => {
    if (!results) return null;
    switch (results.status) {
      case 'won':
        return <Trophy className="w-16 h-16 text-emerald-400" />;
      case 'lost':
        return <XCircle className="w-16 h-16 text-red-400" />;
      case 'abandoned':
        return <Clock className="w-16 h-16 text-amber-400" />;
      default:
        return <CheckCircle className="w-16 h-16 text-cyan-400" />;
    }
  };
  const getOutcomeColor = () => {
    if (!results) return 'text-cyan-400';
    switch (results.status) {
      case 'won':
        return 'text-emerald-400';
      case 'lost':
        return 'text-red-400';
      case 'abandoned':
        return 'text-amber-400';
      default:
        return 'text-cyan-400';
    }
  };
  const getOutcomeTitle = () => {
    if (!results) return 'Completed';
    switch (results.status) {
      case 'won':
        return 'Victory!';
      case 'lost':
        return 'Defeat';
      case 'abandoned':
        return 'Incomplete';
      default:
        return 'Completed';
    }
  };
  if (loading) return <LoadingResults />;
  if (error || !results || !stats) return <ResultsNotFound />;

  // Custom breadcrumbs for results page
  const customBreadcrumbs = [{
    label: 'Dashboard',
    href: '/dashboard'
  }, {
    label: 'Game Results'
  }];
  return <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <PageHeader title={results.scenario.title} subtitle={`${getOutcomeTitle()} — Results`} showBackButton={true} customBreadcrumbs={customBreadcrumbs} />

        {/* Combined Header and Objectives */}
        <HeaderObjectivesPanel results={results} />

        {/* Performance Metrics */}
        <div className="mb-8">
          <PerformanceMetrics results={results} stats={stats} />
        </div>

        {/* Dynamic AI Feedback Section */}
        <div className="my-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-white font-medium">
              <Brain className="w-5 h-5 text-cyan-400" />
              AI Analysis
            </div>
            <div className="flex gap-2">
              {(['short', 'standard', 'deep'] as DetailLevel[]).map(lvl => <Button key={lvl} size="sm" variant={detail === lvl ? 'default' : 'secondary'} onClick={() => setDetail(lvl)}>
                  {lvl}
                </Button>)}
            </div>
          </div>

          {/* Summary card */}
          <SummaryCard feedback={feedback} defaultTitle={`Summary — ${results.scenario.title}`} />
           {feedback?.generated_at && <div className="text-xs text-slate-500 mb-2">Generated at {new Date(feedback.generated_at).toLocaleString()}</div>}

          {/* Feedback loading and error states */}
          {feedbackLoading && <div className="text-slate-400 mb-4">Loading feedback…</div>}
          {feedbackError && <div className="text-red-400 mb-4">{feedbackError}</div>}

          {/* Tabs */}
          {tabsAvailable ? <Tabs defaultValue={firstTab} className="w-full">
              <TabsList className="bg-slate-800 border border-slate-700">
                {hasTimeline && <TabsTrigger value="timeline">Timeline</TabsTrigger>}
                {hasRelationships && <TabsTrigger value="relationships">Relationships</TabsTrigger>}
                {hasSkills && <TabsTrigger value="skills">Skills</TabsTrigger>}
                {hasAchievements && <TabsTrigger value="achievements">Achievements</TabsTrigger>}
                {hasRecommendations && <TabsTrigger value="recommendations">What to Try Next</TabsTrigger>}
                {hasWhatIf && <TabsTrigger value="whatif">What-If</TabsTrigger>}
              </TabsList>

              {hasTimeline && <TabsContent value="timeline" className="mt-4">
                  <TimelineTab feedback={feedback} />
                </TabsContent>}
              {hasRelationships && <TabsContent value="relationships" className="mt-4">
                  <RelationshipsTab feedback={feedback} />
                </TabsContent>}
              {hasSkills && <TabsContent value="skills" className="mt-4">
                  <SkillsTab feedback={feedback} />
                </TabsContent>}
              {hasAchievements && <TabsContent value="achievements" className="mt-4">
                  <AchievementsTab feedback={feedback} />
                </TabsContent>}
              {hasRecommendations && <TabsContent value="recommendations" className="mt-4">
                  <RecommendationsTab feedback={feedback} />
                </TabsContent>}
              {hasWhatIf && <TabsContent value="whatif" className="mt-4">
                  <WhatIfTab feedback={feedback} />
                </TabsContent>}
            </Tabs> : <div className="text-slate-400">No detailed AI feedback sections available yet.</div>}
        </div>

        {/* Action Buttons */}
        <ActionButtons scenarioId={results.scenario.id} instanceId={instance_id} status={results.status} />
      </div>
    </div>;
};
export default Results;