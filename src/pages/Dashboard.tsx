
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import PageHeader from '@/components/navigation/PageHeader';
import DashboardWelcome from '@/components/dashboard/DashboardWelcome';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';
import CreditStatusCard from '@/components/dashboard/CreditStatusCard';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import NewUserDashboard from '@/components/dashboard/NewUserDashboard';
import InProgressGames from '@/components/dashboard/InProgressGames';
import { useDashboardData } from '@/hooks/useDashboardData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { data, loading, error } = useDashboardData();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const headerActions = (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        onClick={() => navigate('/profile')}
        className="border-gray-600 text-slate-300 hover:bg-slate-700"
      >
        <User className="w-4 h-4 mr-2" />
        Profile
      </Button>
      <Button
        variant="outline"
        onClick={handleLogout}
        className="border-red-500 text-red-400 hover:bg-red-500/10 hover:text-red-300"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Unable to load dashboard</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-cyan-400 hover:bg-cyan-300 text-slate-900 px-6 py-2 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Check if user is new (no scenarios or games)
  const isNewUser = data.scenarios.length === 0 && data.gameInstances.length === 0;

  if (isNewUser) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <PageHeader
            title={`Welcome back, ${data.user.username}!`}
            subtitle="Let's get you started with your first AI scenario"
            actions={headerActions}
          />
          <NewUserDashboard />
        </div>
      </div>
    );
  }

  // Get in-progress games for the InProgressGames component
  const inProgressGames = data.gameInstances
    .filter(game => game.status === 'playing')
    .map(game => ({
      id: game.id,
      scenario_id: game.scenario_id,
      scenario_title: game.scenarios?.title || 'Unknown Scenario',
      current_turn: game.current_turn,
      max_turns: game.max_turns,
      started_at: game.started_at,
      status: game.status
    }));

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title={`Welcome back, ${data.user.username}!`}
          subtitle="Here's what's happening with your scenarios and games"
          actions={headerActions}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3 space-y-6">
            <DashboardStats 
              totalGamesPlayed={data.gameStats.total}
              scenariosCreated={data.scenarioStats.total}
              charactersCreated={data.characters?.length || 0}
            />
            <QuickActions 
              onCreateScenario={() => navigate('/create-scenario')}
              onBrowseScenarios={() => navigate('/browse')}
              onViewMyCharacters={() => navigate('/my-characters')}
              onViewMyScenarios={() => navigate('/my-scenarios')}
              onViewMyGames={() => navigate('/my-games')}
            />
          </div>
          <div>
            <CreditStatusCard 
              balance={data.credits.credits}
              recentTransactions={data.recentTransactions}
              onPurchaseCredits={() => navigate('/credits/purchase')}
            />
          </div>
        </div>

        {/* In Progress Games Section */}
        {inProgressGames.length > 0 && (
          <div className="mb-8">
            <InProgressGames games={inProgressGames} />
          </div>
        )}

        <div className="grid grid-cols-1">
          <RecentActivity activities={data.activityFeed} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
