
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, RefreshCw, Search } from 'lucide-react';
import { AuditFilters as AuditFiltersType } from '@/services/admin/adminAuditService';

interface AuditFiltersProps {
  filters: AuditFiltersType;
  onFiltersChange: (filters: AuditFiltersType) => void;
  onExport: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
  adminUsers: Array<{ id: string; name: string }>;
}

const AuditFilters: React.FC<AuditFiltersProps> = ({
  filters,
  onFiltersChange,
  onExport,
  onRefresh,
  isLoading = false,
  adminUsers
}) => {
  const handleFilterChange = (key: keyof AuditFiltersType, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <Card className="bg-slate-800 border-gray-700 mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-400" />
            Audit Log Filters
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="border-gray-600 text-slate-300 hover:bg-slate-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="border-gray-600 text-slate-300 hover:bg-slate-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Start Date
            </label>
            <Input
              type="datetime-local"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              End Date
            </label>
            <Input
              type="datetime-local"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        {/* Filter Selects */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Admin User
            </label>
            <Select value={filters.adminId || ''} onValueChange={(value) => handleFilterChange('adminId', value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="All admins" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="">All admins</SelectItem>
                {adminUsers.map((admin) => (
                  <SelectItem key={admin.id} value={admin.id} className="text-white">
                    {admin.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Action Type
            </label>
            <Select value={filters.actionType || ''} onValueChange={(value) => handleFilterChange('actionType', value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="All actions" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="">All actions</SelectItem>
                <SelectItem value="user_blocked" className="text-white">User Blocked</SelectItem>
                <SelectItem value="user_unblocked" className="text-white">User Unblocked</SelectItem>
                <SelectItem value="content_blocked" className="text-white">Content Blocked</SelectItem>
                <SelectItem value="content_unblocked" className="text-white">Content Unblocked</SelectItem>
                <SelectItem value="content_deleted" className="text-white">Content Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Target Type
            </label>
            <Select value={filters.targetType || ''} onValueChange={(value) => handleFilterChange('targetType', value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="All targets" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="">All targets</SelectItem>
                <SelectItem value="user" className="text-white">User</SelectItem>
                <SelectItem value="scenario" className="text-white">Scenario</SelectItem>
                <SelectItem value="character" className="text-white">Character</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Target ID
            </label>
            <Input
              placeholder="Target ID..."
              value={filters.targetId || ''}
              onChange={(e) => handleFilterChange('targetId', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* Keyword Search */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Search in Reasons
          </label>
          <Input
            placeholder="Search keywords in action reasons..."
            value={filters.searchKeyword || ''}
            onChange={(e) => handleFilterChange('searchKeyword', e.target.value)}
            className="bg-gray-700 border-gray-600 text-white placeholder-slate-400"
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuditFilters;
