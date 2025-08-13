
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
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
      <div className="container mx-auto px-4 py-6">
        <PageHeader
          title="My Characters"
          subtitle={
            characterStats.totalCharacters === 0 
              ? "Create your first AI character to start building interactive scenarios"
              : `Manage your collection of ${characterStats.totalCharacters} AI character${characterStats.totalCharacters === 1 ? '' : 's'}`
          }
          badge={
            characterStats.totalCharacters > 0 && (
              <span className="bg-slate-700 text-cyan-400 px-3 py-1 rounded-full text-sm font-medium">
                {characterStats.totalCharacters}
              </span>
            )
          }
          actions={
            <Button 
              onClick={handleCreateNew}
              className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Character
            </Button>
          }
        />

        {/* Character Stats Cards */}
        <CharacterStatsCards stats={characterStats} />

        {/* Filters */}
        <div className="mb-6">
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
