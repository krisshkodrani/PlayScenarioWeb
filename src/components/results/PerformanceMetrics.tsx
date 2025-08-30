import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Clock, Send, Target } from 'lucide-react';
import { GameResults, ConversationStats } from '@/services/resultsService';
interface PerformanceMetricsProps {
  results: GameResults;
  stats: ConversationStats;
}
const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  results,
  stats
}) => {
  const duration = results.ended_at && results.started_at ? Math.round((new Date(results.ended_at).getTime() - new Date(results.started_at).getTime()) / 60000) : null;
  const metrics = [{
    label: 'Turns Taken',
    value: results.current_turn,
    icon: MessageCircle
  }, {
    label: 'Duration',
    value: duration ? `${duration} min` : 'N/A',
    icon: Clock
  }, {
    label: 'Messages Sent',
    value: stats.playerMessages,
    icon: Send
  }, {
    label: 'Efficiency',
    value: results.max_turns ? `${Math.round(results.current_turn / results.max_turns * 100)}%` : 'N/A',
    icon: Target
  }];
  const getPerformanceGrade = (score: number | null) => {
    if (!score) return 'N/A';
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };
  return;
};
export default PerformanceMetrics;