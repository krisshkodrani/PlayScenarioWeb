
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Globe, 
  FileX, 
  Play, 
  Heart, 
  Star 
} from 'lucide-react';

interface ScenarioStats {
  totalScenarios: number;
  publishedScenarios: number;
  draftScenarios: number;
  totalPlays: number;
  totalLikes: number;
  averageRating: number;
}

interface ScenarioStatsCardsProps {
  stats: ScenarioStats;
}

const ScenarioStatsCards: React.FC<ScenarioStatsCardsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Scenarios',
      value: stats.totalScenarios,
      icon: FileText,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    },
    {
      title: 'Published',
      value: stats.publishedScenarios,
      icon: Globe,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: 'Drafts',
      value: stats.draftScenarios,
      icon: FileX,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10'
    },
    {
      title: 'Total Plays',
      value: stats.totalPlays.toLocaleString(),
      icon: Play,
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10'
    },
    {
      title: 'Total Likes',
      value: stats.totalLikes,
      icon: Heart,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10'
    },
    {
      title: 'Avg Rating',
      value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—',
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {statCards.map((stat) => (
        <Card key={stat.title} className="bg-slate-800 border-slate-700 hover:bg-slate-700/50 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-400 font-medium">{stat.title}</p>
                <p className="text-lg font-bold text-white truncate">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ScenarioStatsCards;
