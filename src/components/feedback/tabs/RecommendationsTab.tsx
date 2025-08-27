import React from 'react';
import type { FeedbackResponse } from '@/types/feedback';

interface Props { feedback?: FeedbackResponse | null }

const RecommendationsTab: React.FC<Props> = ({ feedback }) => {
  const next = feedback?.feedback?.suggestions?.next_attempt ?? [];
  if (!next.length) return <div className="text-slate-400">No recommendations yet.</div>;

  return (
    <ul className="list-disc list-inside text-slate-300 space-y-2">
      {next.map((s, idx) => (
        <li key={idx}>
          <span className="text-white">{s.strategy}</span>
          {s.when_to_use && <span className="text-slate-400"> — {s.when_to_use}</span>}
          {s.rationale && <div className="text-slate-400 text-xs mt-1">{s.rationale}</div>}
        </li>
      ))}
    </ul>
  );
};

export default RecommendationsTab;
