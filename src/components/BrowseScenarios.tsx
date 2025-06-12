
import { useState } from 'react';
import { Scenario } from '@/types/scenario';
import { MOCK_SCENARIOS } from '@/data/mockScenarios';
import { SCENARIO_CATEGORIES } from '@/data/scenarioCategories';
import SearchAndFilters from './browse/SearchAndFilters';
import ScenarioGrid from './browse/ScenarioGrid';

const BrowseScenarios = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [scenarios, setScenarios] = useState<Scenario[]>(MOCK_SCENARIOS);

  const toggleLike = (id: string) => {
    setScenarios(prev => prev.map(scenario => 
      scenario.id === id ? { ...scenario, is_liked: !scenario.is_liked } : scenario
    ));
  };

  const toggleBookmark = (id: string) => {
    setScenarios(prev => prev.map(scenario => 
      scenario.id === id ? { ...scenario, is_bookmarked: !scenario.is_bookmarked } : scenario
    ));
  };

  const filteredScenarios = scenarios.filter(scenario => {
    const matchesSearch = scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scenario.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || scenario.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const hasFilters = searchQuery !== '' || selectedCategory !== 'all';

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Fixed Professional Header */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/50 backdrop-blur border-b border-slate-600 flex-shrink-0">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Training Scenarios
          </h1>
          <p className="text-slate-300">
            Practice critical decision-making with AI-powered multi-character scenarios
          </p>
        </div>
      </div>

      {/* Fixed Enhanced Search & Filters */}
      <SearchAndFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultCount={filteredScenarios.length}
      />

      {/* Scrollable Scenario Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <ScenarioGrid
            scenarios={filteredScenarios}
            onLike={toggleLike}
            onBookmark={toggleBookmark}
            onClearFilters={handleClearFilters}
            hasFilters={hasFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default BrowseScenarios;
