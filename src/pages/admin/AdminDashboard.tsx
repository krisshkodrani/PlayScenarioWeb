import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, FileText, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PageHeader from '@/components/navigation/PageHeader';
import CharacterModeration from "./CharacterModeration";

interface DashboardStats {
  totalUsers: number;
  totalScenarios: number;
  blockedScenarios: number;
  recentActions: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalScenarios: 0,
    blockedScenarios: 0,
    recentActions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const [usersResult, scenariosResult, blockedScenariosResult, actionsResult] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('scenarios').select('id', { count: 'exact', head: true }),
          supabase.from('scenarios').select('id', { count: 'exact', head: true }).eq('status', 'blocked'),
          supabase.from('admin_actions').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        ]);

        setStats({
          totalUsers: usersResult.count || 0,
          totalScenarios: scenariosResult.count || 0,
          blockedScenarios: blockedScenariosResult.count || 0,
          recentActions: actionsResult.count || 0
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardStats();
  }, []);

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      action: () => navigate('/admin/users')
    },
    {
      title: 'Scenario Moderation',
      description: 'Review and moderate scenario content',
      icon: FileText,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      action: () => navigate('/admin/scenarios')
    },
    {
      title: 'Character Moderation',
      description: 'Review and moderate character content',
      icon: Shield,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      action: () => navigate('/admin/characters')
    },
    {
      title: 'Audit Trail',
      description: 'View admin action logs and history',
      icon: Activity,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      action: () => console.log('Audit trail - coming soon')
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="Admin Dashboard"
          subtitle="Manage and moderate your PlayScenarioAI platform"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Users</CardTitle>
              <Users className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {loading ? '...' : stats.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400">Registered accounts</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Scenarios</CardTitle>
              <FileText className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {loading ? '...' : stats.totalScenarios.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400">Created scenarios</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Blocked Content</CardTitle>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {loading ? '...' : stats.blockedScenarios.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400">Blocked scenarios</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Recent Actions</CardTitle>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {loading ? '...' : stats.recentActions.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400">Last 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-slate-400">
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={`h-auto p-4 justify-start text-left ${action.bgColor} ${action.borderColor} border hover:bg-opacity-80`}
                  onClick={action.action}
                >
                  <action.icon className={`w-6 h-6 ${action.color} mr-3`} />
                  <div>
                    <div className={`font-medium ${action.color}`}>{action.title}</div>
                    <div className="text-sm text-slate-400">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
