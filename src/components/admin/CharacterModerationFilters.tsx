
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { AdminCharacterFilters } from '@/services/admin/adminCharacterService';

interface CharacterModerationFiltersProps {
  filters: AdminCharacterFilters;
  onFiltersChange: (filters: AdminCharacterFilters) => void;
  onClearFilters: () => void;
}

export const CharacterModerationFilters: React.FC<CharacterModerationFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const hasActiveFilters = 
    filters.search || 
    filters.status !== 'all' || 
    filters.creator || 
    filters.role ||
    filters.is_player_character !== 'all' ||
    filters.dateFrom || 
    filters.dateTo;

  return (
    <div className="bg-slate-800 border border-gray-700 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-cyan-400" />
        <h3 className="font-semibold text-white">Filter Characters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="ml-auto text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {/* Search */}
        <div className="relative xl:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search characters..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-slate-400"
          />
        </div>

        {/* Status */}
        <Select 
          value={filters.status} 
          onValueChange={(value) => onFiltersChange({ ...filters, status: value as any })}
        >
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
            <SelectItem value="pending_review">Pending Review</SelectItem>
          </SelectContent>
        </Select>

        {/* Character Type */}
        <Select 
          value={filters.is_player_character} 
          onValueChange={(value) => onFiltersChange({ ...filters, is_player_character: value as any })}
        >
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="true">Player Character</SelectItem>
            <SelectItem value="false">NPC</SelectItem>
          </SelectContent>
        </Select>

        {/* Creator */}
        <Input
          placeholder="Creator username..."
          value={filters.creator}
          onChange={(e) => onFiltersChange({ ...filters, creator: e.target.value })}
          className="bg-gray-700 border-gray-600 text-white placeholder-slate-400"
        />

        {/* Role */}
        <Input
          placeholder="Role..."
          value={filters.role}
          onChange={(e) => onFiltersChange({ ...filters, role: e.target.value })}
          className="bg-gray-700 border-gray-600 text-white placeholder-slate-400"
        />

        {/* Date From */}
        <Input
          type="date"
          placeholder="From date"
          value={filters.dateFrom}
          onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
          className="bg-gray-700 border-gray-600 text-white"
        />

        {/* Date To */}
        <Input
          type="date"
          placeholder="To date"
          value={filters.dateTo}
          onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
          className="bg-gray-700 border-gray-600 text-white"
        />
      </div>
    </div>
  );
};

export default CharacterModerationFilters;
