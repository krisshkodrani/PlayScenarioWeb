import React from 'react';
import { Gamepad2, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import PageHeader from '@/components/navigation/PageHeader';
import SearchAndFilters from '@/components/browse/SearchAndFilters';
import ScenarioGrid from '@/components/browse/ScenarioGrid';
import { useBrowseScenarios } from '@/hooks/useBrowseScenarios';
import { ScenarioFilters } from '@/services/scenarioService';

// Define the SortBy type based on your ScenarioFilters type
type SortBy = "created_desc" | "created_asc" | "title" | "popularity" | "rating";

const BrowseScenarios: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    scenarios,
    loading,
    error,
    filters,
    pagination,
    handleFilterChange,
    handlePageChange,
    handleLike,
    handleBookmark,
  } = useBrowseScenarios();

  // Show auth notice for unauthenticated users
  const authNotice = !authLoading && !user && (
    <div className="bg-slate-800 border border-cyan-400/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-cyan-400 font-medium mb-1">Join PlayScenarioAI</h3>
          <p className="text-slate-300 text-sm">Sign up to like scenarios, bookmark favorites, and create your own!</p>
        </div>
        <Link to="/register">
          <Button className="bg-gradient-to-r from-cyan-400 to-violet-400 hover:from-cyan-300 hover:to-violet-300 text-slate-900 font-medium">
            <LogIn className="w-4 h-4 mr-2" />
            Sign Up Free
          </Button>
        </Link>
      </div>
    </div>
  );

  // Handle auth-protected actions for unauthenticated users
  const handleAuthenticatedAction = (action: () => void, actionName: string) => {
    if (!user) {
      // Could show a toast here, but for now just redirect to login
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    action();
  };

  const wrappedHandleLike = (scenarioId: string) => {
    handleAuthenticatedAction(() => handleLike(scenarioId), 'like');
  };

  const wrappedHandleBookmark = (scenarioId: string) => {
    handleAuthenticatedAction(() => handleBookmark(scenarioId), 'bookmark');
  };

  if (loading && scenarios.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-slate-800 rounded w-64"></div>
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

  const clearFilters = () => {
    handleFilterChange({
      search: '',
      category: 'all',
      difficulty: '',
      sortBy: 'popularity',
      showLikedOnly: false,
      showBookmarkedOnly: false
    } as Partial<ScenarioFilters>);
  };

  const hasFilters = Boolean(
    filters.search || 
    filters.category !== 'all' || 
    filters.difficulty ||
    filters.showLikedOnly ||
    filters.showBookmarkedOnly
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="container mx-auto px-4 py-4">
        <PageHeader
          title="Browse Scenarios"
          subtitle="Discover and play interactive AI scenarios created by the community"
          badge={
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full">
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-slate-300">
                {pagination.total} scenarios
              </span>
            </div>
          }
        />
        
        {authNotice}
      </div>

      <SearchAndFilters
        searchQuery={filters.search}
        onSearchChange={(query) => handleFilterChange({ search: query })}
        selectedCategory={filters.category}
        onCategoryChange={(category) => handleFilterChange({ category })}
        sortBy={filters.sortBy}
        onSortChange={(sortBy: SortBy) => handleFilterChange({ sortBy })}
        resultCount={scenarios.length}
        showLikedOnly={filters.showLikedOnly}
        showBookmarkedOnly={filters.showBookmarkedOnly}
        onLikedFilterChange={(show) => handleFilterChange({ showLikedOnly: show })}
        onBookmarkedFilterChange={(show) => handleFilterChange({ showBookmarkedOnly: show })}
      />

      <div className="flex-1 container mx-auto px-4 py-6">
        <ScenarioGrid
          scenarios={scenarios}
          onLike={wrappedHandleLike}
          onBookmark={wrappedHandleBookmark}
          onClearFilters={clearFilters}
          hasFilters={hasFilters}
        />

        {/* Pagination */}
        {pagination.total > pagination.limit && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(pagination.total / pagination.limit) })
                .map((_, i) => i + 1)
                .slice(Math.max(0, pagination.page - 3), pagination.page + 2)
                .map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      page === pagination.page
                        ? 'bg-cyan-500 text-slate-900'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseScenarios;
