
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  Eye
} from 'lucide-react';
import { Scenario } from '@/types/scenario';

interface ScenarioListItemProps {
  scenario: Scenario;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onTogglePublic: (id: string, isPublic: boolean) => void;
}

const ScenarioListItem: React.FC<ScenarioListItemProps> = ({
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

  // Mock status based on play count for demo
  const getStatus = () => {
    if (scenario.play_count > 0) return 'published';
    return Math.random() > 0.5 ? 'draft' : 'private';
  };

  const status = getStatus();
  const statusColors = {
    published: 'bg-emerald-500/20 text-emerald-400 border-emerald-500',
    draft: 'bg-amber-500/20 text-amber-400 border-amber-500',
    private: 'bg-slate-500/20 text-slate-400 border-slate-500'
  };

  return (
    <Card className="bg-slate-800 border-slate-700 hover:bg-slate-700/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left section - Title and metadata */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-white truncate">
                {scenario.title}
              </h3>
              <Badge 
                variant="outline" 
                className={statusColors[status]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
              <Badge 
                variant="outline" 
                className={difficultyColors[scenario.difficulty]}
              >
                {scenario.difficulty}
              </Badge>
            </div>
            <p className="text-sm text-slate-400 line-clamp-2 mb-3">
              {scenario.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Modified {formatDate(scenario.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{scenario.estimated_duration}m</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{scenario.character_count} chars</span>
              </div>
            </div>
          </div>

          {/* Middle section - Stats */}
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              <span>{scenario.play_count}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span>{scenario.average_rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => onEdit(scenario.id)}
              className="bg-cyan-500 hover:bg-cyan-600 text-slate-900"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView(scenario.id)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <ScenarioActionMenu
              scenario={scenario}
              onEdit={() => onEdit(scenario.id)}
              onView={() => onView(scenario.id)}
              onDelete={() => onDelete(scenario.id)}
              onDuplicate={() => onDuplicate(scenario.id)}
              onTogglePublic={(isPublic) => onTogglePublic(scenario.id, isPublic)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioListItem;
