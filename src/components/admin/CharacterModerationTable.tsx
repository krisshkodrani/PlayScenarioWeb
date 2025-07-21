
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Shield, ShieldCheck, Eye, Users, MessageSquare, Star, Clock } from 'lucide-react';
import { AdminCharacter, adminCharacterService } from '@/services/admin/adminCharacterService';
import { useBulkSelection } from '@/hooks/useBulkSelection';
import { BulkActionToolbar, CHARACTER_BULK_ACTIONS } from './BulkActionToolbar';
import { BulkConfirmationDialog } from './BulkConfirmationDialog';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface CharacterModerationTableProps {
  characters: AdminCharacter[];
  loading: boolean;
  onBlockCharacter: (characterId: string, reason: string) => Promise<void>;
  onUnblockCharacter: (characterId: string, reason: string) => Promise<void>;
  onSetPendingReview: (characterId: string, reason: string) => Promise<void>;
}

export const CharacterModerationTable: React.FC<CharacterModerationTableProps> = ({
  characters,
  loading,
  onBlockCharacter,
  onUnblockCharacter,
  onSetPendingReview
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<AdminCharacter | null>(null);
  const [actionType, setActionType] = useState<'block' | 'unblock' | 'pending_review' | null>(null);
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<'bulk-block' | 'bulk-unblock' | 'bulk-pending-review' | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const { toast } = useToast();

  const {
    selectedItems,
    isSelected,
    isAllSelected,
    isPartialSelected,
    selectedCount,
    totalCount,
    toggleItem,
    toggleAll,
    clearSelection,
    getSelectedIds
  } = useBulkSelection(characters);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>;
      case 'blocked':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Blocked</Badge>;
      case 'pending_review':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending Review</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Unknown</Badge>;
    }
  };

  const getCharacterTypeBadge = (isPlayerCharacter: boolean) => {
    return isPlayerCharacter ? (
      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
        <Users className="w-3 h-3 mr-1" />
        Player Character
      </Badge>
    ) : (
      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
        <Users className="w-3 h-3 mr-1" />
        NPC
      </Badge>
    );
  };

  const handleAction = async () => {
    if (!selectedCharacter || !actionType) return;

    setActionLoading(true);
    try {
      switch (actionType) {
        case 'block':
          await onBlockCharacter(selectedCharacter.id, reason);
          break;
        case 'unblock':
          await onUnblockCharacter(selectedCharacter.id, reason);
          break;
        case 'pending_review':
          await onSetPendingReview(selectedCharacter.id, reason);
          break;
      }
      setSelectedCharacter(null);
      setActionType(null);
      setReason('');
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkAction = (actionId: string) => {
    if (actionId === 'bulk-block' || actionId === 'bulk-unblock' || actionId === 'bulk-pending-review') {
      setBulkAction(actionId as 'bulk-block' | 'bulk-unblock' | 'bulk-pending-review');
      setBulkDialogOpen(true);
    }
  };

  const handleBulkConfirm = async (reason?: string) => {
    const selectedIds = getSelectedIds();
    if (selectedIds.length === 0) return;

    setBulkLoading(true);
    try {
      if (bulkAction === 'bulk-block' && reason) {
        await adminCharacterService.bulkBlockCharacters(selectedIds, reason);
        toast({
          title: "Success",
          description: `${selectedIds.length} character${selectedIds.length === 1 ? '' : 's'} blocked successfully`,
        });
      } else if (bulkAction === 'bulk-unblock') {
        await adminCharacterService.bulkUnblockCharacters(selectedIds);
        toast({
          title: "Success",
          description: `${selectedIds.length} character${selectedIds.length === 1 ? '' : 's'} unblocked successfully`,
        });
      } else if (bulkAction === 'bulk-pending-review' && reason) {
        await adminCharacterService.bulkSetPendingReview(selectedIds, reason);
        toast({
          title: "Success",
          description: `${selectedIds.length} character${selectedIds.length === 1 ? '' : 's'} marked for review successfully`,
        });
      }
      
      clearSelection();
      setBulkDialogOpen(false);
      setBulkAction(null);
      
      // Trigger a refresh by calling the parent's methods (this will reload the data)
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete bulk operation",
        variant: "destructive",
      });
    } finally {
      setBulkLoading(false);
    }
  };

  const openActionDialog = (character: AdminCharacter, type: 'block' | 'unblock' | 'pending_review') => {
    setSelectedCharacter(character);
    setActionType(type);
    setReason('');
  };

  if (loading) {
    return (
      <Card className="bg-slate-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-400">Loading characters...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedCharacters = characters.filter(character => isSelected(character.id));

  return (
    <>
      <BulkActionToolbar
        selectedCount={selectedCount}
        totalCount={totalCount}
        actions={CHARACTER_BULK_ACTIONS}
        onAction={handleBulkAction}
        onClearSelection={clearSelection}
        loading={bulkLoading}
      />

      <Card className="bg-slate-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Character Moderation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-slate-700/50">
                <TableHead className="text-slate-300 w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={toggleAll}
                    className="border-gray-600"
                    data-indeterminate={isPartialSelected}
                  />
                </TableHead>
                <TableHead className="text-slate-300">Character</TableHead>
                <TableHead className="text-slate-300">Type</TableHead>
                <TableHead className="text-slate-300">Creator</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Stats</TableHead>
                <TableHead className="text-slate-300">Created</TableHead>
                <TableHead className="text-slate-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {characters.map((character) => (
                <TableRow key={character.id} className="border-gray-700 hover:bg-slate-700/30">
                  <TableCell>
                    <Checkbox
                      checked={isSelected(character.id)}
                      onCheckedChange={() => toggleItem(character.id)}
                      className="border-gray-600"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-white">{character.name}</div>
                      <div className="text-sm text-slate-400">{character.role}</div>
                      <div className="text-xs text-slate-500">
                        {character.expertise_keywords.slice(0, 3).join(', ')}
                        {character.expertise_keywords.length > 3 && '...'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getCharacterTypeBadge(character.is_player_character)}
                  </TableCell>
                  <TableCell>
                    <div className="text-slate-300">{character.creator_username}</div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(character.status)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1 text-slate-400">
                        <MessageSquare className="w-3 h-3" />
                        {character.total_responses} responses
                      </div>
                      {character.average_rating && (
                        <div className="flex items-center gap-1 text-slate-400">
                          <Star className="w-3 h-3" />
                          {character.average_rating.toFixed(1)}
                        </div>
                      )}
                      {character.last_used && (
                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(character.last_used), { addSuffix: true })}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-slate-400 text-sm">
                      {formatDistanceToNow(new Date(character.created_at), { addSuffix: true })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {character.status === 'active' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openActionDialog(character, 'pending_review')}
                            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openActionDialog(character, 'block')}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <AlertTriangle className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                      {character.status === 'blocked' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openActionDialog(character, 'unblock')}
                          className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                        >
                          <ShieldCheck className="w-3 h-3" />
                        </Button>
                      )}
                      {character.status === 'pending_review' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openActionDialog(character, 'unblock')}
                            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                          >
                            <ShieldCheck className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openActionDialog(character, 'block')}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <AlertTriangle className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {characters.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No characters found</h3>
              <p className="text-slate-400">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <BulkConfirmationDialog
        open={bulkDialogOpen}
        onOpenChange={setBulkDialogOpen}
        action={bulkAction}
        selectedCount={selectedCount}
        selectedItems={selectedCharacters.map(c => ({ id: c.id, name: c.name }))}
        onConfirm={handleBulkConfirm}
        loading={bulkLoading}
        itemType="character"
      />

      {/* Action Dialog */}
      <Dialog open={!!selectedCharacter && !!actionType} onOpenChange={() => {
        setSelectedCharacter(null);
        setActionType(null);
        setReason('');
      }}>
        <DialogContent className="bg-slate-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {actionType === 'block' && 'Block Character'}
              {actionType === 'unblock' && 'Unblock Character'}
              {actionType === 'pending_review' && 'Mark for Review'}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {actionType === 'block' && 'This will block the character and prevent it from being used in scenarios.'}
              {actionType === 'unblock' && 'This will unblock the character and allow it to be used in scenarios.'}
              {actionType === 'pending_review' && 'This will mark the character for further review.'}
            </DialogDescription>
          </DialogHeader>

          {selectedCharacter && (
            <div className="space-y-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">{selectedCharacter.name}</h4>
                <p className="text-sm text-slate-300 mb-2">Role: {selectedCharacter.role}</p>
                <p className="text-sm text-slate-400">{selectedCharacter.personality}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Reason {actionType !== 'unblock' && '*'}
                </label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for this action..."
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCharacter(null);
                setActionType(null);
                setReason('');
              }}
              className="border-gray-600 text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={actionLoading || (actionType !== 'unblock' && !reason.trim())}
              className={
                actionType === 'block' 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : actionType === 'unblock'
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }
            >
              {actionLoading ? 'Processing...' : 
                actionType === 'block' ? 'Block Character' :
                actionType === 'unblock' ? 'Unblock Character' :
                'Mark for Review'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CharacterModerationTable;
