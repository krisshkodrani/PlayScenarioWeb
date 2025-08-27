import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Trophy, XCircle, Clock, Calendar, Target, Star, Trash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface GameInstance {
  id: string;
  scenario_id: string;
  status: string;
  current_turn: number;
  max_turns: number | null;
  started_at: string;
  ended_at: string | null;
  final_score: number | null;
  scenarios: {
    title: string;
    description: string;
  } | null;
}

interface GameInstanceCardProps {
  game: GameInstance;
  onContinue: (instanceId: string, scenarioId: string) => void;
  onViewResults: (instanceId: string) => void;
  onDelete?: (instanceId: string) => void;
}

const GameInstanceCard: React.FC<GameInstanceCardProps> = ({
  game,
  onContinue,
  onViewResults,
  onDelete
}) => {
  const handleConfirmDelete = () => {
    if (typeof onDelete === 'function') {
      onDelete(game.id);
    }
  };

  const getStatusBadge = () => {
    switch (game.status) {
      case 'playing':
        return <Badge className="bg-blue-500 text-white">In Progress</Badge>;
      case 'won':
        return <Badge className="bg-emerald-500 text-white">Won</Badge>;
      case 'lost':
        return <Badge className="bg-red-500 text-white">Lost</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500 text-white">Completed</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{game.status}</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (game.status) {
      case 'playing':
        return <Play className="w-4 h-4 text-blue-400" />;
      case 'won':
        return <Trophy className="w-4 h-4 text-emerald-400" />;
      case 'lost':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // Use 1-based display for turns and clamp to max
  const maxTurns = game.max_turns ?? 0;
  const displayTurn = maxTurns > 0 ? Math.min((game.current_turn ?? 0) + 1, maxTurns) : (game.current_turn ?? 0) + 1;

  const getProgressPercentage = () => {
    if (!maxTurns) return 0;
    return Math.min((displayTurn / maxTurns) * 100, 100);
  };

  const isInProgress = game.status === 'playing';
  const isCompleted = ['won', 'lost', 'completed'].includes(game.status);

  return (
    <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1 line-clamp-1">
                {game.scenarios?.title || 'Unknown Scenario'}
              </h3>
              <p className="text-sm text-slate-400 line-clamp-2">
                {game.scenarios?.description}
              </p>
            </div>
            {getStatusBadge()}
          </div>

          {/* Progress */}
          {maxTurns > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Progress</span>
                <span className="text-white">
                  {displayTurn}/{maxTurns} turns
                </span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                {formatDistanceToNow(new Date(game.started_at), { addSuffix: true })}
              </span>
            </div>
            
            {game.final_score && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                <span>{game.final_score} pts</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {isInProgress && (
              <>
                <Button
                  onClick={() => onContinue(game.id, game.scenario_id)}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                  size="sm"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Continue
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      aria-label="Delete in-progress game"
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this game?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove this in-progress game and its messages. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        type="button"
                        onClick={handleConfirmDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Confirm Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
            
            {isCompleted && (
              <Button
                onClick={() => onViewResults(game.id)}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                size="sm"
              >
                View Results
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameInstanceCard;
