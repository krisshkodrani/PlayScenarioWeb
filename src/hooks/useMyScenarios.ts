
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Scenario } from '@/types/scenario';
import { FilterState, ScenarioStats, PaginationState } from '@/types/my-scenarios';

// Map database scenario to frontend Scenario type
const mapDatabaseScenario = (dbScenario: any): Scenario => ({
  id: dbScenario.id,
  title: dbScenario.title,
  description: dbScenario.description,
  category: 'general', // Default category since it's not in DB schema
  difficulty: 'Intermediate', // Default difficulty since it's not in DB schema
  estimated_duration: dbScenario.max_turns ? dbScenario.max_turns * 2 : 30, // Estimate based on turns
  character_count: 0, // Will be populated separately
  characters: [],
  objectives: Array.isArray(dbScenario.objectives) ? dbScenario.objectives : [],
  created_at: dbScenario.created_at,
  created_by: 'You',
  play_count: dbScenario.play_count || 0,
  average_rating: dbScenario.average_score ? Number(dbScenario.average_score) : 0,
  tags: [],
  is_liked: false,
  is_bookmarked: false,
  is_public: dbScenario.is_public
});

export const useMyScenarios = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [scenarioStats, setScenarioStats] = useState<ScenarioStats>({
    totalScenarios: 0,
    publishedScenarios: 0,
    draftScenarios: 0,
    totalPlays: 0,
    totalLikes: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    status: (searchParams.get('status') as FilterState['status']) || 'all',
    search: searchParams.get('search') || '',
    sortBy: (searchParams.get('sortBy') as FilterState['sortBy']) || 'created_desc'
  });

  const [pagination, setPagination] = useState<PaginationState>({
    page: parseInt(searchParams.get('page') || '1'),
    limit: 12,
    total: 0
  });

  const fetchScenarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Not authenticated');
      }

      // Build query
      let query = supabase
        .from('scenarios')
        .select(`
          *,
          scenario_characters(count)
        `)
        .eq('creator_id', user.id);

      // Apply status filter
      if (filters.status === 'published') {
        query = query.eq('is_public', true);
      } else if (filters.status === 'private') {
        query = query.eq('is_public', false);
      }
      // 'draft' and 'all' don't need additional filtering for now

      // Apply search filter
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'created_asc':
          query = query.order('created_at', { ascending: true });
          break;
        case 'title':
          query = query.order('title', { ascending: true });
          break;
        case 'plays_desc':
          query = query.order('play_count', { ascending: false });
          break;
        case 'likes_desc':
          query = query.order('like_count', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Apply pagination
      const from = (pagination.page - 1) * pagination.limit;
      const to = from + pagination.limit - 1;
      query = query.range(from, to);

      const { data: scenariosData, error: scenariosError, count } = await supabase
        .from('scenarios')
        .select('*, scenario_characters(count)', { count: 'exact' })
        .eq('creator_id', user.id);

      if (scenariosError) {
        throw new Error('Failed to fetch scenarios');
      }

      // Map database scenarios to frontend format
      const mappedScenarios = (scenariosData || []).map((scenario: any) => ({
        ...mapDatabaseScenario(scenario),
        character_count: scenario.scenario_characters?.[0]?.count || 0
      }));

      // Calculate stats
      const totalScenarios = mappedScenarios.length;
      const publishedScenarios = mappedScenarios.filter(s => s.is_public).length;
      const draftScenarios = totalScenarios - publishedScenarios;
      const totalPlays = mappedScenarios.reduce((sum, s) => sum + s.play_count, 0);
      const totalLikes = mappedScenarios.reduce((sum, s) => sum + (s.is_liked ? 1 : 0), 0);
      const averageRating = mappedScenarios.reduce((sum, s) => sum + s.average_rating, 0) / (totalScenarios || 1);

      setScenarios(mappedScenarios);
      setScenarioStats({
        totalScenarios,
        publishedScenarios,
        draftScenarios,
        totalPlays,
        totalLikes,
        averageRating
      });
      setPagination(prev => ({ ...prev, total: count || 0 }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scenarios');
      console.error('Scenario fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.status !== 'all') params.set('status', filters.status);
    if (filters.search) params.set('search', filters.search);
    if (filters.sortBy !== 'created_desc') params.set('sortBy', filters.sortBy);
    if (pagination.page !== 1) params.set('page', pagination.page.toString());
    
    setSearchParams(params, { replace: true });
  }, [filters, pagination.page, setSearchParams]);

  // Fetch scenarios when filters change
  useEffect(() => {
    fetchScenarios();
  }, [fetchScenarios]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleDelete = async (scenarioId: string) => {
    if (!confirm('Are you sure you want to delete this scenario? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('scenarios')
        .delete()
        .eq('id', scenarioId);

      if (error) {
        throw error;
      }
      
      setScenarios(prev => prev.filter(s => s.id !== scenarioId));
      toast({
        title: "Scenario Deleted",
        description: "The scenario has been permanently deleted.",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete scenario. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async (scenarioId: string) => {
    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Not authenticated');
      }

      // Get original scenario
      const { data: originalScenario, error: fetchError } = await supabase
        .from('scenarios')
        .select('*')
        .eq('id', scenarioId)
        .single();

      if (fetchError || !originalScenario) {
        throw new Error('Failed to fetch original scenario');
      }

      // Create duplicate
      const { data: newScenario, error: insertError } = await supabase
        .from('scenarios')
        .insert({
          title: `${originalScenario.title} (Copy)`,
          description: originalScenario.description,
          creator_id: user.id,
          is_public: false, // Always make copies private
          objectives: originalScenario.objectives,
          win_conditions: originalScenario.win_conditions,
          lose_conditions: originalScenario.lose_conditions,
          max_turns: originalScenario.max_turns,
          initial_scene_prompt: originalScenario.initial_scene_prompt
        })
        .select()
        .single();

      if (insertError || !newScenario) {
        throw new Error('Failed to create duplicate');
      }

      // Refresh scenarios list
      await fetchScenarios();
      
      toast({
        title: "Scenario Duplicated",
        description: "A copy of the scenario has been created.",
      });
    } catch (error) {
      console.error('Duplicate error:', error);
      toast({
        title: "Duplication Failed",
        description: "Failed to duplicate scenario. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublic = async (scenarioId: string, makePublic: boolean) => {
    try {
      const { error } = await supabase
        .from('scenarios')
        .update({ is_public: makePublic })
        .eq('id', scenarioId);

      if (error) {
        throw error;
      }
      
      setScenarios(prev => prev.map(s => 
        s.id === scenarioId ? { ...s, is_public: makePublic } : s
      ));
      
      toast({
        title: makePublic ? "Scenario Published" : "Scenario Made Private",
        description: makePublic 
          ? "Your scenario is now visible to the public."
          : "Your scenario has been made private.",
      });
    } catch (error) {
      console.error('Toggle public error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update scenario visibility.",
        variant: "destructive",
      });
    }
  };

  return {
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
  };
};
