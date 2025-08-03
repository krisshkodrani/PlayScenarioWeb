
import { supabase } from '@/integrations/supabase/client';
import { Scenario } from '@/types/scenario';
import { ScenarioFilters, ScenarioPaginationResult, ScenarioStats } from './scenarioTypes';
import { buildScenarioQuery, applyScenarioFilters, applySorting, applyPagination } from './scenarioQueries';
import { mapDatabaseScenario, enrichScenarioWithCharacters } from './scenarioTransforms';

export const getUserScenarios = async (
  filters: ScenarioFilters, 
  page = 1, 
  limit = 12
): Promise<ScenarioPaginationResult<Scenario>> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  let query = buildScenarioQuery().eq('creator_id', user.id);
  query = await applyScenarioFilters(query, filters, user.id);
  query = applySorting(query, filters.sortBy);
  query = applyPagination(query, page, limit);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching user scenarios:', error);
    throw error;
  }

  const scenarios = (data || []).map(scenario => {
    const mappedScenario = mapDatabaseScenario(scenario);
    const characters = scenario.scenario_character_assignments?.map((assignment: any) => assignment.character) || [];
    return enrichScenarioWithCharacters(mappedScenario, characters);
  });

  return {
    scenarios,
    total: count || 0
  };
};

export const getPublicScenarios = async (
  filters: ScenarioFilters, 
  page = 1, 
  limit = 12
): Promise<ScenarioPaginationResult<Scenario>> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    let query = buildScenarioQuery().eq('is_public', true);
    query = await applyScenarioFilters(query, filters, user?.id);
    query = applySorting(query, filters.sortBy);
    query = applyPagination(query, page, limit);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching public scenarios:', error);
      throw error;
    }

    const scenarios = await enrichScenariosWithUserData(data || []);

    return {
      scenarios,
      total: count || 0
    };
  } catch (error) {
    console.error('getPublicScenarios error:', error);
    throw error;
  }
};

export const getScenarioById = async (scenarioId: string): Promise<Scenario | null> => {
  const { data, error } = await supabase
    .from('scenarios')
    .select(`
      *,
      scenario_character_assignments(
        *,
        character:characters(*)
      )
    `)
    .eq('id', scenarioId)
    .single();

  if (error) {
    console.error('Error fetching scenario:', error);
    return null;
  }

  // Get profile separately if needed
  let profileData = null;
  if (data.creator_id) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', data.creator_id)
      .single();
    profileData = profile;
  }

  const scenario = mapDatabaseScenario(data);
  const characters = data.scenario_character_assignments?.map((assignment: any) => assignment.character) || [];
  const enrichedScenario = enrichScenarioWithCharacters(scenario, characters);
  
  // Add username if available
  if (profileData) {
    enrichedScenario.created_by = profileData.username || 'Unknown';
  }

  return enrichedScenario;
};

export const getScenarioStats = async (): Promise<ScenarioStats> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('scenarios')
    .select('id, is_public, play_count, average_score, like_count')
    .eq('creator_id', user.id);

  if (error) {
    console.error('Error fetching scenario stats:', error);
    throw error;
  }

  const totalScenarios = data?.length || 0;
  const publicScenarios = data?.filter(s => s.is_public).length || 0;
  const privateScenarios = totalScenarios - publicScenarios;
  const totalPlays = data?.reduce((sum, s) => sum + (s.play_count || 0), 0) || 0;
  const totalLikes = data?.reduce((sum, s) => sum + (s.like_count || 0), 0) || 0;
  const averageRating = totalScenarios > 0 
    ? data?.reduce((sum, s) => sum + (s.average_score || 0), 0) / totalScenarios 
    : 0;

  return {
    totalScenarios,
    publicScenarios,
    privateScenarios,
    totalPlays,
    totalLikes,
    averageRating
  };
};

const enrichScenariosWithUserData = async (scenarios: any[]): Promise<Scenario[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || scenarios.length === 0) {
    return scenarios.map(s => {
      const mappedScenario = mapDatabaseScenario(s);
      const characters = s.scenario_character_assignments?.map((assignment: any) => assignment.character) || [];
      return enrichScenarioWithCharacters(mappedScenario, characters);
    });
  }

  const scenarioIds = scenarios.map(s => s.id);

  const [likesResult, bookmarksResult] = await Promise.all([
    supabase
      .from('scenario_likes')
      .select('scenario_id')
      .eq('user_id', user.id)
      .in('scenario_id', scenarioIds),
    supabase
      .from('scenario_bookmarks')
      .select('scenario_id')
      .eq('user_id', user.id)
      .in('scenario_id', scenarioIds)
  ]);

  const likedIds = new Set(likesResult.data?.map(l => l.scenario_id) || []);
  const bookmarkedIds = new Set(bookmarksResult.data?.map(b => b.scenario_id) || []);

  // Get unique creator IDs and fetch their usernames
  const creatorIds = [...new Set(scenarios.map(s => s.creator_id))];
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username')
    .in('id', creatorIds);
  
  const profileMap = new Map(profiles?.map(p => [p.id, p.username]) || []);

  return scenarios.map(scenario => {
    const mappedScenario = mapDatabaseScenario(scenario);
    const characters = scenario.scenario_character_assignments?.map((assignment: any) => assignment.character) || [];
    const enrichedScenario = enrichScenarioWithCharacters(mappedScenario, characters);
    
    // Add username from profiles
    enrichedScenario.created_by = profileMap.get(scenario.creator_id) || 'Unknown';
    
    return {
      ...enrichedScenario,
      is_liked: likedIds.has(scenario.id),
      is_bookmarked: bookmarkedIds.has(scenario.id)
    };
  });
};
