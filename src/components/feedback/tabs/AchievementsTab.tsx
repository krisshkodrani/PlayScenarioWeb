import React from 'react';
import type { FeedbackResponse } from '@/types/feedback';

interface Props { feedback?: FeedbackResponse | null }

const AchievementsTab: React.FC<Props> = ({ feedback }) => {
  const achievements = feedback?.feedback?.achievements ?? [];
  if (!achievements.length) return <div className="text-slate-400">No achievements unlocked yet.</div>;

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {achievements.map((a, idx) => (
        <li key={idx} className="p-4 bg-slate-800/60 rounded border border-slate-700">
          <div className="text-white font-semibold">{a.name || a.code}</div>
          {a.why && <div className="text-slate-300 text-sm mt-1">{a.why}</div>}
          {a.tier && <div className="text-slate-400 text-xs mt-1">Tier {a.tier}</div>}
        </li>
      ))}
    </ul>
  );
};

export default AchievementsTab;
