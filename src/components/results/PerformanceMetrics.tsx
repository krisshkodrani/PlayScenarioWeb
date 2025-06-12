
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Clock, Send, Target } from 'lucide-react';
import { GameResults, ConversationStats } from '@/services/resultsService';

interface PerformanceMetricsProps {
  results: GameResults;
  stats: ConversationStats;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ results, stats }) => {
  const duration = results.ended_at && results.started_at
    ? Math.round((new Date(results.ended_at).getTime() - new Date(results.started_at).getTime()) / 60000)
    : null;

  const metrics = [
    { label: 'Turns Taken', value: results.current_turn, icon: MessageCircle },
    { label: 'Duration', value: duration ? `${duration} min` : 'N/A', icon: Clock },
    { label: 'Messages Sent', value: stats.playerMessages, icon: Send },
    { label: 'Efficiency', value: results.max_turns ? `${Math.round((results.current_turn / results.max_turns) * 100)}%` : 'N/A', icon: Target }
  ];

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
        <CardTitle className="text-white">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center p-4 bg-slate-700 rounded-lg">
              <metric.icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{metric.value}</div>
              <div className="text-sm text-slate-400">{metric.label}</div>
            </div>
          ))}
        </div>

        {/* Performance Grade */}
        <div className="mt-6 p-4 bg-slate-700 rounded-lg text-center">
          <h4 className="text-white font-medium mb-2">Performance Grade</h4>
          <div className="text-4xl font-bold text-cyan-400">
            {getPerformanceGrade(results.final_score)}
          </div>
          {results.final_score && (
            <div className="text-sm text-slate-400 mt-1">
              {results.final_score} points
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
