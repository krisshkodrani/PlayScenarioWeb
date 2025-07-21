import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, FileText, Shield, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminStats {
  totalUsers: number;
  totalScenarios: number;
  totalCharacters: number;
  blockedScenarios: number;
  blockedCharacters: number;
  recentActions: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalScenarios: 0,
    totalCharacters: 0,
    blockedScenarios: 0,
    blockedCharacters: 0,
    recentActions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch scenario stats
      const { count: scenarioCount } = await supabase
        .from('scenarios')
        .select('*', { count: 'exact', head: true });

      const { count: blockedScenarios } = await supabase
        .from('scenarios')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'blocked');

      // Fetch character stats
      const { count: characterCount } = await supabase
        .from('scenario_characters')
        .select('*', { count: 'exact', head: true });

      const { count: blockedCharacters } = await supabase
        .from('scenario_characters')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'blocked');

      // Fetch recent admin actions (last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { count: recentActions } = await supabase
        .from('admin_actions')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday.toISOString());

      setStats({
        totalUsers: userCount || 0,
        totalScenarios: scenarioCount || 0,
        totalCharacters: characterCount || 0,
        blockedScenarios: blockedScenarios || 0,
        blockedCharacters: blockedCharacters || 0,
        recentActions: recentActions || 0,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Monitor platform activity and manage content</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Users</CardTitle>
              <Users className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
              <p className="text-xs text-slate-400">Registered accounts</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Scenarios</CardTitle>
              <FileText className="h-4 w-4 text-violet-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalScenarios}</div>
              <p className="text-xs text-slate-400">Created scenarios</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Characters</CardTitle>
              <Users className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalCharacters}</div>
              <p className="text-xs text-slate-400">AI characters created</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Blocked Content</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.blockedScenarios + stats.blockedCharacters}
              </div>
              <p className="text-xs text-slate-400">
                {stats.blockedScenarios} scenarios, {stats.blockedCharacters} characters
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Recent Actions</CardTitle>
              <Activity className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.recentActions}</div>
              <p className="text-xs text-slate-400">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">System Status</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">Healthy</div>
              <p className="text-xs text-slate-400">All systems operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => window.location.href = '/admin/users'}
            className="p-4 bg-slate-800 hover:bg-slate-700 border border-gray-700 rounded-lg transition-colors text-left"
          >
            <Shield className="h-6 w-6 text-cyan-400 mb-2" />
            <h3 className="font-semibold text-white mb-1">Manage Users</h3>
            <p className="text-sm text-slate-400">View and moderate user accounts</p>
          </button>

          <button
            onClick={() => window.location.href = '/admin/scenarios'}
            className="p-4 bg-slate-800 hover:bg-slate-700 border border-gray-700 rounded-lg transition-colors text-left"
          >
            <FileText className="h-6 w-6 text-violet-400 mb-2" />
            <h3 className="font-semibold text-white mb-1">Moderate Scenarios</h3>
            <p className="text-sm text-slate-400">Review and manage scenario content</p>
          </button>

          <button
            onClick={() => window.location.href = '/admin/characters'}
            className="p-4 bg-slate-800 hover:bg-slate-700 border border-gray-700 rounded-lg transition-colors text-left"
          >
            <Users className="h-6 w-6 text-amber-400 mb-2" />
            <h3 className="font-semibold text-white mb-1">Moderate Characters</h3>
            <p className="text-sm text-slate-400">Review AI character configurations</p>
          </button>

          <button
            onClick={() => window.location.href = '/admin/audit'}
            className="p-4 bg-slate-800 hover:bg-slate-700 border border-gray-700 rounded-lg transition-colors text-left"
          >
            <Activity className="h-6 w-6 text-emerald-400 mb-2" />
            <h3 className="font-semibold text-white mb-1">View Audit Log</h3>
            <p className="text-sm text-slate-400">Track all administrative actions</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;