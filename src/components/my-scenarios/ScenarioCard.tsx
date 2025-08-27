
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ScenarioActionMenu from './ScenarioActionMenu';
import { 
  Calendar, 
  Play, 
  Heart, 
  Users, 
  Clock,
  Edit,
  Eye,
  Image as ImageIcon
} from 'lucide-react';
import { Scenario } from '@/types/scenario';

interface ScenarioCardProps {
  scenario: Scenario;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onTogglePublic: (id: string, isPublic: boolean) => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  onEdit,
  onView,
  onDelete,
  onDuplicate,
  onTogglePublic
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const difficultyColors = {
    'Beginner': 'bg-emerald-500/20 text-emerald-400 border-emerald-500',
    'Intermediate': 'bg-amber-500/20 text-amber-400 border-amber-500',
    'Advanced': 'bg-red-500/20 text-red-400 border-red-500'
  };

  // Determine status based on database fields
  const getStatus = () => {
    if (scenario.is_public) return 'published';
    return 'private';
  };

  const status = getStatus();
  const statusColors = {
    published: 'bg-emerald-500/20 text-emerald-400 border-emerald-500',
    draft: 'bg-amber-500/20 text-amber-400 border-amber-500',
    private: 'bg-slate-500/20 text-slate-400 border-slate-500'
  };

  // Check if we should show difficulty and get the proper difficulty value
  const shouldShowDifficulty = (scenario as any).show_difficulty !== false; // Default to true if not set
  const scenarioDifficulty = (scenario as any).difficulty || scenario.difficulty;

  return (
    <Card className="bg-slate-800 border-slate-700 hover:bg-slate-700/50 transition-all duration-200 group overflow-hidden">
      {/* Featured Image */}
      {scenario.featured_image_url ? (
        <div className="aspect-[16/9] overflow-hidden">
          <img 
            src={scenario.featured_image_url} 
            alt={scenario.title}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-slate-700 flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-slate-500" />
        </div>
      )}
      
      <CardContent className="p-4">
        {/* Header with Status and Menu */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={statusColors[status]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            {shouldShowDifficulty && scenarioDifficulty && (
              <Badge 
                variant="outline" 
                className={difficultyColors[scenarioDifficulty as keyof typeof difficultyColors] || 'bg-slate-500/20 text-slate-400 border-slate-500'}
              >
                {scenarioDifficulty.charAt(0).toUpperCase() + scenarioDifficulty.slice(1)}
              </Badge>
            )}
          </div>
          <ScenarioActionMenu
            scenario={scenario}
            onEdit={() => onEdit(scenario.id)}
            onView={() => onView(scenario.id)}
            onDelete={() => onDelete(scenario.id)}
            onDuplicate={() => onDuplicate(scenario.id)}
            onTogglePublic={(isPublic) => onTogglePublic(scenario.id, isPublic)}
          />
        </div>

        {/* Title and Description */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
            {scenario.title}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-3">
            {scenario.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock className="w-4 h-4" />
            <span>{scenario.estimated_duration}m</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Users className="w-4 h-4" />
            <span>{scenario.character_count} chars</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Play className="w-4 h-4" />
            <span>{scenario.play_count} plays</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Heart className="w-4 h-4" />
            <span>{scenario.average_rating.toFixed(1)} rating</span>
          </div>
        </div>

        {/* Last Modified */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <Calendar className="w-3 h-3" />
          <span>Modified {formatDate(scenario.created_at)}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Button
            size="sm"
            onClick={() => onEdit(scenario.id)}
            className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-slate-900"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onView(scenario.id)}
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ScenarioCard;
