
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Calendar, Target } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface InProgressGame {
  id: string;
  scenario_id: string;
  scenario_title: string;
  current_turn: number;
  max_turns: number | null;
  started_at: string;
  status: string;
}

interface InProgressGamesProps {
  games: InProgressGame[];
}

const InProgressGames: React.FC<InProgressGamesProps> = ({ games }) => {
  const navigate = useNavigate();

  const handleContinueGame = (instanceId: string, scenarioId: string) => {
    navigate(`/core-chat?instance=${instanceId}&scenario=${scenarioId}`);
  };

  const getProgressPercentage = (currentTurn: number, maxTurns: number | null) => {
    if (!maxTurns) return 0;
    return Math.min((currentTurn / maxTurns) * 100, 100);
  };

  if (games.length === 0) {
    return null;
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Play className="w-5 h-5 text-cyan-400" />
          Continue Playing
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.slice(0, 6).map((game) => (
            <div
              key={game.id}
              className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors"
            >
              <h4 className="font-medium text-white mb-2 line-clamp-1">
                {game.scenario_title}
              </h4>
              
              <div className="space-y-3">
                {/* Progress */}
                {game.max_turns && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Progress</span>
                      <span>{game.current_turn}/{game.max_turns} turns</span>
                    </div>
                    <Progress 
                      value={getProgressPercentage(game.current_turn, game.max_turns)}
                      className="h-2"
                    />
                  </div>
                )}
                
                {/* Last played */}
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {formatDistanceToNow(new Date(game.started_at), { addSuffix: true })}
                  </span>
                </div>
                
                {/* Continue button */}
                <Button
                  onClick={() => handleContinueGame(game.id, game.scenario_id)}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm py-2"
                  size="sm"
                >
                  Continue Playing
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {games.length > 6 && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/my-games')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              View All Games
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InProgressGames;
