
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Shield, 
  BarChart3, 
  AlertTriangle, 
  Loader2,
  Mail,
  Calendar,
  Coins,
  FileText,
  Play,
  Trophy,
  Heart,
  Users
} from 'lucide-react';
import { profileService, UserProfile, ProfileStatistics } from '@/services/profileService';
import { useAuth } from '@/contexts/AuthContext';

const Profile: React.FC = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [statistics, setStatistics] = useState<ProfileStatistics | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profileData, statsData, transactionData] = await Promise.all([
        profileService.getCurrentUserProfile(),
        profileService.getProfileStatistics(),
        profileService.getTransactionHistory()
      ]);
      
      setProfile(profileData);
      setStatistics(statsData);
      setTransactions(transactionData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 text-cyan-400 animate-spin" />
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700 p-6 max-w-md">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-semibold text-white mb-2">Error Loading Profile</h2>
            <p className="text-slate-400 mb-4">{error}</p>
            <Button onClick={loadProfileData} className="bg-cyan-500 hover:bg-cyan-600">
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-slate-400">Manage your account and view your statistics</p>
        </div>

        {/* Profile Overview Card */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {profile?.username || 'No Username Set'}
                </h2>
                <p className="text-slate-400 mb-2">{profile?.email}</p>
                <div className="flex items-center space-x-4 text-sm text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-amber-400">{profile?.credits || 0} credits</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="general" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Statistics</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center space-x-2">
              <Coins className="w-4 h-4" />
              <span>Transactions</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <GeneralSettings profile={profile} onUpdate={loadProfileData} />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="statistics">
            <StatisticsView statistics={statistics} />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionsView transactions={transactions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// General Settings Component
const GeneralSettings: React.FC<{ profile: UserProfile | null; onUpdate: () => void }> = ({ 
  profile, 
  onUpdate 
}) => {
  const [username, setUsername] = useState(profile?.username || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      await profileService.updateUsername(username.trim());
      setMessage({ type: 'success', text: 'Username updated successfully' });
      onUpdate();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Update failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">General Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email (Read-only) */}
        <div>
          <Label className="text-slate-300">Email Address</Label>
          <div className="mt-1 flex items-center space-x-2">
            <Mail className="w-5 h-5 text-slate-400" />
            <div className="flex-1 p-3 bg-slate-700 rounded-md text-slate-300">
              {profile?.email}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
        </div>

        {/* Username Form */}
        <form onSubmit={handleUpdateUsername} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-slate-300">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400"
              placeholder="Enter username"
              disabled={loading}
            />
            <p className="text-xs text-slate-500 mt-1">
              Choose a unique username to personalize your profile
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded-md ${
              message.type === 'success' 
                ? 'bg-emerald-500/10 border border-emerald-400/20 text-emerald-400'
                : 'bg-red-500/10 border border-red-400/20 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || username === profile?.username}
            className="bg-cyan-500 hover:bg-cyan-600"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Update Username
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Security Settings Component
const SecuritySettings: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await profileService.changePassword(newPassword);
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Password change failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Security Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <Label htmlFor="new-password" className="text-slate-300">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400"
              placeholder="Enter new password"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="confirm-password" className="text-slate-300">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400"
              placeholder="Confirm new password"
              disabled={loading}
            />
          </div>

          {message && (
            <div className={`p-3 rounded-md ${
              message.type === 'success' 
                ? 'bg-emerald-500/10 border border-emerald-400/20 text-emerald-400'
                : 'bg-red-500/10 border border-red-400/20 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !newPassword || !confirmPassword}
            className="bg-cyan-500 hover:bg-cyan-600"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Change Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// Statistics View Component
const StatisticsView: React.FC<{ statistics: ProfileStatistics | null }> = ({ statistics }) => {
  if (!statistics) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6 text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 text-cyan-400 animate-spin" />
          <p className="text-slate-400">Loading statistics...</p>
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    { 
      label: 'Scenarios Created', 
      value: statistics.scenariosCreated, 
      icon: FileText, 
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    },
    { 
      label: 'Games Played', 
      value: statistics.gamesPlayed, 
      icon: Play, 
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10'
    },
    { 
      label: 'Games Won', 
      value: statistics.gamesWon, 
      icon: Trophy, 
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10'
    },
    { 
      label: 'Total Likes', 
      value: statistics.totalLikes, 
      icon: Heart, 
      color: 'text-red-400',
      bgColor: 'bg-red-500/10'
    },
    { 
      label: 'Total Plays', 
      value: statistics.totalPlays, 
      icon: Users, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    { 
      label: 'Credits Earned', 
      value: statistics.creditsEarned, 
      icon: Coins, 
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Your Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statCards.map((stat, index) => (
              <div key={index} className={`p-4 rounded-lg ${stat.bgColor} border border-slate-600`}>
                <div className="flex items-center space-x-3">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Win Rate</span>
                <span className="text-emerald-400">
                  {statistics.gamesPlayed > 0 
                    ? Math.round((statistics.gamesWon / statistics.gamesPlayed) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${statistics.gamesPlayed > 0 
                      ? (statistics.gamesWon / statistics.gamesPlayed) * 100 
                      : 0}%` 
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Average Score</span>
                <span className="text-cyan-400">{Math.round(statistics.averageScore || 0)}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((statistics.averageScore || 0), 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Transactions View Component
const TransactionsView: React.FC<{ transactions: any[] }> = ({ transactions }) => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <Coins className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-400">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-3 bg-slate-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'credit' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{transaction.description}</p>
                    <p className="text-sm text-slate-400">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={transaction.type === 'credit' ? 'default' : 'destructive'}
                  className={transaction.type === 'credit' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-red-500 text-white'
                  }
                >
                  {transaction.type === 'credit' ? '+' : '-'}{Math.abs(transaction.amount)} credits
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Profile;
