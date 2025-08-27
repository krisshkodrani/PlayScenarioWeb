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
  // All actions with consistent styling
  const actions = [
    {
      title: 'My Characters',
      icon: UserCheck,
      onClick: onViewMyCharacters,
      className: 'bg-cyan-500 hover:bg-cyan-600'
    },
    {
      title: 'Create Scenario',
      icon: Plus,
      onClick: onCreateScenario,
      className: 'bg-violet-500 hover:bg-violet-600'
    },
    {
      title: 'Create Character',
      icon: Users,
      onClick: onCreateCharacter,
      className: 'bg-amber-500 hover:bg-amber-600'
    },
    {
      title: 'Browse Scenarios',
      icon: Search,
      onClick: onBrowseScenarios,
      className: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      title: 'My Games',
      icon: GamepadIcon,
      onClick: onViewMyGames,
      className: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'My Scenarios',
      icon: FileText,
      onClick: onViewMyScenarios,
      className: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-cyan-400">Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              className={`h-20 p-4 flex flex-col items-center justify-center text-center transition-all duration-200 ${action.className}`}
              variant="default"
            >
              <action.icon className="w-6 h-6 mb-2" />
              <div className="font-medium text-white text-sm">{action.title}</div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;