import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, ShieldOff, Eye, X, AlertTriangle } from 'lucide-react';

interface BulkAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  className?: string;
}

interface BulkActionToolbarProps {
  selectedCount: number;
  totalCount: number;
  actions: BulkAction[];
  onAction: (actionId: string) => void;
  onClearSelection: () => void;
  loading?: boolean;
}

export const BulkActionToolbar: React.FC<BulkActionToolbarProps> = ({
  selectedCount,
  totalCount,
  actions,
  onAction,
  onClearSelection,
  loading = false
}) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800 border border-gray-700 rounded-lg p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Badge className="bg-cyan-400/20 text-cyan-400 border-cyan-400/30">
          {selectedCount} of {totalCount} selected
        </Badge>
        
        <div className="flex items-center gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant={action.variant || 'outline'}
                size="sm"
                onClick={() => onAction(action.id)}
                disabled={loading}
                className={action.className}
              >
                <Icon className="w-4 h-4 mr-2" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
        disabled={loading}
        className="text-slate-400 hover:text-white"
      >
        <X className="w-4 h-4 mr-1" />
        Clear Selection
      </Button>
    </div>
  );
};

// Predefined action sets for different content types
export const SCENARIO_BULK_ACTIONS: BulkAction[] = [
  {
    id: 'bulk-block',
    label: 'Block Selected',
    icon: Shield,
    variant: 'destructive',
    className: 'border-red-500/30 text-red-400 hover:bg-red-500/10'
  },
  {
    id: 'bulk-unblock',
    label: 'Unblock Selected',
    icon: ShieldOff,
    variant: 'outline',
    className: 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
  }
];

export const CHARACTER_BULK_ACTIONS: BulkAction[] = [
  {
    id: 'bulk-pending-review',
    label: 'Mark for Review',
    icon: Eye,
    variant: 'outline',
    className: 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
  },
  {
    id: 'bulk-block',
    label: 'Block Selected',
    icon: AlertTriangle,
    variant: 'destructive',
    className: 'border-red-500/30 text-red-400 hover:bg-red-500/10'
  },
  {
    id: 'bulk-unblock',
    label: 'Unblock Selected',
    icon: ShieldOff,
    variant: 'outline',
    className: 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
  }
];

export default BulkActionToolbar;