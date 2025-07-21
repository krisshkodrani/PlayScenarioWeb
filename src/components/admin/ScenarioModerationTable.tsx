
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Eye, Shield, ShieldOff, Calendar, User, Heart, Play, Users } from 'lucide-react';
import { AdminScenario } from '@/services/admin/adminScenarioService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ScenarioModerationTableProps {
  scenarios: AdminScenario[];
  onBlock: (scenarioId: string, reason: string) => Promise<void>;
  onUnblock: (scenarioId: string) => Promise<void>;
  loading: boolean;
}

export const ScenarioModerationTable: React.FC<ScenarioModerationTableProps> = ({
  scenarios,
  onBlock,
  onUnblock,
  loading
}) => {
  const [blockingScenario, setBlockingScenario] = useState<string | null>(null);
  const [blockReason, setBlockReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleBlock = async (scenarioId: string) => {
    if (!blockReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for blocking this scenario",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(scenarioId);
    try {
      await onBlock(scenarioId, blockReason);
      setBlockingScenario(null);
      setBlockReason('');
      toast({
        title: "Success",
        description: "Scenario has been blocked",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to block scenario",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblock = async (scenarioId: string) => {
    setActionLoading(scenarioId);
    try {
      await onUnblock(scenarioId);
      toast({
        title: "Success",
        description: "Scenario has been unblocked",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unblock scenario",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>;
      case 'blocked':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Blocked</Badge>;
      case 'pending_review':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending Review</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-700 rounded mb-2 w-3/4" />
            <div className="h-3 bg-gray-700 rounded mb-2 w-1/2" />
            <div className="h-3 bg-gray-700 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <div className="bg-slate-800 border border-gray-700 rounded-xl p-8 text-center">
        <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No scenarios found</h3>
        <p className="text-slate-400">Try adjusting your filters to see more scenarios.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {scenarios.map((scenario) => (
        <div key={scenario.id} className="bg-slate-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-white">{scenario.title}</h3>
                {getStatusBadge(scenario.status)}
                {scenario.is_public && (
                  <Badge variant="outline" className="border-cyan-400 text-cyan-400">Public</Badge>
                )}
              </div>
              <p className="text-slate-300 text-sm mb-3 line-clamp-2">{scenario.description}</p>
              
              <div className="flex items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{scenario.creator_username}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{format(new Date(scenario.created_at), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{scenario.character_count} characters</span>
                </div>
                <div className="flex items-center gap-1">
                  <Play className="w-3 h-3" />
                  <span>{scenario.play_count} plays</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  <span>{scenario.like_count} likes</span>
                </div>
              </div>

              {scenario.status === 'blocked' && scenario.blocked_reason && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">
                    <strong>Blocked reason:</strong> {scenario.blocked_reason}
                  </p>
                  {scenario.blocked_at && (
                    <p className="text-xs text-red-300 mt-1">
                      Blocked on {format(new Date(scenario.blocked_at), 'MMM d, yyyy HH:mm')}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/scenario/${scenario.id}`, '_blank')}
                className="border-gray-600 text-gray-300 hover:text-white"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>

              {scenario.status === 'active' ? (
                <Dialog open={blockingScenario === scenario.id} onOpenChange={(open) => {
                  if (!open) {
                    setBlockingScenario(null);
                    setBlockReason('');
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setBlockingScenario(scenario.id)}
                      disabled={actionLoading === scenario.id}
                    >
                      <Shield className="w-4 h-4 mr-1" />
                      Block
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-800 border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Block Scenario</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-slate-300">
                        You are about to block "{scenario.title}". Please provide a reason:
                      </p>
                      <Textarea
                        placeholder="Reason for blocking this scenario..."
                        value={blockReason}
                        onChange={(e) => setBlockReason(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setBlockingScenario(null);
                            setBlockReason('');
                          }}
                          className="border-gray-600 text-gray-300"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleBlock(scenario.id)}
                          disabled={!blockReason.trim() || actionLoading === scenario.id}
                        >
                          {actionLoading === scenario.id ? 'Blocking...' : 'Block Scenario'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnblock(scenario.id)}
                  disabled={actionLoading === scenario.id}
                  className="border-emerald-600 text-emerald-400 hover:bg-emerald-500/10"
                >
                  <ShieldOff className="w-4 h-4 mr-1" />
                  {actionLoading === scenario.id ? 'Unblocking...' : 'Unblock'}
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScenarioModerationTable;
