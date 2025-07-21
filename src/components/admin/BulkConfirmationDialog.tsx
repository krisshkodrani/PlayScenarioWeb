import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, ShieldOff, Eye } from 'lucide-react';

interface BulkConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'bulk-block' | 'bulk-unblock' | 'bulk-pending-review' | null;
  selectedCount: number;
  selectedItems: Array<{ id: string; title?: string; name?: string }>;
  onConfirm: (reason?: string) => Promise<void>;
  loading?: boolean;
  itemType: 'scenario' | 'character';
}

export const BulkConfirmationDialog: React.FC<BulkConfirmationDialogProps> = ({
  open,
  onOpenChange,
  action,
  selectedCount,
  selectedItems,
  onConfirm,
  loading = false,
  itemType
}) => {
  const [reason, setReason] = useState('');

  const getActionConfig = () => {
    switch (action) {
      case 'bulk-block':
        return {
          title: `Block ${selectedCount} ${itemType}${selectedCount === 1 ? '' : 's'}`,
          description: `This will block the selected ${itemType}${selectedCount === 1 ? '' : 's'} and prevent ${selectedCount === 1 ? 'it' : 'them'} from being used.`,
          icon: Shield,
          buttonText: `Block ${selectedCount} ${itemType}${selectedCount === 1 ? '' : 's'}`,
          buttonClass: 'bg-red-500 hover:bg-red-600 text-white',
          requiresReason: true
        };
      case 'bulk-unblock':
        return {
          title: `Unblock ${selectedCount} ${itemType}${selectedCount === 1 ? '' : 's'}`,
          description: `This will unblock the selected ${itemType}${selectedCount === 1 ? '' : 's'} and allow ${selectedCount === 1 ? 'it' : 'them'} to be used again.`,
          icon: ShieldOff,
          buttonText: `Unblock ${selectedCount} ${itemType}${selectedCount === 1 ? '' : 's'}`,
          buttonClass: 'bg-emerald-500 hover:bg-emerald-600 text-white',
          requiresReason: false
        };
      case 'bulk-pending-review':
        return {
          title: `Mark ${selectedCount} ${itemType}${selectedCount === 1 ? '' : 's'} for Review`,
          description: `This will mark the selected ${itemType}${selectedCount === 1 ? '' : 's'} for further review.`,
          icon: Eye,
          buttonText: `Mark for Review`,
          buttonClass: 'bg-amber-500 hover:bg-amber-600 text-white',
          requiresReason: true
        };
      default:
        return null;
    }
  };

  const config = getActionConfig();
  if (!config || !action) return null;

  const Icon = config.icon;

  const handleConfirm = async () => {
    if (config.requiresReason && !reason.trim()) return;
    await onConfirm(reason.trim() || undefined);
    setReason('');
  };

  const handleClose = () => {
    onOpenChange(false);
    setReason('');
  };

  // Limit displayed items to prevent dialog overflow
  const displayedItems = selectedItems.slice(0, 10);
  const hasMoreItems = selectedItems.length > 10;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-gray-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Icon className="w-5 h-5 text-amber-400" />
            {config.title}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Items Preview */}
          <div className="bg-slate-700 rounded-lg p-4 max-h-60 overflow-y-auto">
            <h4 className="text-sm font-medium text-white mb-3">
              Selected {itemType}s ({selectedCount}):
            </h4>
            <div className="space-y-2">
              {displayedItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {item.title || item.name}
                  </Badge>
                </div>
              ))}
              {hasMoreItems && (
                <div className="text-sm text-slate-400 italic">
                  ... and {selectedCount - 10} more {itemType}s
                </div>
              )}
            </div>
          </div>

          {/* Reason Input */}
          {config.requiresReason && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Reason *
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`Enter reason for ${action === 'bulk-block' ? 'blocking' : 'marking for review'} these ${itemType}s...`}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>
          )}

          {/* Warning for destructive actions */}
          {action === 'bulk-block' && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium text-sm">
                  This action will block {selectedCount} {itemType}{selectedCount === 1 ? '' : 's'}
                </p>
                <p className="text-red-300 text-xs mt-1">
                  Blocked {itemType}s will not be available for use until they are unblocked.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="border-gray-600 text-slate-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading || (config.requiresReason && !reason.trim())}
            className={config.buttonClass}
          >
            {loading ? 'Processing...' : config.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkConfirmationDialog;