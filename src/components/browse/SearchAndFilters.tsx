
import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { SCENARIO_CATEGORIES } from '@/data/scenarioCategories';
import { ScenarioCategory } from '@/types/scenario';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  resultCount: number;
}

const sortOptions = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'difficulty', label: 'Difficulty' }
];

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  resultCount
}) => {
  const getCategoryInfo = (categoryId: string): ScenarioCategory => {
    return SCENARIO_CATEGORIES.find(cat => cat.id === categoryId) || SCENARIO_CATEGORIES[0];
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-b border-slate-600 flex-shrink-0">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Search with gradient focus */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-700/50 backdrop-blur border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              placeholder="Search scenarios, characters, or skills..."
            />
          </div>

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[180px] justify-between bg-slate-700/50 backdrop-blur border-slate-600 text-white hover:bg-slate-600/50">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">{getCategoryInfo(selectedCategory).icon}</span>
                  <span>{getCategoryInfo(selectedCategory).name}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-slate-600">
              {SCENARIO_CATEGORIES.map(category => (
                <DropdownMenuItem 
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`text-white hover:bg-slate-700 ${selectedCategory === category.id ? 'bg-slate-700' : ''}`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[160px] justify-between bg-slate-700/50 backdrop-blur border-slate-600 text-white hover:bg-slate-600/50">
                Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-slate-600">
              {sortOptions.map(option => (
                <DropdownMenuItem 
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={`text-white hover:bg-slate-700 ${sortBy === option.value ? 'bg-slate-700' : ''}`}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Results Summary */}
        <div>
          <p className="text-sm text-slate-400">
            Showing {resultCount} scenarios
            {selectedCategory !== 'all' && ` in ${getCategoryInfo(selectedCategory).name}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;
