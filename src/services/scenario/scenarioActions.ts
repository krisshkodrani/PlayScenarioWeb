import { supabase } from '@/integrations/supabase/client';
import { ScenarioData, Scenario } from '@/types/scenario';
import { mapDatabaseScenario, enrichScenarioWithCharacters } from './scenarioTransforms';

export const createScenario = async (scenarioData: ScenarioData): Promise<Scenario | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  console.log('Creating scenario with data:', scenarioData);
  console.log('Characters in scenario data:', scenarioData.characters);

  // Prepare scenario data with difficulty settings
  const scenarioPayload = {
    title: scenarioData.title,
    description: scenarioData.description,
    objectives: scenarioData.objectives as any,
    win_conditions: scenarioData.win_conditions,
    lose_conditions: scenarioData.lose_conditions,
    max_turns: scenarioData.max_turns,
    scenario_opening_message: scenarioData.scenario_opening_message,
    is_public: scenarioData.is_public,
    creator_id: user.id,
    // Add difficulty and show_difficulty as metadata in objectives
    ...(scenarioData.difficulty && {
      objectives: [...(scenarioData.objectives as any), {
        _difficulty: scenarioData.difficulty,
        _show_difficulty: scenarioData.show_difficulty ?? true
      }]
    })
  };

  const { data, error } = await supabase
    .from('scenarios')
    .insert(scenarioPayload)
    .select()
    .single();

  if (error) {
    console.error('Error creating scenario:', error);
    throw error;
  }

  console.log('Scenario created successfully:', data);

  // Create associated characters if they exist
  if (scenarioData.characters && scenarioData.characters.length > 0) {
    console.log('Creating characters for scenario:', data.id);
    
    for (const char of scenarioData.characters) {
      // First, create or find the character in characters table
      let characterId = char.id;
      
      if (!characterId) {
        // Create new character
        const { data: newCharacter, error: charError } = await supabase
          .from('characters')
          .insert({
            name: char.name,
            personality: char.personality,
            expertise_keywords: char.expertise_keywords,
            creator_id: user.id,
            role: (char as any).role || 'Team Member',
            avatar_url: (char as any).avatar_url,
            is_public: false // Characters created within scenarios are private by default
          })
          .select()
          .single();

        if (charError) {
          console.error('Error creating character:', charError);
          continue; // Skip this character and continue with others
        }
        
        characterId = newCharacter.id;
        console.log('Character created successfully:', newCharacter);
      }

      // Then assign the character to the scenario
      const { error: assignError } = await supabase
        .from('scenario_character_assignments')
        .insert({
          scenario_id: data.id,
          character_id: characterId,
            is_player_character: char.is_player_character,
          assigned_by: user.id
        });

      if (assignError) {
        console.error('Error assigning character to scenario:', assignError);
        // Continue with other characters
      } else {
        console.log('Character assigned to scenario successfully');
      }
    }
  } else {
    console.log('No characters to create for this scenario');
  }

  return mapDatabaseScenario(data);
};

