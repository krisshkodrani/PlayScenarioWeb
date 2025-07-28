import React from 'react';
import { Star } from 'lucide-react';

interface MetricsDisplayProps {
  metrics: {
    authenticity: number;
    relevance: number;
    engagement: number;
    consistency: number;
  };
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics }) => {
  const averageScore = (metrics.authenticity + metrics.relevance + metrics.engagement + metrics.consistency) / 4;
  
  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-2.5 h-2.5 ${
          index < score ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
        }`}
      />
    ));
  };

  return (
    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
      <div className="flex items-center gap-0.5">
        {renderStars(Math.round(averageScore))}
      </div>
      <span className="text-xs text-slate-400 ml-1">
        {averageScore.toFixed(1)}
      </span>
    </div>
  );
};

export default MetricsDisplay;