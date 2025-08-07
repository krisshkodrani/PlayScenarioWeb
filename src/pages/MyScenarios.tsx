
import React, { useState, memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/navigation/PageHeader';
import ScenarioStatsCards from '@/components/my-scenarios/ScenarioStatsCards';
import ScenarioFilters from '@/components/my-scenarios/ScenarioFilters';
import ScenarioList from '@/components/my-scenarios/ScenarioList';
import ScenarioPagination from '@/components/my-scenarios/ScenarioPagination';
import EmptyScenarios from '@/components/my-scenarios/EmptyScenarios';
import NoSearchResults from '@/components/my-scenarios/NoSearchResults';
import { useMyScenarios } from '@/hooks/useMyScenarios';
import { useMyScenariosActions } from '@/components/my-scenarios/MyScenariosActions';

// Memoized header component to prevent reloading during search
const ScenariosHeader = memo<{
  scenarioStats: any;
  onCreateNew: () => void;
  onNavigateToDashboard: () => void;
}>(({ scenarioStats, onCreateNew, onNavigateToDashboard }) => (
  <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-800">
    <div className="container mx-auto px-4 py-4">
      {/* Single row with dashboard link, title, stats, and create button */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Dashboard link and title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToDashboard}
            className="text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">My Scenarios</h1>
            {scenarioStats.totalScenarios > 0 && (
              <span className="bg-slate-700 text-cyan-400 px-2 py-1 rounded-full text-sm font-medium">
                {scenarioStats.totalScenarios}
              </span>
            )}
          </div>
        </div>

        {/* Center: Compact Stats (hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm">
            <span className="text-slate-400">Total:</span>
            <span className="text-cyan-400 font-semibold">{scenarioStats.totalScenarios}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-slate-400">Published:</span>
            <span className="text-emerald-400 font-semibold">{scenarioStats.publishedScenarios}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-slate-400">Plays:</span>
            <span className="text-violet-400 font-semibold">{scenarioStats.totalPlays}</span>
          </div>
        </div>

        {/* Right: Create button */}
        <Button 
          onClick={onCreateNew}
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Scenario
        </Button>
      </div>
    </div>
  </div>
));

const MyScenarios: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const {
    scenarios,
    scenarioStats,
    loading,
    error,
    filters,
    pagination,
    handleFilterChange,
    handlePageChange,
    handleDelete,
    handleDuplicate,
    handleTogglePublic,
  } = useMyScenarios();

  const {
    handleCreateNew,
    handleEdit,
    handleView,
  } = useMyScenariosActions();

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

  const hasScenarios = scenarios.length > 0;
  const hasSearchResults = filters.search ? scenarios.length > 0 : true;

  // Memoize navigation functions to prevent header re-renders
  const handleNavigateToDashboard = useMemo(() => () => navigate('/dashboard'), [navigate]);

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Memoized Header - Won't reload during search */}
      <ScenariosHeader
        scenarioStats={scenarioStats}
        onCreateNew={handleCreateNew}
        onNavigateToDashboard={handleNavigateToDashboard}
      />

      {/* Filters section - separate from header */}
      <div className="border-b border-slate-800 bg-slate-900">
        <div className="container mx-auto px-4 py-4">
          <ScenarioFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          {hasScenarios && hasSearchResults && (
            <>
              <ScenarioList
                scenarios={scenarios}
                viewMode={viewMode}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onTogglePublic={handleTogglePublic}
              />

              {pagination.total > pagination.limit && (
                <ScenarioPagination
                  currentPage={pagination.page}
                  totalPages={Math.ceil(pagination.total / pagination.limit)}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}

          {hasScenarios && !hasSearchResults && (
            <NoSearchResults 
              query={filters.search}
              onClearSearch={() => handleFilterChange({ search: '' })}
            />
          )}

          {!hasScenarios && !filters.search && (
            <EmptyScenarios onCreateNew={handleCreateNew} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyScenarios;
