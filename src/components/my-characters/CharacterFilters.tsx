
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
import { CharacterFilters as FilterState } from '@/types/character';

interface CharacterFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const CharacterFilters: React.FC<CharacterFiltersProps> = ({
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
      search: '',
      role: '',
      expertise: '',
      sortBy: 'created'
    });
  };

  const hasActiveFilters = 
    filters.search !== '' || 
    filters.role !== '' || 
    filters.expertise !== '' || 
    filters.sortBy !== 'created';

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search characters..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-cyan-400"
          />
        </div>

        {/* Role Filter */}
        <Select
          value={filters.role}
          onValueChange={(value: string) => 
            onFilterChange({ role: value })
          }
        >
          <SelectTrigger className="w-full lg:w-48 bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="" className="text-white hover:bg-slate-600">All Roles</SelectItem>
            <SelectItem value="Chief" className="text-white hover:bg-slate-600">Leadership</SelectItem>
            <SelectItem value="Director" className="text-white hover:bg-slate-600">Management</SelectItem>
            <SelectItem value="Manager" className="text-white hover:bg-slate-600">Operations</SelectItem>
            <SelectItem value="Officer" className="text-white hover:bg-slate-600">Specialist</SelectItem>
          </SelectContent>
        </Select>

        {/* Expertise Filter */}
        <Select
          value={filters.expertise}
          onValueChange={(value: string) => 
            onFilterChange({ expertise: value })
          }
        >
          <SelectTrigger className="w-full lg:w-48 bg-slate-700 border-slate-600 text-white">
            <SelectValue placeholder="All Expertise" />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="" className="text-white hover:bg-slate-600">All Expertise</SelectItem>
            <SelectItem value="medical" className="text-white hover:bg-slate-600">Medical</SelectItem>
            <SelectItem value="security" className="text-white hover:bg-slate-600">Security</SelectItem>
            <SelectItem value="engineering" className="text-white hover:bg-slate-600">Engineering</SelectItem>
            <SelectItem value="finance" className="text-white hover:bg-slate-600">Finance</SelectItem>
            <SelectItem value="communication" className="text-white hover:bg-slate-600">Communication</SelectItem>
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
            <SelectItem value="created" className="text-white hover:bg-slate-600">Recently Created</SelectItem>
            <SelectItem value="name" className="text-white hover:bg-slate-600">Name A-Z</SelectItem>
            <SelectItem value="usage" className="text-white hover:bg-slate-600">Most Used</SelectItem>
            <SelectItem value="rating" className="text-white hover:bg-slate-600">Highest Rated</SelectItem>
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

export default CharacterFilters;
