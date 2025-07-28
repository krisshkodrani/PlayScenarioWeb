import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Search, Shield, ShieldOff, User, Calendar, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface UserProfile {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  credits: number;
  created_at: string;
  is_super_admin: boolean;
  profile_visibility: string;
}

export const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [blockReason, setBlockReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async () => {
    if (!selectedUser || !blockReason.trim()) return;

    try {
      setActionLoading(true);

      // Log the admin action
      const { error: logError } = await supabase
        .from('admin_actions')
        .insert({
          admin_id: currentUser?.id,
          action_type: 'user_blocked',
          target_type: 'user',
          target_id: selectedUser.id,
          reason: blockReason,
          details: {
            blocked_user: {
              username: selectedUser.username,
              display_name: selectedUser.display_name,
            }
          }
        });

      if (logError) throw logError;

      toast({
        title: "User Blocked",
        description: `User ${selectedUser.username || selectedUser.display_name || selectedUser.id} has been blocked.`,
      });

      setShowBlockDialog(false);
      setBlockReason('');
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error blocking user:', error);
      toast({
        title: "Error",
        description: "Failed to block user",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.id.includes(searchTerm))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-slate-400">Manage user accounts and permissions</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search users by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-gray-700 text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="grid gap-4">
          {filteredUsers.map((userProfile) => (
            <Card key={userProfile.id} className="bg-slate-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {userProfile.display_name || userProfile.username || 'Anonymous User'}
                      </h3>
                      <p className="text-sm text-slate-400">
                        ID: {userProfile.id.slice(0, 8)}...
                      </p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-xs text-slate-400">
                            Joined {formatDate(userProfile.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CreditCard className="h-4 w-4 text-slate-400" />
                          <span className="text-xs text-slate-400">
                            {userProfile.credits} credits
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {userProfile.is_super_admin && (
                      <Badge variant="outline" className="border-amber-400 text-amber-400">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                    {userProfile.id !== currentUser?.id && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(userProfile);
                          setShowBlockDialog(true);
                        }}
                      >
                        <ShieldOff className="h-4 w-4 mr-1" />
                        Block User
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No users found</h3>
            <p className="text-slate-400">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      {/* Block User Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent className="bg-slate-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Block User</DialogTitle>
            <DialogDescription className="text-slate-400">
              This action will prevent the user from accessing the platform. Please provide a reason for blocking this user.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Reason for blocking (required)
              </label>
              <Textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Please provide a detailed reason for blocking this user..."
                className="bg-slate-700 border-gray-600 text-white placeholder-slate-400"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowBlockDialog(false);
                setBlockReason('');
              }}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBlockUser}
              disabled={actionLoading || !blockReason.trim()}
            >
              {actionLoading ? 'Blocking...' : 'Block User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;