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
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-cyan-400" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <metric.icon className="w-5 h-5 text-cyan-400" />
                <span className="text-2xl font-bold text-white">{metric.value}</span>
              </div>
              <p className="text-sm text-slate-300">{metric.label}</p>
            </div>
          ))}
        </div>
        
        {results.final_score && (
          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="text-center">
              <p className="text-sm text-slate-300 mb-1">Performance Grade</p>
              <span className="text-3xl font-bold text-amber-400">
                {getPerformanceGrade(results.final_score)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default PerformanceMetrics;