
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Grid3X3, List, X } from 'lucide-react';

interface FilterState {
  status: 'all' | 'published' | 'draft' | 'private';
  search: string;
  sortBy: 'created_desc' | 'created_asc' | 'title' | 'plays_desc' | 'likes_desc';
}

interface ScenarioFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const ScenarioFilters: React.FC<ScenarioFiltersProps> = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange
}) => {
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFilterChange({ search: searchInput });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, filters.search, onFilterChange]);

  const clearFilters = () => {
    setSearchInput('');
    onFilterChange({
      status: 'all',
      search: '',
      sortBy: 'created_desc'
    });
  };

  const hasActiveFilters = 
    filters.status !== 'all' || 
    filters.search !== '' || 
    filters.sortBy !== 'created_desc';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search scenarios..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(value: FilterState['status']) => 
            onFilterChange({ status: value })
          }
        >
          <SelectTrigger className="w-full lg:w-40 bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="all" className="text-white hover:bg-slate-600">All Status</SelectItem>
            <SelectItem value="published" className="text-white hover:bg-slate-600">Published</SelectItem>
            <SelectItem value="draft" className="text-white hover:bg-slate-600">Draft</SelectItem>
            <SelectItem value="private" className="text-white hover:bg-slate-600">Private</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={filters.sortBy}
          onValueChange={(value: FilterState['sortBy']) => 
            onFilterChange({ sortBy: value })
          }
        >
          <SelectTrigger className="w-full lg:w-48 bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="created_desc" className="text-white hover:bg-slate-600">Newest First</SelectItem>
            <SelectItem value="created_asc" className="text-white hover:bg-slate-600">Oldest First</SelectItem>
            <SelectItem value="title" className="text-white hover:bg-slate-600">Title A-Z</SelectItem>
            <SelectItem value="plays_desc" className="text-white hover:bg-slate-600">Most Played</SelectItem>
            <SelectItem value="likes_desc" className="text-white hover:bg-slate-600">Most Liked</SelectItem>
          </SelectContent>
        </Select>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-700 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className={`p-2 ${
              viewMode === 'grid' 
                ? 'bg-slate-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewModeChange('list')}
            className={`p-2 ${
              viewMode === 'list' 
                ? 'bg-slate-600 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default ScenarioFilters;
