
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  FileText, 
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Trash2,
  Calendar,
  Tag,
  MessageSquare
} from 'lucide-react';
import { AdminAction } from '@/services/admin/adminAuditService';

interface AuditDetailModalProps {
  action: AdminAction;
  isOpen: boolean;
  onClose: () => void;
}

const AuditDetailModal: React.FC<AuditDetailModalProps> = ({
  action,
  isOpen,
  onClose
}) => {
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'user_blocked':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'user_unblocked':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'content_blocked':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'content_unblocked':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'content_deleted':
        return <Trash2 className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getTargetIcon = (targetType: string) => {
    switch (targetType) {
      case 'user':
        return <User className="w-5 h-5 text-blue-400" />;
      case 'scenario':
        return <FileText className="w-5 h-5 text-green-400" />;
      case 'character':
        return <Users className="w-5 h-5 text-purple-400" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
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
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-3">
            {getActionIcon(action.action_type)}
            Admin Action Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Overview */}
          <Card className="bg-slate-900 border-gray-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Action Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Timestamp</p>
                    <p className="text-white font-mono text-sm">{formatDate(action.created_at)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Action Type</p>
                    <Badge className={getActionBadgeColor(action.action_type)}>
                      {formatActionType(action.action_type)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-600">
                <p className="text-sm text-slate-400 mb-1">Action ID</p>
                <p className="text-white font-mono text-sm bg-slate-800 p-2 rounded border">
                  {action.id}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Admin Information */}
          <Card className="bg-slate-900 border-gray-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                Admin Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-slate-400">Admin Name</p>
                  <p className="text-white">
                    {action.admin_profile?.display_name || 
                     action.admin_profile?.username || 
                     'Unknown Admin'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Admin ID</p>
                  <p className="text-white font-mono text-sm bg-slate-800 p-2 rounded border">
                    {action.admin_id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Information */}
          <Card className="bg-slate-900 border-gray-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                {getTargetIcon(action.target_type)}
                Target Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Target Type</p>
                    <p className="text-white capitalize">{action.target_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Target Name</p>
                    <p className="text-white">
                      {action.target_info?.name || action.target_info?.title || (
                        <span className="text-slate-500 italic">Unknown</span>
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Target ID</p>
                  <p className="text-white font-mono text-sm bg-slate-800 p-2 rounded border">
                    {action.target_id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reason */}
          {action.reason && (
            <Card className="bg-slate-900 border-gray-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  Reason
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white bg-slate-800 p-3 rounded border leading-relaxed">
                  {action.reason}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Additional Details */}
          {action.details && Object.keys(action.details).length > 0 && (
            <Card className="bg-slate-900 border-gray-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">Additional Details</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-slate-300 text-sm bg-slate-800 p-3 rounded border overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(action.details, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuditDetailModal;
