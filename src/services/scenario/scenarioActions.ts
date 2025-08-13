import { supabase } from '@/integrations/supabase/client';
import { ScenarioData } from '@/types/scenario';
import { Scenario } from '@/types/scenario';
import { mapDatabaseScenario } from './scenarioTransforms';
import { characterService } from '@/services/characterService';

export const createScenario = async (scenarioData: ScenarioData): Promise<Scenario | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Process characters - separate AI characters and player character
    const aiCharacters = [];
    let playerCharacter = null;
    
    for (const character of scenarioData.characters) {
      const characterData = {
        name: character.name,
        personality: character.personality,
        expertise_keywords: character.expertise_keywords,
        role: character.role || 'Character',
        avatar_color: `bg-${['blue', 'green', 'purple', 'red', 'yellow', 'indigo', 'pink'][Math.floor(Math.random() * 7)]}-500`
      };

      if (character.is_player_character) {
        playerCharacter = characterData;
      } else {
        aiCharacters.push(characterData);
      }
    }

    // Create the scenario with embedded characters
    const { data: scenario, error } = await supabase
      .from('scenarios')
      .insert({
        title: scenarioData.title,
        description: scenarioData.description,
        objectives: scenarioData.objectives,
        win_conditions: scenarioData.win_conditions,
        lose_conditions: scenarioData.lose_conditions,
        max_turns: scenarioData.max_turns,
        scenario_opening_message: scenarioData.scenario_opening_message,
        is_public: scenarioData.is_public,
        creator_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating scenario:', error);
      throw error;
    }

    // Return mapped scenario with embedded characters
    const mappedScenario = mapDatabaseScenario(scenario);
    mappedScenario.characters = [...aiCharacters, ...(playerCharacter ? [playerCharacter] : [])];
    mappedScenario.character_count = mappedScenario.characters.length;
    
    return mappedScenario;

  } catch (error) {
    console.error('Error in createScenario:', error);
    throw error;
  }
};

export const updateScenario = async (scenarioId: string, updates: Partial<ScenarioData>): Promise<Scenario | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Update the scenario
    const { data: scenario, error } = await supabase
      .from('scenarios')
      .update({
        title: updates.title,
        description: updates.description,
        objectives: updates.objectives,
        win_conditions: updates.win_conditions,
        lose_conditions: updates.lose_conditions,
        max_turns: updates.max_turns,
        scenario_opening_message: updates.scenario_opening_message,
        is_public: updates.is_public
      })
      .eq('id', scenarioId)
      .select()
      .single();

    if (error) {
      console.error('Error updating scenario:', error);
      throw error;
    }

    // Process characters if provided
    let characters = [];
    if (updates.characters) {
      const aiCharacters = [];
      let playerCharacter = null;
      
      for (const character of updates.characters) {
        const characterData = {
          name: character.name,
          personality: character.personality,
          expertise_keywords: character.expertise_keywords,
          role: character.role || 'Character',
          avatar_color: `bg-${['blue', 'green', 'purple', 'red', 'yellow', 'indigo', 'pink'][Math.floor(Math.random() * 7)]}-500`
        };

        if (character.is_player_character) {
          playerCharacter = characterData;
        } else {
          aiCharacters.push(characterData);
        }
      }
      
      characters = [...aiCharacters, ...(playerCharacter ? [playerCharacter] : [])];
    }

    // Return mapped scenario with characters
    const mappedScenario = mapDatabaseScenario(scenario);
    if (updates.characters) {
      mappedScenario.characters = characters;
      mappedScenario.character_count = characters.length;
    }
    
    return mappedScenario;

  } catch (error) {
    console.error('Error in updateScenario:', error);
    throw error;
  }
};

export const deleteScenario = async (scenarioId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Delete the scenario
  const { error } = await supabase
    .from('scenarios')
    .delete()
    .eq('id', scenarioId)
    .eq('creator_id', user.id);

  if (error) {
    console.error('Error deleting scenario:', error);
    throw error;
  }
};

export const toggleScenarioPublic = async (scenarioId: string, isPublic: boolean): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('scenarios')
    .update({ is_public: isPublic })
    .eq('id', scenarioId)
    .eq('creator_id', user.id);

  if (error) {
    console.error('Error toggling scenario public status:', error);
    throw error;
  }
};

export const duplicateScenario = async (scenarioId: string): Promise<Scenario | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get the original scenario with its characters
    const originalScenario = await import('./scenarioRetrieval').then(module => 
      module.getScenarioById(scenarioId)
    );

    if (!originalScenario) {
      throw new Error('Original scenario not found');
    }

    // Create new scenario with embedded characters
    const aiCharacters = originalScenario.characters.filter(char => char.role !== 'Player');
    const playerCharacter = originalScenario.characters.find(char => char.role === 'Player');

    const { data: newScenario, error: createError } = await supabase
      .from('scenarios')
      .insert({
        title: `${originalScenario.title} (Copy)`,
        description: originalScenario.description,
        objectives: originalScenario.objectives,
        win_conditions: originalScenario.win_conditions || '',
        lose_conditions: originalScenario.lose_conditions || '',
        max_turns: originalScenario.max_turns,
        scenario_opening_message: originalScenario.scenario_opening_message || '',
        is_public: false, // Always create copies as private
        creator_id: user.id
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating duplicate scenario:', createError);
      throw createError;
    }

    // Return the duplicated scenario with characters
    const mappedScenario = mapDatabaseScenario(newScenario);
    mappedScenario.characters = originalScenario.characters;
    mappedScenario.character_count = originalScenario.characters.length;
    
    return mappedScenario;

  } catch (error) {
    console.error('Error in duplicateScenario:', error);
    throw error;
  }
};