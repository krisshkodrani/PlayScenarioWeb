import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain } from 'lucide-react';
import { resultsService, GameResults } from '@/services/resultsService';
import { feedbackService, FeedbackResponse } from '@/services/feedbackService';
import PageHeader from '@/components/navigation/PageHeader';
import HeaderObjectivesPanel from '@/components/results/HeaderObjectivesPanel';
import ActionButtons from '@/components/results/ActionButtons';
import LoadingResults from '@/components/results/LoadingResults';
import ResultsNotFound from '@/components/results/ResultsNotFound';
import SummaryCard from '@/components/feedback/SummaryCard';
import TimelineTab from '@/components/feedback/tabs/TimelineTab';
import RelationshipsTab from '@/components/feedback/tabs/RelationshipsTab';
import SkillsTab from '@/components/feedback/tabs/SkillsTab';
import AchievementsTab from '@/components/feedback/tabs/AchievementsTab';
import RecommendationsTab from '@/components/feedback/tabs/RecommendationsTab';
import WhatIfTab from '@/components/feedback/tabs/WhatIfTab';

const Results: React.FC = () => {
  const { instance_id } = useParams<{ instance_id: string }>();

  const [results, setResults] = useState<GameResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!instance_id || fetchedRef.current) return;
    fetchedRef.current = true;

    const loadResults = async () => {
      try {
        const gameResults = await resultsService.getGameResults(instance_id);
        setResults(gameResults);
      } catch (err) {
        console.error('Failed to load results:', err);
        setError(err instanceof Error ? err.message : 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    const cacheKey = `feedback:${instance_id}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as FeedbackResponse;
        if (parsed?.instance_id === instance_id) setFeedback(parsed);
      }
    } catch {}

    const loadDeepFeedback = async () => {
      if (!instance_id) return;
      setFeedbackLoading(true);
      setFeedbackError(null);
      try {
        const res = await feedbackService.getResults(instance_id, 'deep', false);
        setFeedback(res);
        try { localStorage.setItem(cacheKey, JSON.stringify(res)); } catch {}
      } catch (e: any) {
        console.error('Failed to load AI feedback:', e);
        setFeedbackError(e?.message || 'Failed to load AI feedback');
      } finally {
        setFeedbackLoading(false);
      }
    };

    loadResults();
    loadDeepFeedback();
  }, [instance_id]);

  const f = feedback?.feedback;
  const hasTimeline = (f?.key_events?.length ?? 0) > 0;
  const hasRelationships = (f?.relationships?.characters?.length ?? 0) > 0;
  const hasSkills = (f?.skills?.items?.length ?? 0) > 0;
  const hasAchievements = (f?.achievements?.length ?? 0) > 0;
  const hasRecommendations = (f?.suggestions?.next_attempt?.length ?? 0) > 0;
  const hasWhatIf = (f?.deep_dive?.alternative_paths?.length ?? 0) > 0;
  const tabsAvailable = hasTimeline || hasRelationships || hasSkills || hasAchievements || hasRecommendations || hasWhatIf;
  const firstTab = hasTimeline ? 'timeline' : hasRelationships ? 'relationships' : hasSkills ? 'skills' : hasAchievements ? 'achievements' : hasRecommendations ? 'recommendations' : hasWhatIf ? 'whatif' : 'timeline';

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
  if (error || !results) return <ResultsNotFound />;

  const customBreadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Game Results' }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title={results.scenario.title}
          subtitle={`${getOutcomeTitle()} — Results`}
          showBackButton={true}
          customBreadcrumbs={customBreadcrumbs}
        />

        <HeaderObjectivesPanel results={results} />

        <div className="my-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-white font-medium">
              <Brain className="w-5 h-5 text-cyan-400" />
              Deep Analysis
            </div>
          </div>

          <SummaryCard feedback={feedback} defaultTitle={`Summary — ${results.scenario.title}`} />
          {feedback?.generated_at && (
            <div className="text-xs text-slate-500 mb-2">
              Generated at {new Date(feedback.generated_at).toLocaleString()}
            </div>
          )}

          {feedbackLoading && <div className="text-slate-400 mb-4">Loading feedback…</div>}
          {feedbackError && <div className="text-red-400 mb-4">{feedbackError}</div>}

          {tabsAvailable ? (
            <Tabs defaultValue={firstTab} className="w-full">
              <TabsList className="bg-slate-800 border border-slate-700">
                {hasTimeline && <TabsTrigger value="timeline">Timeline</TabsTrigger>}
                {hasRelationships && <TabsTrigger value="relationships">Relationships</TabsTrigger>}
                {hasSkills && <TabsTrigger value="skills">Skills</TabsTrigger>}
                {hasAchievements && <TabsTrigger value="achievements">Achievements</TabsTrigger>}
                {hasRecommendations && <TabsTrigger value="recommendations">What to Try Next</TabsTrigger>}
                {hasWhatIf && <TabsTrigger value="whatif">What-If</TabsTrigger>}
              </TabsList>

              {hasTimeline && (
                <TabsContent value="timeline" className="mt-4">
                  <TimelineTab feedback={feedback} />
                </TabsContent>
              )}
              {hasRelationships && (
                <TabsContent value="relationships" className="mt-4">
                  <RelationshipsTab feedback={feedback} />
                </TabsContent>
              )}
              {hasSkills && (
                <TabsContent value="skills" className="mt-4">
                  <SkillsTab feedback={feedback} />
                </TabsContent>
              )}
              {hasAchievements && (
                <TabsContent value="achievements" className="mt-4">
                  <AchievementsTab feedback={feedback} />
                </TabsContent>
              )}
              {hasRecommendations && (
                <TabsContent value="recommendations" className="mt-4">
                  <RecommendationsTab feedback={feedback} />
                </TabsContent>
              )}
              {hasWhatIf && (
                <TabsContent value="whatif" className="mt-4">
                  <WhatIfTab feedback={feedback} />
                </TabsContent>
              )}
            </Tabs>
          ) : (
            <div className="text-slate-400">Deep analysis is being prepared; check back shortly.</div>
          )}
        </div>

        <ActionButtons
          scenarioId={results.scenario.id}
          instanceId={instance_id}
          status={results.status}
        />
      </div>
    </div>
  );
};
export default Results;