import React from 'react';
import type { FeedbackResponse } from '@/types/feedback';

interface Props { feedback?: FeedbackResponse | null }

const SkillsTab: React.FC<Props> = ({ feedback }) => {
  const items = feedback?.feedback?.skills?.items ?? [];
  if (!items.length) return <div className="text-slate-400">No skill changes detected.</div>;

  return (
    <ul className="space-y-3">
      {items.map((s, idx) => (
        <li key={idx} className="p-3 bg-slate-800/60 rounded border border-slate-700">
          <div className="text-white font-medium">{s.name}</div>
          <div className="text-slate-400 text-xs">Δ {s.delta >= 0 ? '+' : ''}{s.delta}</div>
          {s.evidence && <div className="text-slate-300 text-sm mt-1">{s.evidence}</div>}
        </li>
      ))}
    </ul>
  );
};

export default SkillsTab;
