
import { supabase } from '@/integrations/supabase/client';
import { ScenarioFilters } from './scenarioTypes';

export const buildScenarioQuery = (isPublic?: boolean) => {
  return supabase
    .from('scenarios')
    .select(`
      *,
      scenario_character_assignments(
        *,
        character:characters(
          id,
          name,
          role,
          personality,
          expertise_keywords,
          avatar_url
        )
      )
    `, { count: 'exact' });
};

export const applyScenarioFilters = (query: any, filters: ScenarioFilters, likedIds?: string[], bookmarkedIds?: string[]) => {
  // Validate that we have a proper query object
  if (!query || typeof query.or !== 'function') {
    console.error('Invalid query object passed to applyScenarioFilters:', query);
    return query;
  }

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

  // Apply liked filter using pre-fetched IDs
  if (filters.showLikedOnly && likedIds !== undefined) {
    if (likedIds.length > 0) {
      query = query.in('id', likedIds);
    } else {
      // Filter by impossible ID to return no results while maintaining query chain
      query = query.eq('id', '00000000-0000-0000-0000-000000000000');
    }
  }

  // Apply bookmarked filter using pre-fetched IDs
  if (filters.showBookmarkedOnly && bookmarkedIds !== undefined) {
    if (bookmarkedIds.length > 0) {
      query = query.in('id', bookmarkedIds);
    } else {
      // Filter by impossible ID to return no results while maintaining query chain
      query = query.eq('id', '00000000-0000-0000-0000-000000000000');
    }
  }

  return query;
};

// Helper function to pre-fetch user interaction IDs
export const getUserInteractionIds = async (userId: string, filters: ScenarioFilters) => {
  try {
    let likedIds: string[] | undefined = undefined;
    let bookmarkedIds: string[] | undefined = undefined;
    
    if (filters.showLikedOnly) {
      const { data: likedScenarios } = await supabase
        .from('scenario_likes')
        .select('scenario_id')
        .eq('user_id', userId);
      likedIds = likedScenarios?.map(item => item.scenario_id) || [];
    }
    
    if (filters.showBookmarkedOnly) {
      const { data: bookmarkedScenarios } = await supabase
        .from('scenario_bookmarks')
        .select('scenario_id')
        .eq('user_id', userId);
      bookmarkedIds = bookmarkedScenarios?.map(item => item.scenario_id) || [];
    }
    
    return { likedIds, bookmarkedIds };
  } catch (error) {
    console.error('Error fetching user interaction IDs:', error);
    return { 
      likedIds: filters.showLikedOnly ? [] : undefined, 
      bookmarkedIds: filters.showBookmarkedOnly ? [] : undefined 
    };
  }
};

export const applySorting = (query: any, sortBy: string) => {
  // Add validation to ensure query is valid before calling .order()
  if (!query || typeof query.order !== 'function') {
    console.error('Invalid query object passed to applySorting:', query);
    return query;
  }

  switch (sortBy) {
    case 'created_asc':
      return query.order('created_at', { ascending: true });
    case 'created_desc':
      return query.order('created_at', { ascending: false });
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
  // Add validation to ensure query is valid before calling .range()
  if (!query || typeof query.range !== 'function') {
    console.error('Invalid query object passed to applyPagination:', query);
    return query;
  }

  const startRange = (page - 1) * limit;
  const endRange = startRange + limit - 1;
  return query.range(startRange, endRange);
};