export const updateScenario = async (scenarioId: string, updates: Partial<ScenarioData>): Promise<Scenario | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  console.log('Updating scenario:', scenarioId, 'with data:', updates);

  // Prepare scenario updates (excluding characters)
  const { characters, difficulty, show_difficulty, ...scenarioUpdates } = updates;
  
  const dbUpdates: any = { ...scenarioUpdates };
  if (dbUpdates.objectives) {
    // If difficulty settings are provided, embed them in objectives
    if (difficulty !== undefined || show_difficulty !== undefined) {
      const objectives = [...(dbUpdates.objectives as any)];
      // Remove any existing difficulty metadata
      const filteredObjectives = objectives.filter(obj => !obj._difficulty && !obj._show_difficulty);
      // Add new difficulty metadata if provided
      if (difficulty) {
        filteredObjectives.push({
          _difficulty: difficulty,
          _show_difficulty: show_difficulty ?? true
        });
      }
      dbUpdates.objectives = filteredObjectives;
    }
    dbUpdates.objectives = dbUpdates.objectives as any;
  }

  // Update the scenario
  const { data, error } = await supabase
    .from('scenarios')
    .update(dbUpdates)
    .eq('id', scenarioId)
    .eq('creator_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating scenario:', error);
    throw error;
  }

  console.log('Scenario updated successfully:', data);

  // Handle character updates if provided
  if (characters !== undefined) {
    console.log('Updating characters for scenario:', scenarioId);
    
    // Delete existing character assignments
    const { error: deleteError } = await supabase
      .from('scenario_character_assignments')
      .delete()
      .eq('scenario_id', scenarioId);

    if (deleteError) {
      console.error('Error deleting existing character assignments:', deleteError);
      // Continue anyway - we'll try to create the new assignments
    } else {
      console.log('Existing character assignments deleted successfully');
    }

    // Create new character assignments if any exist
    if (characters.length > 0) {
      for (const char of characters) {
        let characterId = char.id;
        
        if (!characterId) {
          // Create new character
          const { data: newCharacter, error: charError } = await supabase
            .from('characters')
            .insert({
              name: char.name,
              personality: char.personality,
              expertise_keywords: char.expertise_keywords,
              creator_id: user.id,
              role: (char as any).role || 'Team Member',
              avatar_url: (char as any).avatar_url,
              is_public: false
            })
            .select()
            .single();

          if (charError) {
            console.error('Error creating character:', charError);
            continue;
          }
          
          characterId = newCharacter.id;
        }

        // Assign character to scenario
        const { error: assignError } = await supabase
          .from('scenario_character_assignments')
          .insert({
            scenario_id: scenarioId,
            character_id: characterId,
            is_player_character: char.is_player_character,
            assigned_by: user.id
          });

        if (assignError) {
          console.error('Error assigning character to scenario:', assignError);
        }
      }
    }
  }

  return mapDatabaseScenario(data);
};

export const deleteScenario = async (scenarioId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Delete associated character assignments first
  await supabase
    .from('scenario_character_assignments')
    .delete()
    .eq('scenario_id', scenarioId);

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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get original scenario with character assignments
  const { data: original, error: fetchError } = await supabase
    .from('scenarios')
    .select(`
      *,
      scenario_character_assignments(
        *,
        character:characters(*)
      )
    `)
    .eq('id', scenarioId)
    .single();

  if (fetchError) {
    console.error('Error fetching scenario for duplication:', fetchError);
    throw fetchError;
  }

  // Create duplicate scenario
  const { data: newScenario, error: insertError } = await supabase
    .from('scenarios')
    .insert({
      title: `${original.title} (Copy)`,
      description: original.description,
      objectives: original.objectives,
      win_conditions: original.win_conditions,
      lose_conditions: original.lose_conditions,
      max_turns: original.max_turns,
      scenario_opening_message: original.scenario_opening_message,
      is_public: false,
      creator_id: user.id
    })
    .select()
    .single();

  if (insertError) {
    console.error('Error duplicating scenario:', insertError);
    throw insertError;
  }

  // Duplicate character assignments
  if (original.scenario_character_assignments && original.scenario_character_assignments.length > 0) {
    for (const assignment of original.scenario_character_assignments) {
      const originalChar = assignment.character;
      
      // Create a duplicate of the character
      const { data: duplicatedChar, error: dupCharError } = await supabase
        .from('characters')
        .insert({
          name: `${originalChar.name} (Copy)`,
          personality: originalChar.personality,
          expertise_keywords: originalChar.expertise_keywords,
          role: originalChar.role,
          avatar_url: originalChar.avatar_url,
          creator_id: user.id,
          is_public: false
        })
        .select()
        .single();

      if (dupCharError) {
        console.error('Error duplicating character:', dupCharError);
        continue;
      }

      // Assign the duplicated character to the new scenario
      await supabase
        .from('scenario_character_assignments')
        .insert({
          scenario_id: newScenario.id,
          character_id: duplicatedChar.id,
          is_player_character: assignment.is_player_character,
          assigned_by: user.id
        });
    }
  }

  return mapDatabaseScenario(newScenario);
};
