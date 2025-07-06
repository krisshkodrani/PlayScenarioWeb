
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GamepadIcon, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyGamesProps {
  hasAnyGames: boolean;
}

const EmptyGames: React.FC<EmptyGamesProps> = ({ hasAnyGames }) => {
  const navigate = useNavigate();

  if (!hasAnyGames) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="text-center py-12">
          <GamepadIcon className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Games Yet
          </h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            You haven't started playing any scenarios yet. Browse our collection and start your first adventure!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/browse')}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse Scenarios
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="text-center py-12">
        <Search className="w-16 h-16 text-slate-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          No Games Found
        </h3>
        <p className="text-slate-400 mb-6">
          No games match your current filters. Try adjusting your search criteria.
        </p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyGames;
