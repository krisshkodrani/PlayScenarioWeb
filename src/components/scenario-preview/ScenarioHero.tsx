
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Target, Star } from 'lucide-react';
import { Scenario } from '@/types/scenario';

interface ScenarioHeroProps {
  scenario: Scenario;
}

const ScenarioHero: React.FC<ScenarioHeroProps> = ({ scenario }) => {
  const difficultyColors = {
    'Beginner': 'bg-emerald-500/20 text-emerald-400 border-emerald-500',
    'Intermediate': 'bg-amber-500/20 text-amber-400 border-amber-500',
    'Advanced': 'bg-red-500/20 text-red-400 border-red-500'
  };

  const categoryDisplay = scenario.category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <Card className="p-8 bg-gradient-to-br from-slate-800/90 to-slate-700/50 border-slate-600 backdrop-blur">
      <div className="space-y-6">
        {/* Title and Badges */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge 
              variant="outline" 
              className={difficultyColors[scenario.difficulty] || 'text-slate-400 border-slate-400'}
            >
              {scenario.difficulty}
            </Badge>
            <Badge variant="secondary" className="bg-violet-500/20 text-violet-400 border-violet-500">
              {categoryDisplay}
            </Badge>
            {scenario.average_rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium text-white">
                  {scenario.average_rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-white leading-tight">
            {scenario.title}
          </h1>
        </div>

        {/* Key Metadata */}
        <div className="flex flex-wrap items-center gap-6 text-slate-300">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span>{scenario.estimated_duration} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>{scenario.character_count} characters</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <span>{scenario.objectives.length} objectives</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-lg text-slate-200 leading-relaxed">
            {scenario.description}
          </p>
        </div>

        {/* Tags */}
        {scenario.tags && scenario.tags.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">
              Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {scenario.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-cyan-400 border-cyan-400/50 hover:bg-cyan-400/10 transition-colors"
                >
                  {tag.replace('-', ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ScenarioHero;
