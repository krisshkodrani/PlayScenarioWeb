import React from 'react';
import type { FeedbackResponse } from '@/types/feedback';

interface Props { feedback?: FeedbackResponse | null }

const TimelineTab: React.FC<Props> = ({ feedback }) => {
  const events = feedback?.feedback?.key_events ?? [];
  if (!events.length) return <div className="text-slate-400">No key moments captured yet.</div>;

  return (
    <ol className="space-y-3">
      {events.map((e, idx) => (
        <li key={idx} className="p-3 bg-slate-800/60 rounded border border-slate-700">
          <div className="text-slate-400 text-xs mb-1">Turn {e.turn}</div>
          <div className="text-white font-medium">{e.title}</div>
          <div className="text-slate-300 text-sm">{e.consequence}</div>
        </li>
      ))}
    </ol>
  );
};

export default TimelineTab;
