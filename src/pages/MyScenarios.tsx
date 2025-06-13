
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Lightbulb } from 'lucide-react';
import PageHeader from '@/components/navigation/PageHeader';
import ScenarioStatsCards from '@/components/my-scenarios/ScenarioStatsCards';
import ScenarioFilters from '@/components/my-scenarios/ScenarioFilters';
import ScenarioList from '@/components/my-scenarios/ScenarioList';
import ScenarioPagination from '@/components/my-scenarios/ScenarioPagination';
import EmptyScenarios from '@/components/my-scenarios/EmptyScenarios';
import NoSearchResults from '@/components/my-scenarios/NoSearchResults';
import { useMyScenarios } from '@/hooks/useMyScenarios';
import { useMyScenariosActions } from '@/components/my-scenarios/MyScenariosActions';

const MyScenarios: React.FC = () => {
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

  const headerBadge = scenarioStats.totalScenarios > 0 ? (
    <span className="bg-slate-700 text-cyan-400 px-3 py-1 rounded-full text-sm font-medium">
      {scenarioStats.totalScenarios}
    </span>
  ) : null;

  const headerActions = (
    <>
      {scenarioStats.totalScenarios === 0 && (
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400 bg-slate-800 px-3 py-2 rounded-lg border border-slate-700">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Start with a simple idea</span>
        </div>
      )}
      
      <Button 
        onClick={handleCreateNew}
        className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-medium"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create New Scenario
      </Button>
    </>
  );

  const subtitle = scenarioStats.totalScenarios === 0 
    ? "Create your first interactive AI scenario to start engaging with users"
    : `Manage your collection of ${scenarioStats.totalScenarios} scenario${scenarioStats.totalScenarios === 1 ? '' : 's'}`;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-10 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 py-8">
          <PageHeader
            title="My Scenarios"
            subtitle={subtitle}
            badge={headerBadge}
            actions={headerActions}
          />

          <ScenarioStatsCards stats={scenarioStats} />

          {hasScenarios && (
            <ScenarioFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          )}
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6">
          {hasScenarios && hasSearchResults ? (
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
          ) : hasScenarios && !hasSearchResults ? (
            <NoSearchResults 
              query={filters.search}
              onClearSearch={() => handleFilterChange({ search: '' })}
            />
          ) : (
            <EmptyScenarios onCreateNew={handleCreateNew} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyScenarios;
