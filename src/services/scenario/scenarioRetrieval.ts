import { supabase } from '@/integrations/supabase/client';
import { Scenario } from '@/types/scenario';
import { ScenarioFilters, ScenarioStats, ScenarioPaginationResult } from './scenarioTypes';
import { buildScenarioQuery, applyScenarioFilters, applySorting, applyPagination, getUserInteractionIds } from './scenarioQueries';
import { mapDatabaseScenario } from './scenarioTransforms';

export const getUserScenarios = async (
  filters: ScenarioFilters, 
  page = 1, 
  limit = 12
): Promise<ScenarioPaginationResult<Scenario>> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Pre-fetch user interaction IDs if needed
  const { likedIds, bookmarkedIds } = await getUserInteractionIds(user.id, filters);

  let query = buildScenarioQuery().eq('creator_id', user.id);
  query = applyScenarioFilters(query, filters, likedIds, bookmarkedIds);
  query = applySorting(query, filters.sortBy);
  query = applyPagination(query, page, limit);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching user scenarios:', error);
    throw error;
  }

  const scenarios = (data || []).map(scenario => mapDatabaseScenario(scenario));

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
    
    // Pre-fetch user interaction IDs if needed and user is authenticated
    const { likedIds, bookmarkedIds } = user?.id 
      ? await getUserInteractionIds(user.id, filters)
      : { likedIds: undefined, bookmarkedIds: undefined };
    
    let query = buildScenarioQuery().eq('is_public', true);
    query = applyScenarioFilters(query, filters, likedIds, bookmarkedIds);
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
  try {
    const { data: scenario, error } = await supabase
      .from('scenarios')
      .select('*')
      .eq('id', scenarioId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Scenario not found
      }
      console.error('Error fetching scenario:', error);
      throw error;
    }
    
    // Fetch username separately
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', scenario.creator_id)
      .single();
    
    // Map the scenario with characters from database
    const mappedScenario = mapDatabaseScenario(scenario);
    
    // Enrich characters with avatar URLs from characters table
    if (mappedScenario.characters && mappedScenario.characters.length > 0) {
      const characterNames = mappedScenario.characters.map(char => char.name);
      
      const { data: characterDetails } = await supabase
        .from('characters')
        .select('name, avatar_url')
        .in('name', characterNames);
      
      // Create a map of character names to avatar URLs
      const avatarMap = new Map(
        characterDetails?.map(char => [char.name, char.avatar_url]) || []
      );
      
      // Update characters with avatar URLs
      mappedScenario.characters = mappedScenario.characters.map(char => ({
        ...char,
        avatar_url: avatarMap.get(char.name) || char.avatar_url
      }));
    }
    
    // Add username from separate query
    mappedScenario.created_by = profile?.username || 'Unknown';
    
    return mappedScenario;

  } catch (error) {
    console.error('Error in getScenarioById:', error);
    throw error;
  }
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
    return scenarios.map(s => mapDatabaseScenario(s));
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
    
    // Add username from profiles
    mappedScenario.created_by = profileMap.get(scenario.creator_id) || 'Unknown';
    
    return {
      ...mappedScenario,
      is_liked: likedIds.has(scenario.id),
      is_bookmarked: bookmarkedIds.has(scenario.id)
    };
  });
};