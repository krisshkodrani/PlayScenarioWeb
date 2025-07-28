
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityItem } from '@/types/dashboard';
import { GamepadIcon, FileText, Heart, Coins, Clock } from 'lucide-react';

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'game_played':
        return GamepadIcon;
      case 'scenario_created':
        return FileText;
      case 'scenario_liked':
        return Heart;
      case 'credit_transaction':
        return Coins;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'game_played':
        return 'text-cyan-400';
      case 'scenario_created':
        return 'text-violet-400';
      case 'scenario_liked':
        return 'text-red-400';
      case 'credit_transaction':
        return 'text-emerald-400';
      default:
        return 'text-slate-400';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  if (activities.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No recent activity yet</p>
            <p className="text-sm text-slate-500 mt-2">
              Start playing scenarios or creating content to see your activity here!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const color = getActivityColor(activity.type);
            
            return (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors">
                <div className={`p-2 rounded-lg bg-slate-600 ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm">{activity.title}</p>
                  <p className="text-slate-400 text-xs mt-1">{activity.description}</p>
                  <p className="text-slate-500 text-xs mt-1">{formatTime(activity.timestamp)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
