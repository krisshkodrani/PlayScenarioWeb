
import { Play, Heart, Bookmark, Users, Clock, Star, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Scenario } from '@/types/scenario';
import { SCENARIO_CATEGORIES } from '@/data/scenarioCategories';

interface ScenarioCardProps {
  scenario: Scenario;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onLike, onBookmark }) => {
  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': 
        return 'bg-gradient-to-r from-emerald-400/20 to-violet-500/20 border border-emerald-400 text-emerald-400';
      case 'Intermediate': 
        return 'bg-gradient-to-r from-amber-400/20 to-violet-500/20 border border-amber-400 text-amber-400';
      case 'Advanced': 
        return 'bg-gradient-to-r from-red-400/20 to-violet-500/20 border border-red-400 text-red-400';
      default: 
        return 'bg-slate-600 text-slate-300';
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return SCENARIO_CATEGORIES.find(cat => cat.id === categoryId) || SCENARIO_CATEGORIES[0];
  };

  const categoryInfo = getCategoryInfo(scenario.category);

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/50 backdrop-blur border border-slate-600 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300 group">
      {/* Header with category badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{categoryInfo.icon}</span>
            <span className="text-xs px-2 py-1 bg-gradient-to-r from-cyan-400/20 to-violet-500/20 border border-cyan-400 rounded-full text-cyan-400 font-medium">
              {categoryInfo.name}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
            {scenario.title}
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {scenario.description}
          </p>
        </div>
        <div className="flex gap-1 ml-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-400"
            onClick={() => onLike(scenario.id)}
          >
            <Heart className={`w-4 h-4 ${scenario.is_liked ? 'fill-red-400 text-red-400' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-amber-400"
            onClick={() => onBookmark(scenario.id)}
          >
            <Bookmark className={`w-4 h-4 ${scenario.is_bookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Key Differentiator: Character Count & Roles */}
      <div className="mb-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-semibold text-violet-400">
            {scenario.character_count} AI Characters
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {scenario.characters.map(char => (
            <div key={char.id} className="flex items-center gap-1 text-xs bg-slate-800/50 rounded px-2 py-1">
              <div className={`w-2 h-2 rounded-full ${char.avatar_color}`} />
              <span className="text-slate-300">{char.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Metadata with gradients */}
      <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {scenario.estimated_duration} min
        </div>
        <div className="flex items-center gap-1">
          <Target className="w-3 h-3" />
          {scenario.objectives.length} objectives
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400" />
          {scenario.average_rating}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {scenario.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs px-2 py-1 bg-slate-600/50 rounded text-slate-400">
            {tag}
          </span>
        ))}
        {scenario.tags.length > 3 && (
          <span className="text-xs px-2 py-1 bg-slate-600/50 rounded text-slate-400">
            +{scenario.tags.length - 3} more
          </span>
        )}
      </div>

      {/* Footer with difficulty and start button */}
      <div className="flex items-center justify-between">
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getDifficultyStyles(scenario.difficulty)}`}>
          {scenario.difficulty}
        </span>
        
        {/* Start Conversation Button */}
        <button className="bg-gradient-to-r from-cyan-400 to-violet-500 text-white px-4 py-2 rounded-lg font-medium hover:from-cyan-300 hover:to-violet-400 transition-all shadow-lg flex items-center">
          <Play className="w-4 h-4 mr-2" />
          Start Conversation
        </button>
      </div>

      {/* Creator and play count */}
      <div className="mt-3 pt-3 border-t border-slate-600 text-xs text-slate-500">
        <div className="flex justify-between">
          <span>by {scenario.created_by}</span>
          <span>{scenario.play_count.toLocaleString()} plays</span>
        </div>
      </div>
    </div>
  );
};

export default ScenarioCard;
