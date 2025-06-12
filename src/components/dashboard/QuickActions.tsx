
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, User, FileText } from 'lucide-react';

interface QuickActionsProps {
  onCreateScenario: () => void;
  onBrowseScenarios: () => void;
  onViewProfile: () => void;
  onViewMyScenarios: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateScenario,
  onBrowseScenarios,
  onViewProfile,
  onViewMyScenarios
}) => {
  const actions = [
    {
      title: 'Create Scenario',
      description: 'Build a new interactive scenario',
      icon: Plus,
      onClick: onCreateScenario,
      color: 'bg-cyan-400 hover:bg-cyan-300 text-slate-900'
    },
    {
      title: 'Browse Scenarios',
      description: 'Explore community creations',
      icon: Search,
      onClick: onBrowseScenarios,
      color: 'bg-violet-400 hover:bg-violet-300 text-white'
    },
    {
      title: 'My Scenarios',
      description: 'Manage your creations',
      icon: FileText,
      onClick: onViewMyScenarios,
      color: 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
    },
    {
      title: 'View Profile',
      description: 'Update account settings',
      icon: User,
      onClick: onViewProfile,
      color: 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
    }
  ];

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              className={`w-full justify-start h-auto p-4 ${action.color}`}
              variant="secondary"
            >
              <div className="flex items-center gap-3">
                <action.icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs opacity-80">{action.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
