
import { supabase } from '@/integrations/supabase/client';
import { ScenarioFilters } from './scenarioTypes';

export const buildScenarioQuery = (isPublic?: boolean) => {
  return supabase
    .from('scenarios')
    .select(`
      *,
      scenario_characters(
        id,
        name,
        role,
        personality,
        expertise_keywords
      )
    `, { count: 'exact' });
};

export const applyScenarioFilters = async (query: any, filters: ScenarioFilters, userId?: string) => {
  // Apply search filter
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  // Apply category filter for public scenarios
  if (filters.category && filters.category !== 'all') {
    query = query.ilike('description', `%${filters.category}%`);
  }

  // Apply public/private filter
  if (filters.isPublic !== undefined) {
    query = query.eq('is_public', filters.isPublic);
  }

  // Apply liked filter - only if user is authenticated
  if (filters.showLikedOnly && userId) {
    const { data: likedScenarios } = await supabase
      .from('scenario_likes')
      .select('scenario_id')
      .eq('user_id', userId);
    
    const likedIds = likedScenarios?.map(item => item.scenario_id) || [];
    if (likedIds.length > 0) {
      query = query.in('id', likedIds);
    } else {
      // If no liked scenarios, return empty result
      query = query.eq('id', '00000000-0000-0000-0000-000000000000');
    }
  }

  // Apply bookmarked filter - only if user is authenticated
  if (filters.showBookmarkedOnly && userId) {
    const { data: bookmarkedScenarios } = await supabase
      .from('scenario_bookmarks')
      .select('scenario_id')
      .eq('user_id', userId);
    
    const bookmarkedIds = bookmarkedScenarios?.map(item => item.scenario_id) || [];
    if (bookmarkedIds.length > 0) {
      query = query.in('id', bookmarkedIds);
    } else {
      // If no bookmarked scenarios, return empty result
      query = query.eq('id', '00000000-0000-0000-0000-000000000000');
    }
  }

  return query;
};

export const applySorting = (query: any, sortBy: string) => {
  switch (sortBy) {
    case 'created_asc':
      return query.order('created_at', { ascending: true });
    case 'title':
      return query.order('title', { ascending: true });
    case 'popularity':
      return query.order('play_count', { ascending: false });
    case 'rating':
      return query.order('average_score', { ascending: false, nullsFirst: false });
    default:
      return query.order('created_at', { ascending: false });
  }
};

export const applyPagination = (query: any, page: number, limit: number) => {
  const startRange = (page - 1) * limit;
  const endRange = startRange + limit - 1;
  return query.range(startRange, endRange);
};
