
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  FileText, 
  Users 
} from 'lucide-react';

interface QuickActionsProps {
  onCreateScenario: () => void;
  onBrowseScenarios: () => void;
  onViewMyCharacters: () => void;
  onViewMyScenarios: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateScenario,
  onBrowseScenarios,
  onViewMyCharacters,
  onViewMyScenarios
}) => {
  const actions = [
    {
      title: 'Create Scenario',
      description: 'Build a new interactive scenario',
      icon: Plus,
      onClick: onCreateScenario,
      className: 'bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600'
    },
    {
      title: 'Browse Scenarios',
      description: 'Discover community content',
      icon: Search,
      onClick: onBrowseScenarios,
      className: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      title: 'My Scenarios',
      description: 'Manage your creations',
      icon: FileText,
      onClick: onViewMyScenarios,
      className: 'bg-violet-500 hover:bg-violet-600'
    },
    {
      title: 'My Characters',
      description: 'Manage your AI characters',
      icon: Users,
      onClick: onViewMyCharacters,
      className: 'bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600'
    }
  ];

  return (
    <Card className="bg-slate-800 border-slate-700 h-[320px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-full">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              className={`h-full p-4 flex flex-col items-center justify-center text-center min-h-[80px] ${action.className}`}
              variant="default"
            >
              <action.icon className="w-8 h-8 mb-3" />
              <div className="space-y-1">
                <div className="font-medium text-white text-sm">{action.title}</div>
                <div className="text-xs opacity-90 hidden lg:block">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
