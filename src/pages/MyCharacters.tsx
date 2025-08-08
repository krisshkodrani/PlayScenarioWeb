
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, LayoutDashboard, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/navigation/PageHeader';
import CharacterStatsCards from '@/components/my-characters/CharacterStatsCards';
import CharacterFilters from '@/components/my-characters/CharacterFilters';
import CharacterList from '@/components/my-characters/CharacterList';
import CharacterPagination from '@/components/my-characters/CharacterPagination';
import EmptyCharacters from '@/components/my-characters/EmptyCharacters';
import NoSearchResults from '@/components/my-characters/NoSearchResults';
import { useMyCharacters } from '@/hooks/useMyCharacters';
import { useMyCharactersActions } from '@/components/my-characters/MyCharactersActions';

const MyCharacters: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Stable navigation function prevents header re-renders
  const handleNavigateToDashboard = useMemo(() => () => navigate('/dashboard'), [navigate]);
  
  const {
    characters,
    characterStats,
    loading,
    isFiltering,
    error,
    filters,
    pagination,
    handleFilterChange,
    handlePageChange,
    handleDelete,
  } = useMyCharacters();

  const {
    handleCreateNew,
    handleEdit,
    handleDuplicate,
  } = useMyCharactersActions();

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-800 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-800 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-264 bg-slate-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 px-6 py-2 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const hasCharacters = characters.length > 0;
  const hasSearchResults = filters.search ? characters.length > 0 : true;

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Compact Sticky Header - Single Row */}
      <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          {/* Single row with dashboard link, title, stats, and create button */}
          <div className="flex items-center justify-between gap-4">
            {/* Left: Dashboard link and title */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNavigateToDashboard}
                className="text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">My Characters</h1>
                {characterStats.totalCharacters > 0 && (
                  <span className="bg-slate-700 text-cyan-400 px-2 py-1 rounded-full text-sm font-medium">
                    {characterStats.totalCharacters}
                  </span>
                )}
              </div>
            </div>

            {/* Center: Compact Stats (hidden on mobile) */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm">
                <span className="text-slate-400">Total:</span>
                <span className="text-cyan-400 font-semibold">{characterStats.totalCharacters}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-slate-400">Active:</span>
                <span className="text-emerald-400 font-semibold">{characterStats.activeCharacters}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-slate-400">Rating:</span>
                <span className="text-violet-400 font-semibold">{characterStats.averageRating.toFixed(1)}</span>
              </div>
            </div>

            {/* Right: Create button */}
            <Button 
              onClick={handleCreateNew}
              className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Character
            </Button>
          </div>

          {/* Filters row (always visible) */}
          <div className="mt-4">
            <div className="flex items-center justify-between gap-4">
              <CharacterFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
              {isFiltering && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" aria-hidden="true" />
                  <span className="sr-only">Filtering characters...</span>
                  <span aria-hidden="true">Filtering...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          {hasCharacters && hasSearchResults && (
            <>
              <CharacterList
                characters={characters}
                viewMode={viewMode}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />

              {pagination.total > pagination.limit && (
                <CharacterPagination
                  currentPage={pagination.page}
                  totalPages={Math.ceil(pagination.total / pagination.limit)}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}

          {hasCharacters && !hasSearchResults && (
            <NoSearchResults 
              query={filters.search}
              onClearSearch={() => handleFilterChange({ search: '' })}
            />
          )}

          {!hasCharacters && !filters.search && (
            <EmptyCharacters onCreateNew={handleCreateNew} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCharacters;
