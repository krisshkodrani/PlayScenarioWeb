import { supabase } from '@/integrations/supabase/client';
import { ScenarioData, Scenario } from '@/types/scenario';
import { mapDatabaseScenario, enrichScenarioWithCharacters } from './scenarioTransforms';

export const createScenario = async (scenarioData: ScenarioData): Promise<Scenario | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  console.log('Creating scenario with data:', scenarioData);
  console.log('Characters in scenario data:', scenarioData.characters);

  const { data, error } = await supabase
    .from('scenarios')
    .insert({
      title: scenarioData.title,
      description: scenarioData.description,
      objectives: scenarioData.objectives as any,
      win_conditions: scenarioData.win_conditions,
      lose_conditions: scenarioData.lose_conditions,
      max_turns: scenarioData.max_turns,
      initial_scene_prompt: scenarioData.initial_scene_prompt,
      is_public: scenarioData.is_public,
      creator_id: user.id
    })
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
    
    const charactersToInsert = scenarioData.characters.map(char => ({
      scenario_id: data.id,
      name: char.name,
      personality: char.personality,
      expertise_keywords: char.expertise_keywords,
      is_player_character: char.is_player_character,
      creator_id: user.id,
      role: 'Team Member'
    }));

    console.log('Characters to insert:', charactersToInsert);

    const { error: charactersError, data: charactersData } = await supabase
      .from('scenario_characters')
      .insert(charactersToInsert)
      .select();

    if (charactersError) {
      console.error('Error creating scenario characters:', charactersError);
      // Don't throw error here, let the scenario save succeed even if characters fail
      // We can retry character creation later
    } else {
      console.log('Characters created successfully:', charactersData);
    }
  } else {
    console.log('No characters to create for this scenario');
  }

  return mapDatabaseScenario(data);
};

export const updateScenario = async (scenarioId: string, updates: Partial<ScenarioData>): Promise<Scenario | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const dbUpdates: any = { ...updates };
  if (dbUpdates.objectives) {
    dbUpdates.objectives = dbUpdates.objectives as any;
  }

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

  return mapDatabaseScenario(data);
};

export const deleteScenario = async (scenarioId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Delete associated characters first
  await supabase
    .from('scenario_characters')
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

  // Get original scenario with characters
  const { data: original, error: fetchError } = await supabase
    .from('scenarios')
    .select(`
      *,
      scenario_characters(*)
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
      initial_scene_prompt: original.initial_scene_prompt,
      is_public: false,
      creator_id: user.id
    })
    .select()
    .single();

  if (insertError) {
    console.error('Error duplicating scenario:', insertError);
    throw insertError;
  }

  // Duplicate characters
  if (original.scenario_characters && original.scenario_characters.length > 0) {
    const charactersToInsert = original.scenario_characters.map((char: any) => ({
      scenario_id: newScenario.id,
      name: char.name,
      personality: char.personality,
      expertise_keywords: char.expertise_keywords,
      is_player_character: char.is_player_character,
      role: char.role,
      backstory: char.backstory,
      motivations: char.motivations,
      speech_patterns: char.speech_patterns,
      creator_id: user.id
    }));

    await supabase
      .from('scenario_characters')
      .insert(charactersToInsert);
  }

  return mapDatabaseScenario(newScenario);
};
