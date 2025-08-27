import React from 'react';
import type { FeedbackResponse } from '@/types/feedback';

interface Props { feedback?: FeedbackResponse | null }

const RelationshipsTab: React.FC<Props> = ({ feedback }) => {
  const chars = feedback?.feedback?.relationships?.characters ?? [];
  if (!chars.length) return <div className="text-slate-400">No relationship changes detected.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {chars.map((c, idx) => (
        <div key={idx} className="p-4 bg-slate-800/60 rounded border border-slate-700">
          <div className="text-white font-semibold">{c.name}</div>
          {typeof c.delta?.trust === 'number' && (
            <div className="text-xs text-slate-400 mt-1">Trust Δ {c.delta.trust >= 0 ? '+' : ''}{c.delta.trust}</div>
          )}
          {c.reflection && <div className="text-slate-300 text-sm mt-2">{c.reflection}</div>}
        </div>
      ))}
    </div>
  );
};

export default RelationshipsTab;
