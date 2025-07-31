import { supabase } from '@/integrations/supabase/client';
import { CharacterAssignment } from '@/types/character';

interface AssignCharacterRequest {
  scenarioId: string;
  characterId: string;
  isPlayerCharacter: boolean;
}

export const scenarioCharacterService = {
  // Assign a character to a scenario
  async assignCharacterToScenario(request: AssignCharacterRequest): Promise<CharacterAssignment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('scenario_character_assignments')
      .insert({
        scenario_id: request.scenarioId,
        character_id: request.characterId,
        is_player_character: request.isPlayerCharacter,
        assigned_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error assigning character to scenario:', error);
      throw error;
    }

    return data;
  },

  // Remove a character from a scenario
  async removeCharacterFromScenario(scenarioId: string, characterId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('scenario_character_assignments')
      .delete()
      .eq('scenario_id', scenarioId)
      .eq('character_id', characterId)
      .eq('assigned_by', user.id);

    if (error) {
      console.error('Error removing character from scenario:', error);
      throw error;
    }
  },

  // Update character assignment (e.g., toggle player character status)
  async updateCharacterAssignment(
    scenarioId: string, 
    characterId: string, 
    updates: { isPlayerCharacter?: boolean }
  ): Promise<CharacterAssignment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const updateData: any = {};
    if (updates.isPlayerCharacter !== undefined) {
      updateData.is_player_character = updates.isPlayerCharacter;
    }

    const { data, error } = await supabase
      .from('scenario_character_assignments')
      .update(updateData)
      .eq('scenario_id', scenarioId)
      .eq('character_id', characterId)
      .eq('assigned_by', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating character assignment:', error);
      throw error;
    }

    return data;
  },

  // Get all characters assigned to a scenario
  async getScenarioCharacters(scenarioId: string): Promise<(CharacterAssignment & {
    character: {
      id: string;
      name: string;
      role: string;
      personality: string;
      expertise_keywords: string[];
      avatar_url?: string;
      is_public: boolean;
    }
  })[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('scenario_character_assignments')
      .select(`
        *,
        character:characters (
          id,
          name,
          role,
          personality,
          expertise_keywords,
          avatar_url,
          is_public
        )
      `)
      .eq('scenario_id', scenarioId);

    if (error) {
      console.error('Error fetching scenario characters:', error);
      throw error;
    }

    return data || [];
  },

  // Get public characters that can be assigned to scenarios
  async getPublicCharacters(): Promise<{
    id: string;
    name: string;
    role: string;
    personality: string;
    expertise_keywords: string[];
    avatar_url?: string;
    creator_id: string;
    created_at: string;
  }[]> {
    const { data, error } = await supabase
      .from('characters')
      .select('id, name, role, personality, expertise_keywords, avatar_url, creator_id, created_at')
      .eq('is_public', true)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching public characters:', error);
      throw error;
    }

    return data || [];
  }
};