import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { FeedbackResponse } from '@/types/feedback';

function endingScore(type?: string): number {
  switch (type) {
    case 'success': return 90;
    case 'mixed': return 60;
    case 'setback': return 30;
    case 'open':
    default: return 50;
  }
}

interface Props { feedback?: FeedbackResponse | null; defaultTitle?: string }

const SummaryCard: React.FC<Props> = ({ feedback, defaultTitle }) => {
  const summary = feedback?.feedback?.summary;
  const title = summary?.title ?? defaultTitle ?? 'Scenario Summary';
  const narrative = summary?.narrative ?? 'Summary will appear here once available.';
  const score = endingScore(summary?.ending_type);

  return (
    <Card className="bg-slate-800 border-slate-700 mb-6">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-slate-300 leading-relaxed">{narrative}</div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 text-sm">Outcome signal</span>
            <span className="text-slate-200 text-sm">{summary?.ending_type ?? 'open'}</span>
          </div>
          <Progress value={score} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
