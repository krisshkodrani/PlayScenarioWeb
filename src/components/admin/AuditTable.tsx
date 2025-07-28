
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  User, 
  FileText, 
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trash2
} from 'lucide-react';
import { AdminAction } from '@/services/admin/adminAuditService';
import AuditDetailModal from './AuditDetailModal';

interface AuditTableProps {
  actions: AdminAction[];
  isLoading?: boolean;
}

const AuditTable: React.FC<AuditTableProps> = ({ actions, isLoading = false }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedAction, setSelectedAction] = useState<AdminAction | null>(null);

  const toggleRowExpansion = (actionId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(actionId)) {
      newExpanded.delete(actionId);
    } else {
      newExpanded.add(actionId);
    }
    setExpandedRows(newExpanded);
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'user_blocked':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'user_unblocked':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'content_blocked':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'content_unblocked':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'content_deleted':
        return <Trash2 className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTargetIcon = (targetType: string) => {
    switch (targetType) {
      case 'user':
        return <User className="w-4 h-4 text-blue-400" />;
      case 'scenario':
        return <FileText className="w-4 h-4 text-green-400" />;
      case 'character':
        return <Users className="w-4 h-4 text-purple-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getActionBadgeColor = (actionType: string) => {
    switch (actionType) {
      case 'user_blocked':
      case 'content_blocked':
      case 'content_deleted':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'user_unblocked':
      case 'content_unblocked':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const formatActionType = (actionType: string) => {
    return actionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800 border-gray-700">
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-slate-700 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (actions.length === 0) {
    return (
      <Card className="bg-slate-800 border-gray-700">
        <CardContent className="p-6 text-center">
          <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No audit records found</h3>
          <p className="text-slate-400">No admin actions match your current filters.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-slate-800 border-gray-700">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-slate-700/50">
                <TableHead className="text-slate-300 w-12"></TableHead>
                <TableHead className="text-slate-300">Timestamp</TableHead>
                <TableHead className="text-slate-300">Admin</TableHead>
                <TableHead className="text-slate-300">Action</TableHead>
                <TableHead className="text-slate-300">Target</TableHead>
                <TableHead className="text-slate-300">Target Name</TableHead>
                <TableHead className="text-slate-300">Reason</TableHead>
                <TableHead className="text-slate-300 w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actions.map((action) => (
                <React.Fragment key={action.id}>
                  <TableRow className="border-gray-700 hover:bg-slate-700/30">
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(action.id)}
                        className="p-1 h-8 w-8 text-slate-400 hover:text-white"
                      >
                        {expandedRows.has(action.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-slate-300 font-mono text-sm">
                      {formatDate(action.created_at)}
                    </TableCell>
                    <TableCell className="text-white">
                      {action.admin_profile?.display_name || 
                       action.admin_profile?.username || 
                       'Unknown Admin'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActionIcon(action.action_type)}
                        <Badge className={getActionBadgeColor(action.action_type)}>
                          {formatActionType(action.action_type)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTargetIcon(action.target_type)}
                        <span className="text-slate-300 capitalize">{action.target_type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {action.target_info?.name || action.target_info?.title || (
                        <span className="text-slate-500 italic">Unknown</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      <div className="max-w-xs truncate">
                        {action.reason || (
                          <span className="text-slate-500 italic">No reason provided</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedAction(action)}
                        className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  
                  {expandedRows.has(action.id) && (
                    <TableRow className="border-gray-700">
                      <TableCell colSpan={8} className="bg-slate-900/50 p-4">
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-400">Action ID:</span>
                              <span className="text-slate-300 ml-2 font-mono">{action.id}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Target ID:</span>
                              <span className="text-slate-300 ml-2 font-mono">{action.target_id}</span>
                            </div>
                          </div>
                          
                          {action.details && Object.keys(action.details).length > 0 && (
                            <div>
                              <span className="text-slate-400 text-sm">Additional Details:</span>
                              <pre className="text-slate-300 text-xs mt-1 p-2 bg-slate-800 rounded overflow-x-auto">
                                {JSON.stringify(action.details, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedAction && (
        <AuditDetailModal
          action={selectedAction}
          isOpen={true}
          onClose={() => setSelectedAction(null)}
        />
      )}
    </>
  );
};

export default AuditTable;
