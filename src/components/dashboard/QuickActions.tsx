import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, FileText, Users, GamepadIcon, Plus, UserCheck } from 'lucide-react';

interface QuickActionsProps {
  onCreateScenario: () => void;
  onCreateCharacter: () => void;
  onBrowseScenarios: () => void;
  onViewMyCharacters: () => void;
  onViewMyScenarios: () => void;
  onViewMyGames: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateScenario,
  onCreateCharacter,
  onBrowseScenarios,
  onViewMyCharacters,
  onViewMyScenarios,
  onViewMyGames
}) => {
  // Primary actions that are highlighted
  const primaryActions = [
    {
      title: 'My Characters',
      description: 'View and manage your AI characters',
      icon: UserCheck,
      onClick: onViewMyCharacters,
      className: 'bg-gradient-to-r from-cyan-400 to-violet-500 hover:from-cyan-300 hover:to-violet-400 text-white shadow-lg shadow-cyan-400/30'
    },
    {
      title: 'Create Scenario',
      description: 'Build new interactive scenarios',
      icon: Plus,
      onClick: onCreateScenario,
      className: 'bg-gradient-to-r from-violet-500 to-cyan-400 hover:from-violet-400 hover:to-cyan-300 text-white shadow-lg shadow-violet-400/30'
    }
  ];

  // Secondary actions
  const secondaryActions = [
    {
      title: 'Create Character',
      description: 'Design new AI characters',
      icon: Users,
      onClick: onCreateCharacter,
      className: 'bg-amber-500 hover:bg-amber-600'
    },
    {
      title: 'Browse Scenarios',
      description: 'Discover community content',
      icon: Search,
      onClick: onBrowseScenarios,
      className: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      title: 'My Games',
      description: 'Continue playing or view history',
      icon: GamepadIcon,
      onClick: onViewMyGames,
      className: 'bg-cyan-500 hover:bg-cyan-600'
    },
    {
      title: 'My Scenarios',
      description: 'Manage your creations',
      icon: FileText,
      onClick: onViewMyScenarios,
      className: 'bg-violet-500 hover:bg-violet-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Primary Quick Actions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-cyan-400">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {primaryActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                className={`h-24 p-6 flex items-center gap-4 text-left justify-start ${action.className}`}
                variant="default"
              >
                <action.icon className="w-8 h-8 flex-shrink-0" />
                <div className="space-y-1">
                  <div className="font-semibold text-lg">{action.title}</div>
                  <div className="text-sm opacity-90">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Secondary Actions */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">More Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {secondaryActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                className={`h-20 p-4 flex flex-col items-center justify-center text-center ${action.className}`}
                variant="default"
              >
                <action.icon className="w-6 h-6 mb-2" />
                <div className="font-medium text-white text-sm">{action.title}</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActions;