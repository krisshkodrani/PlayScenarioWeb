
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GamepadIcon, FileText, Users } from 'lucide-react';

interface DashboardStatsProps {
  totalGamesPlayed: number;
  scenariosCreated: number;
  charactersCreated: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalGamesPlayed,
  scenariosCreated,
  charactersCreated
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
      title: 'Characters Created',
      value: charactersCreated,
      icon: Users,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
