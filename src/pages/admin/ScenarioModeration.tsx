
import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/navigation/PageHeader';
import { Button } from '@/components/ui/button';
import { ScenarioModerationFilters } from '@/components/admin/ScenarioModerationFilters';
import { ScenarioModerationTable } from '@/components/admin/ScenarioModerationTable';
import { Shield, RefreshCw } from 'lucide-react';
import { 
  getAdminScenarios, 
  blockScenario, 
  unblockScenario,
  AdminScenarioFilters,
  AdminScenario
} from '@/services/admin/adminScenarioService';
import { useToast } from '@/hooks/use-toast';

const ScenarioModeration: React.FC = () => {
  const [scenarios, setScenarios] = useState<AdminScenario[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<AdminScenarioFilters>({
    search: '',
    status: 'all',
    creator: '',
    dateFrom: '',
    dateTo: ''
  });
  const { toast } = useToast();

  const itemsPerPage = 20;

  const loadScenarios = async (page = 1) => {
    setLoading(true);
    try {
      const result = await getAdminScenarios(filters, page, itemsPerPage);
      setScenarios(result.scenarios);
      setTotal(result.total);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading scenarios:', error);
      toast({
        title: "Error",
        description: "Failed to load scenarios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: AdminScenarioFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    const clearedFilters: AdminScenarioFilters = {
      search: '',
      status: 'all',
      creator: '',
      dateFrom: '',
      dateTo: ''
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
  };

  const handleBlock = async (scenarioId: string, reason: string) => {
    await blockScenario(scenarioId, reason);
    await loadScenarios(currentPage);
  };

  const handleUnblock = async (scenarioId: string) => {
    await unblockScenario(scenarioId);
    await loadScenarios(currentPage);
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  // Load scenarios when filters change or component mounts
  useEffect(() => {
    loadScenarios(currentPage);
  }, [filters]);

  // Load scenarios on page change
  useEffect(() => {
    if (currentPage > 1) {
      loadScenarios(currentPage);
    }
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="Scenario Moderation"
          subtitle="Review and moderate scenario content"
          actions={
            <Button
              onClick={() => loadScenarios(currentPage)}
              disabled={loading}
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          }
        />

        <ScenarioModerationFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        <div className="bg-slate-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Scenarios ({total})
              </h2>
              <p className="text-slate-400 text-sm">
                Page {currentPage} of {totalPages || 1}
              </p>
            </div>
          </div>

          <ScenarioModerationTable
            scenarios={scenarios}
            onBlock={handleBlock}
            onUnblock={handleUnblock}
            loading={loading}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || loading}
                className="border-gray-600 text-gray-300"
              >
                Previous
              </Button>
              
              <span className="text-sm text-slate-400 px-4">
                {currentPage} / {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || loading}
                className="border-gray-600 text-gray-300"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScenarioModeration;
