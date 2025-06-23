
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Activity, Trophy, Star } from 'lucide-react';
import { CharacterStats } from '@/types/character';

interface CharacterStatsCardsProps {
  stats: CharacterStats;
}

const CharacterStatsCards: React.FC<CharacterStatsCardsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Characters',
      value: stats.totalCharacters.toString(),
      icon: Users,
      description: 'Characters created',
      color: 'text-cyan-400'
    },
    {
      title: 'Active Characters',
      value: stats.activeCharacters.toString(),
      icon: Activity,
      description: 'Used in scenarios',
      color: 'text-emerald-400'
    },
    {
      title: 'Most Used',
      value: stats.mostUsedCharacter,
      icon: Trophy,
      description: 'Top performing character',
      color: 'text-amber-400'
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      description: 'Overall quality score',
      color: 'text-violet-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="bg-slate-800 border-slate-700">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">{stat.title}</p>
                <p className="text-lg font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.description}</p>
              </div>
              <div className={`p-2 rounded-lg bg-slate-700 ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CharacterStatsCards;
