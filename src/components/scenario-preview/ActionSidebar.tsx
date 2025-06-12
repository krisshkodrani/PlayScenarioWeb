
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Heart, Bookmark, Share, Star, Clock, Users, User, Coins } from 'lucide-react';
import { Scenario } from '@/types/scenario';

interface ActionSidebarProps {
  scenario: Scenario;
  userStats: {
    hasPlayed: boolean;
    isBookmarked: boolean;
    hasLiked: boolean;
    userCredits: number;
  };
  onStartPlaying: () => void;
  onBookmark: () => void;
  onLike: () => void;
}

const ActionSidebar: React.FC<ActionSidebarProps> = ({
  scenario,
  userStats,
  onStartPlaying,
  onBookmark,
  onLike
}) => {
  const creditCost = 5; // Mock credit cost

  const handleShare = async () => {
    try {
      await navigator.share({
        title: scenario.title,
        text: scenario.description,
        url: window.location.href
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-6">
      {/* Start Playing Card */}
      <Card className="bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border-cyan-500/30">
        <CardContent className="p-6 space-y-4">
          <Button 
            onClick={onStartPlaying}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-semibold py-3 h-auto"
            disabled={userStats.userCredits < creditCost}
          >
            <Play className="w-5 h-5 mr-2" />
            Start Playing
          </Button>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Cost: {creditCost} credits</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span>You have: {userStats.userCredits}</span>
            </div>
          </div>
          
          {userStats.userCredits < creditCost && (
            <p className="text-sm text-red-400 text-center">
              Insufficient credits to play this scenario
            </p>
          )}
        </CardContent>
      </Card>

      {/* Social Actions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onLike}
              className={`border-slate-600 hover:border-red-500 ${
                userStats.hasLiked ? 'text-red-400 border-red-500' : 'text-slate-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${userStats.hasLiked ? 'fill-red-400' : ''}`} />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onBookmark}
              className={`border-slate-600 hover:border-amber-500 ${
                userStats.isBookmarked ? 'text-amber-400 border-amber-500' : 'text-slate-400'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${userStats.isBookmarked ? 'fill-amber-400' : ''}`} />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300"
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Stats */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-slate-400">Scenario Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Times Played</span>
            <span className="text-cyan-400 font-semibold">{scenario.play_count.toLocaleString()}</span>
          </div>
          
          {scenario.average_rating && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Average Rating</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-amber-400 font-semibold">
                  {scenario.average_rating.toFixed(1)}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Created</span>
            <span className="text-slate-300 text-sm">
              {new Date(scenario.created_at).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Creator Info */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-slate-400">Created By</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-white">{scenario.created_by}</p>
              <p className="text-sm text-slate-400">Scenario Creator</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionSidebar;
