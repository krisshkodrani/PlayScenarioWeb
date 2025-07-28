
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Activity, TrendingUp, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/navigation/PageHeader';
import AuditFilters from '@/components/admin/AuditFilters';
import AuditTable from '@/components/admin/AuditTable';
import { 
  adminAuditService, 
  AdminAction, 
  AuditFilters as AuditFiltersType,
  AuditStats
} from '@/services/admin/adminAuditService';

const AuditTrail: React.FC = () => {
  const { toast } = useToast();
  const [actions, setActions] = useState<AdminAction[]>([]);
  const [filters, setFilters] = useState<AuditFiltersType>({});
  const [adminUsers, setAdminUsers] = useState<Array<{ id: string; name: string }>>([]);
  const [stats, setStats] = useState<AuditStats>({
    totalActions: 0,
    recentActions: 0,
    topActionTypes: [],
    activeAdmins: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 50;

  const loadAuditData = useCallback(async () => {
    try {
      setLoading(true);
      const { data, count } = await adminAuditService.getAdminActions(filters, currentPage, pageSize);
      setActions(data);
      setTotalCount(count);
    } catch (error) {
      console.error('Error loading audit data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load audit trail data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, toast]);

  const loadStats = useCallback(async () => {
    try {
      const auditStats = await adminAuditService.getAuditStats();
      setStats(auditStats);
    } catch (error) {
      console.error('Error loading audit stats:', error);
    }
  }, []);

  const loadAdminUsers = useCallback(async () => {
    try {
      const users = await adminAuditService.getAdminUsers();
      setAdminUsers(users);
    } catch (error) {
      console.error('Error loading admin users:', error);
    }
  }, []);

  useEffect(() => {
    loadAuditData();
  }, [loadAuditData]);

  useEffect(() => {
    loadStats();
    loadAdminUsers();
  }, [loadStats, loadAdminUsers]);

  const handleFiltersChange = (newFilters: AuditFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleExport = async () => {
    try {
      const blob = await adminAuditService.exportAuditLog(filters);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export Complete',
        description: 'Audit log has been exported successfully',
      });
    } catch (error) {
      console.error('Error exporting audit log:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export audit log',
        variant: 'destructive',
      });
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="Audit Trail"
          subtitle="Complete history of all administrative actions on the platform"
          customBreadcrumbs={[
            { label: 'Admin Dashboard', href: '/admin' },
            { label: 'Audit Trail' }
          ]}
        />

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Actions</CardTitle>
              <Activity className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.totalActions.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Recent Actions</CardTitle>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.recentActions.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400">Last 7 days</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Active Admins</CardTitle>
              <Users className="w-4 h-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.activeAdmins}
              </div>
              <p className="text-xs text-slate-400">Last 7 days</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Top Action</CardTitle>
              <Clock className="w-4 h-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-white">
                {stats.topActionTypes[0]?.action_type.replace(/_/g, ' ') || 'None'}
              </div>
              <p className="text-xs text-slate-400">
                {stats.topActionTypes[0]?.count || 0} times
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <AuditFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onExport={handleExport}
          onRefresh={loadAuditData}
          isLoading={loading}
          adminUsers={adminUsers}
        />

        {/* Results Summary */}
        <Card className="bg-slate-800 border-gray-700">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">
                  Audit Records ({totalCount.toLocaleString()})
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Showing {actions.length} of {totalCount.toLocaleString()} records
                </CardDescription>
              </div>
              {totalPages > 1 && (
                <div className="text-sm text-slate-400">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Audit Table */}
        <AuditTable actions={actions} isLoading={loading} />

        {/* Pagination */}
        {totalPages > 1 && (
          <Card className="bg-slate-800 border-gray-700">
            <CardContent className="p-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer text-cyan-400 hover:text-cyan-300'}
                    />
                  </PaginationItem>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (pageNum <= totalPages) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={pageNum === currentPage}
                            className="cursor-pointer text-slate-300 hover:text-white"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer text-cyan-400 hover:text-cyan-300'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AuditTrail;
