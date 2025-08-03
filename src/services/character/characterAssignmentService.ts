import { supabase } from '@/integrations/supabase/client';

export interface CharacterAssignmentWithCharacter {
  id: string;
  scenario_id: string;
  character_id: string;
  is_player_character: boolean;
  assigned_at: string;
  assigned_by: string;
  character: {
    id: string;
    name: string;
    role: string;
    personality: string;
    expertise_keywords: string[];
    avatar_url?: string;
    is_public: boolean;
  };
}

export const characterAssignmentService = {
  // Get all characters assigned to a scenario
  async getScenarioCharacters(scenarioId: string): Promise<CharacterAssignmentWithCharacter[]> {
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

  // Assign a character to a scenario
  async assignCharacterToScenario(
    scenarioId: string,
    characterId: string,
    isPlayerCharacter: boolean = false
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('scenario_character_assignments')
      .insert({
        scenario_id: scenarioId,
        character_id: characterId,
        is_player_character: isPlayerCharacter,
        assigned_by: user.id
      });

    if (error) {
      console.error('Error assigning character to scenario:', error);
      throw error;
    }
  },

  // Remove a character from a scenario
  async removeCharacterFromScenario(scenarioId: string, characterId: string): Promise<void> {
    const { error } = await supabase
      .from('scenario_character_assignments')
      .delete()
      .eq('scenario_id', scenarioId)
      .eq('character_id', characterId);

    if (error) {
      console.error('Error removing character from scenario:', error);
      throw error;
    }
  },

  // Update character assignment (e.g., toggle player character status)
  async updateCharacterAssignment(
    scenarioId: string,
    characterId: string,
    updates: { is_player_character?: boolean }
  ): Promise<void> {
    const { error } = await supabase
      .from('scenario_character_assignments')
      .update(updates)
      .eq('scenario_id', scenarioId)
      .eq('character_id', characterId);

    if (error) {
      console.error('Error updating character assignment:', error);
      throw error;
    }
  }
};