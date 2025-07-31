import { supabase } from '@/integrations/supabase/client';
import { CharacterData } from '@/types/character';
import { DatabaseCharacter, CharacterCreateData, CharacterUpdateData } from './characterTypes';

export const characterMutations = {
  // Create a new character
  async createCharacter(characterData: CharacterData): Promise<DatabaseCharacter | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const createData: CharacterCreateData = {
      name: characterData.name,
      role: characterData.role || 'Character',
      personality: characterData.personality,
      expertise_keywords: characterData.expertise_keywords,
      avatar_url: characterData.avatar_url,
      is_public: characterData.is_public || false,
    };

    const { data, error } = await supabase
      .from('characters')
      .insert({
        ...createData,
        creator_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating character:', error);
      throw error;
    }

    return data;
  },

  // Update a character
  async updateCharacter(characterId: string, updates: Partial<CharacterData>): Promise<DatabaseCharacter | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const updateData: CharacterUpdateData = {};
    
    if (updates.name) updateData.name = updates.name;
    if (updates.role) updateData.role = updates.role;
    if (updates.personality) updateData.personality = updates.personality;
    if (updates.expertise_keywords) updateData.expertise_keywords = updates.expertise_keywords;
    if (updates.avatar_url !== undefined) updateData.avatar_url = updates.avatar_url;
    if (updates.is_public !== undefined) updateData.is_public = updates.is_public;

    const { data, error } = await supabase
      .from('characters')
      .update(updateData)
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
      .from('characters')
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
      .from('characters')
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
    const duplicateData: CharacterCreateData = {
      name: `${original.name} (Copy)`,
      role: original.role,
      personality: original.personality,
      expertise_keywords: original.expertise_keywords,
      avatar_url: original.avatar_url,
      is_public: original.is_public,
    };

    const { data, error } = await supabase
      .from('characters')
      .insert({
        ...duplicateData,
        creator_id: user.id,
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