
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface GameFilters {
  status: 'all' | 'playing' | 'completed' | 'won' | 'lost';
  search: string;
  sortBy: 'started_desc' | 'started_asc' | 'title' | 'progress';
}

interface GameFiltersProps {
  filters: GameFilters;
  onFiltersChange: (filters: GameFilters) => void;
  totalGames: number;
  filteredCount: number;
}

const GameFilters: React.FC<GameFiltersProps> = ({
  filters,
  onFiltersChange,
  totalGames,
  filteredCount
}) => {
  const updateFilter = (key: keyof GameFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search games..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
            
            {/* Status Filter */}
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Games</SelectItem>
                <SelectItem value="playing">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Sort */}
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="started_desc">Newest First</SelectItem>
                <SelectItem value="started_asc">Oldest First</SelectItem>
                <SelectItem value="title">By Title</SelectItem>
                <SelectItem value="progress">By Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Results count */}
          <div className="text-sm text-slate-400">
            {filteredCount === totalGames 
              ? `${totalGames} games total`
              : `${filteredCount} of ${totalGames} games`
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameFilters;
