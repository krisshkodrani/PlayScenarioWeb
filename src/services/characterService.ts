import { supabase } from '@/integrations/supabase/client';
import { Character, CharacterData, CharacterStats, CharacterFilters } from '@/types/character';

export interface DatabaseCharacter {
  id: string;
  name: string;
  role: string;
  personality: string;
  expertise_keywords: string[];
  creator_id: string;
  created_at: string;
  backstory?: string;
  motivations?: string;
  speech_patterns?: string;
  is_player_character: boolean;
}

export const characterService = {
  // Get a single character by ID
  async getCharacterById(characterId: string): Promise<DatabaseCharacter | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('scenario_characters')
      .select('*')
      .eq('id', characterId)
      .eq('creator_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching character:', error);
      throw error;
    }

    return data;
  },

  // Create a new character
  async createCharacter(characterData: CharacterData): Promise<DatabaseCharacter | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('scenario_characters')
      .insert({
        name: characterData.name,
        personality: characterData.personality,
        expertise_keywords: characterData.expertise_keywords,
        is_player_character: characterData.is_player_character,
        creator_id: user.id,
        role: 'Team Member', // Default role
        scenario_id: null // This will be set when character is used in a scenario
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating character:', error);
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
      .from('scenario_characters')
      .select('*', { count: 'exact' })
      .eq('creator_id', user.id);

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
      created_at: char.created_at,
      scenario_count: 0, // TODO: Calculate from actual usage
      total_responses: 0, // TODO: Get from character_usage_stats
      average_rating: 0, // TODO: Get from character_usage_stats
      avatar_color: generateAvatarColor(char.name),
      last_used: char.created_at // TODO: Get from character_usage_stats
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
      .from('scenario_characters')
      .select('id, name, created_at')
      .eq('creator_id', user.id);

    if (error) {
      console.error('Error fetching character stats:', error);
      throw error;
    }

    const totalCharacters = data?.length || 0;
    const activeCharacters = totalCharacters; // For now, all characters are considered active
    const mostUsedCharacter = data?.[0]?.name || '';
    const averageRating = 0; // TODO: Calculate from character_usage_stats

    return {
      totalCharacters,
      activeCharacters,
      mostUsedCharacter,
      averageRating
    };
  },

  // Update a character
  async updateCharacter(characterId: string, updates: Partial<CharacterData>): Promise<DatabaseCharacter | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('scenario_characters')
      .update({
        ...(updates.name && { name: updates.name }),
        ...(updates.personality && { personality: updates.personality }),
        ...(updates.expertise_keywords && { expertise_keywords: updates.expertise_keywords }),
        ...(updates.is_player_character !== undefined && { is_player_character: updates.is_player_character })
      })
      .eq('id', characterId)
      .eq('creator_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating character:', error);
      throw error;
    }

    return data;
  },

  // Delete a character
  async deleteCharacter(characterId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('scenario_characters')
      .delete()
      .eq('id', characterId)
      .eq('creator_id', user.id);

    if (error) {
      console.error('Error deleting character:', error);
      throw error;
    }
  },

  // Duplicate a character
  async duplicateCharacter(characterId: string): Promise<DatabaseCharacter | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // First, get the original character
    const { data: original, error: fetchError } = await supabase
      .from('scenario_characters')
      .select('*')
      .eq('id', characterId)
      .eq('creator_id', user.id)
      .single();

    if (fetchError) {
      console.error('Error fetching character for duplication:', fetchError);
      throw fetchError;
    }

    if (!original) {
      throw new Error('Character not found');
    }

    // Create a duplicate with a modified name
    const { data, error } = await supabase
      .from('scenario_characters')
      .insert({
        name: `${original.name} (Copy)`,
        personality: original.personality,
        expertise_keywords: original.expertise_keywords,
        is_player_character: original.is_player_character,
        role: original.role,
        backstory: original.backstory,
        motivations: original.motivations,
        speech_patterns: original.speech_patterns,
        creator_id: user.id,
        scenario_id: null
      })
      .select()
      .single();

    if (error) {
      console.error('Error duplicating character:', error);
      throw error;
    }

    return data;
  }
};

// Helper function to generate consistent avatar colors
function generateAvatarColor(name: string): string {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', 
    '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}
