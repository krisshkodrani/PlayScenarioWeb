
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, XCircle, Clock, CheckCircle, Star } from 'lucide-react';
import { resultsService, GameResults, ConversationStats } from '@/services/resultsService';
import PageHeader from '@/components/navigation/PageHeader';
import ObjectivesBreakdown from '@/components/results/ObjectivesBreakdown';
import PerformanceMetrics from '@/components/results/PerformanceMetrics';
import AIFeedback from '@/components/results/AIFeedback';
import ActionButtons from '@/components/results/ActionButtons';
import LoadingResults from '@/components/results/LoadingResults';
import ResultsNotFound from '@/components/results/ResultsNotFound';

const Results: React.FC = () => {
  const { instance_id } = useParams<{ instance_id: string }>();
  const [results, setResults] = useState<GameResults | null>(null);
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (instance_id) {
      loadResults();
    }
  }, [instance_id]);

  const loadResults = async () => {
    if (!instance_id) {
      setError('No instance ID provided');
      setLoading(false);
      return;
    }

    try {
      const [gameResults, conversationStats] = await Promise.all([
        resultsService.getGameResults(instance_id),
        resultsService.getConversationStats(instance_id)
      ]);
      setResults(gameResults);
      setStats(conversationStats);
    } catch (error) {
      console.error('Failed to load results:', error);
      setError(error instanceof Error ? error.message : 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const getOutcomeIcon = () => {
    if (!results) return null;
    
    switch (results.status) {
      case 'won': return <Trophy className="w-16 h-16 text-emerald-400" />;
      case 'lost': return <XCircle className="w-16 h-16 text-red-400" />;
      case 'abandoned': return <Clock className="w-16 h-16 text-amber-400" />;
      default: return <CheckCircle className="w-16 h-16 text-cyan-400" />;
    }
  };

  const getOutcomeColor = () => {
    if (!results) return 'text-cyan-400';
    
    switch (results.status) {
      case 'won': return 'text-emerald-400';
      case 'lost': return 'text-red-400';
      case 'abandoned': return 'text-amber-400';
      default: return 'text-cyan-400';
    }
  };

  const getOutcomeTitle = () => {
    if (!results) return 'Completed';
    
    switch (results.status) {
      case 'won': return 'Victory!';
      case 'lost': return 'Defeat';
      case 'abandoned': return 'Incomplete';
      default: return 'Completed';
    }
  };

  if (loading) return <LoadingResults />;
  if (error || !results || !stats) return <ResultsNotFound />;

  // Custom breadcrumbs for results page
  const customBreadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Game Results' }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Game Results"
          subtitle={`Results for scenario: ${results.scenario.title}`}
          showBackButton={true}
          customBreadcrumbs={customBreadcrumbs}
        />

        {/* Outcome Header */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardContent className="text-center py-12">
            {getOutcomeIcon()}
            <h1 className={`text-4xl font-bold ${getOutcomeColor()} mt-4 mb-2`}>
              {getOutcomeTitle()}
            </h1>
            <h2 className="text-2xl text-white mb-4">{results.scenario.title}</h2>
            
            {results.final_score && (
              <div className="inline-flex items-center space-x-2 bg-slate-700 px-6 py-3 rounded-lg">
                <Star className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl font-bold text-yellow-400">{results.final_score}</span>
                <span className="text-slate-300">points</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Objectives Breakdown */}
          <ObjectivesBreakdown 
            objectives={results.scenario.objectives}
            progress={results.objectives_progress}
            status={results.status}
          />

          {/* Performance Metrics */}
          <PerformanceMetrics 
            results={results}
            stats={stats}
          />
        </div>

        {/* AI Feedback Section */}
        <AIFeedback 
          completionReason={results.completion_reason}
          status={results.status}
          objectives={results.objectives_progress}
        />

        {/* Action Buttons */}
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
