
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, GamepadIcon, FileText, Coins, Trophy, Heart } from 'lucide-react';

interface DashboardStatsProps {
  totalGamesPlayed: number;
  scenariosCreated: number;
  creditsRemaining: number;
  winRate: number;
  totalLikesReceived?: number;
  totalBookmarksReceived?: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalGamesPlayed,
  scenariosCreated,
  creditsRemaining,
  winRate,
  totalLikesReceived = 0,
  totalBookmarksReceived = 0
}) => {
  const stats = [
    {
      title: 'Games Played',
      value: totalGamesPlayed,
      icon: GamepadIcon,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10'
    },
    {
      title: 'Scenarios Created',
      value: scenariosCreated,
      icon: FileText,
      color: 'text-violet-400',
      bgColor: 'bg-violet-400/10'
    },
    {
      title: 'Credits',
      value: creditsRemaining,
      icon: Coins,
      color: creditsRemaining < 10 ? 'text-amber-400' : 'text-emerald-400',
      bgColor: creditsRemaining < 10 ? 'bg-amber-400/10' : 'bg-emerald-400/10'
    },
    {
      title: 'Win Rate',
      value: `${winRate}%`,
      icon: Trophy,
      color: winRate >= 60 ? 'text-emerald-400' : winRate >= 40 ? 'text-amber-400' : 'text-slate-400',
      bgColor: winRate >= 60 ? 'bg-emerald-400/10' : winRate >= 40 ? 'bg-amber-400/10' : 'bg-slate-400/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-slate-800 border-slate-700 hover:bg-slate-800/80 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-300">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
