import React from 'react';
import type { FeedbackResponse } from '@/types/feedback';

interface Props { feedback?: FeedbackResponse | null }

const WhatIfTab: React.FC<Props> = ({ feedback }) => {
  const paths = feedback?.feedback?.deep_dive?.alternative_paths ?? [];
  if (!paths.length) return <div className="text-slate-400">Branch teasers will appear here when available.</div>;

  return (
    <ul className="space-y-2">
      {paths.map((p, idx) => (
        <li key={idx} className="p-3 bg-slate-800/60 rounded border border-slate-700">
          <div className="text-white">{p.path}</div>
          {p.likely_outcome && <div className="text-slate-400 text-sm">Likely: {p.likely_outcome}</div>}
        </li>
      ))}
    </ul>
  );
};

export default WhatIfTab;
