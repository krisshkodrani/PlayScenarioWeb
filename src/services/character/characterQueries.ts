import { supabase } from '@/integrations/supabase/client';
import { Character, CharacterStats, CharacterFilters } from '@/types/character';
import { DatabaseCharacter } from './characterTypes';
import { getCharacterColor } from '@/utils/characterColors';

export const characterQueries = {
  // Get a single character by ID
  async getCharacterById(characterId: string): Promise<DatabaseCharacter | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('id', characterId)
      .eq('creator_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Character not found
      }
      console.error('Error fetching character:', error);
      throw error;
    }

    return data;
  },

  // Get all characters for the current user
  async getUserCharacters(filters?: CharacterFilters, page = 1, limit = 12): Promise<{
    characters: Character[];
    total: number;
  }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    let query = supabase
      .from('characters')
      .select('*', { count: 'exact' })
      .eq('creator_id', user.id)
      .eq('status', 'active');

    // Apply filters
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,personality.ilike.%${filters.search}%,role.ilike.%${filters.search}%`);
    }

    if (filters?.role) {
      query = query.ilike('role', `%${filters.role}%`);
    }

    if (filters?.expertise) {
      query = query.contains('expertise_keywords', [filters.expertise]);
    }

    // Apply sorting
    switch (filters?.sortBy) {
      case 'name':
        query = query.order('name');
        break;
      case 'created':
        query = query.order('created_at', { ascending: false });
        break;
      case 'usage':
        // For now, sort by created_at as we don't have usage stats yet
        query = query.order('created_at', { ascending: false });
        break;
      case 'rating':
        // For now, sort by created_at as we don't have rating stats yet
        query = query.order('created_at', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    const startRange = (page - 1) * limit;
    const endRange = startRange + limit - 1;
    query = query.range(startRange, endRange);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching characters:', error);
      throw error;
    }

    // Transform database characters to UI format
    const characters: Character[] = (data || []).map(char => ({
      id: char.id,
      name: char.name,
      role: char.role,
      personality: char.personality,
      expertise_keywords: char.expertise_keywords,
      avatar_url: char.avatar_url,
      created_at: char.created_at,
      scenario_count: 0, // Will be calculated on demand if needed
      total_responses: 0, // Will be calculated on demand if needed
      average_rating: 0, // Will be calculated on demand if needed
      avatar_color: getCharacterColor(char.name),
      last_used: char.created_at // Fallback to creation date
    }));

    return {
      characters,
      total: count || 0
    };
  },

  // Get character statistics
  async getCharacterStats(): Promise<CharacterStats> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('characters')
      .select('id, name, created_at')
      .eq('creator_id', user.id)
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching character stats:', error);
      throw error;
    }

    const totalCharacters = data?.length || 0;
    const activeCharacters = totalCharacters; // For now, all characters are considered active
    const mostUsedCharacter = data?.[0]?.name || '';
    const averageRating = 0; // Will be calculated on demand if needed

    return {
      totalCharacters,
      activeCharacters,
      mostUsedCharacter,
      averageRating
    };
  }
};