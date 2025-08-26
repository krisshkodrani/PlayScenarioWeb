
import { Scenario, Character, Objective } from '@/types/scenario';

export const mapDatabaseScenario = (dbScenario: any): Scenario => {
  // Extract difficulty settings from objectives metadata
  const objectives = dbScenario.objectives || [];
  const difficultyMeta = objectives.find((obj: any) => obj._difficulty);
  
  // Filter out metadata objects from objectives
  const actualObjectives = objectives.filter((obj: any) => !obj._difficulty && !obj._show_difficulty);

  // Parse characters from JSONB if present
  const dbCharacters = Array.isArray(dbScenario.characters) ? dbScenario.characters : [];
  const characters = dbCharacters.map((char: any, index: number) => ({
    id: char.id || `char-${index}`,
    name: char.name || '',
    role: char.role || 'Character',
    personality: char.personality || '',
    expertise_keywords: char.expertise_keywords || [],
    avatar_color: char.avatar_color || `bg-blue-500`,
    avatar_url: char.avatar_url
  }));

  return {
    id: dbScenario.id,
    title: dbScenario.title,
    description: dbScenario.description,
    category: 'business-simulation', // Default category
    difficulty: difficultyMeta?._difficulty ? 
      (difficultyMeta._difficulty.charAt(0).toUpperCase() + difficultyMeta._difficulty.slice(1)) as 'Beginner' | 'Intermediate' | 'Advanced' :
      'Beginner',
    estimated_duration: dbScenario.max_turns || 30,
    character_count: characters.length,
    characters: characters,
    objectives: actualObjectives.map((obj: any, index: number) => ({
      id: obj.id?.toString() || index.toString(),
      title: obj.description || `Objective ${index + 1}`,
      description: obj.description || '',
      priority: 'important' as const
    })),
    created_at: dbScenario.created_at,
    created_by: dbScenario.creator_id,
    play_count: dbScenario.play_count || 0,
    average_rating: dbScenario.average_score || 0,
    tags: [],
    is_public: dbScenario.is_public,
    scenario_opening_message: dbScenario.scenario_opening_message,
    win_conditions: dbScenario.win_conditions,
    lose_conditions: dbScenario.lose_conditions,
    max_turns: dbScenario.max_turns,
    featured_image_url: dbScenario.featured_image_url,
    // Add difficulty settings as additional properties
    ...(difficultyMeta && {
      difficulty: difficultyMeta._difficulty?.charAt(0).toUpperCase() + difficultyMeta._difficulty?.slice(1),
      show_difficulty: difficultyMeta._show_difficulty
    })
  };
};


