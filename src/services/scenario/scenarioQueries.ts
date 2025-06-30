
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

export const applyScenarioFilters = (query: any, filters: ScenarioFilters, userId?: string) => {
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
    query = query.in('id', 
      supabase
        .from('scenario_likes')
        .select('scenario_id')
        .eq('user_id', userId)
    );
  }

  // Apply bookmarked filter - only if user is authenticated
  if (filters.showBookmarkedOnly && userId) {
    query = query.in('id',
      supabase
        .from('scenario_bookmarks')
        .select('scenario_id')
        .eq('user_id', userId)
    );
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
