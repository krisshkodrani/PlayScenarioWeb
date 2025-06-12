
import React, { useState } from 'react';
import MyCharactersHeader from '@/components/my-characters/MyCharactersHeader';
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
    error,
    filters,
    pagination,
    handleFilterChange,
    handlePageChange,
    handleDelete,
    handleDuplicate,
  } = useMyCharacters();

  const {
    handleCreateNew,
    handleEdit,
    handleUseInScenario,
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
                <div key={i} className="h-64 bg-slate-800 rounded-lg"></div>
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
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <MyCharactersHeader
          totalCharacters={characterStats.totalCharacters}
          onCreateNew={handleCreateNew}
        />

        <CharacterStatsCards stats={characterStats} />

        {hasCharacters && (
          <>
            <CharacterFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {hasSearchResults ? (
              <>
                <CharacterList
                  characters={characters}
                  viewMode={viewMode}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  onUseInScenario={handleUseInScenario}
                />

                {pagination.total > pagination.limit && (
                  <CharacterPagination
                    currentPage={pagination.page}
                    totalPages={Math.ceil(pagination.total / pagination.limit)}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <NoSearchResults 
                query={filters.search}
                onClearSearch={() => handleFilterChange({ search: '' })}
              />
            )}
          </>
        )}

        {!hasCharacters && !filters.search && (
          <EmptyCharacters onCreateNew={handleCreateNew} />
        )}
      </div>
    </div>
  );
};

export default MyCharacters;
