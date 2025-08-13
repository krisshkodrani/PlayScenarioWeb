
import { Scenario, Character, Objective } from '@/types/scenario';

export const mapDatabaseScenario = (dbScenario: any): Scenario => {
  // Extract difficulty settings from objectives metadata
  const objectives = dbScenario.objectives || [];
  const difficultyMeta = objectives.find((obj: any) => obj._difficulty);
  
  // Filter out metadata objects from objectives
  const actualObjectives = objectives.filter((obj: any) => !obj._difficulty && !obj._show_difficulty);

  return {
    id: dbScenario.id,
    title: dbScenario.title,
    description: dbScenario.description,
    category: 'business-simulation', // Default category
    difficulty: difficultyMeta?._difficulty ? 
      (difficultyMeta._difficulty.charAt(0).toUpperCase() + difficultyMeta._difficulty.slice(1)) as 'Beginner' | 'Intermediate' | 'Advanced' :
      'Beginner',
    estimated_duration: 30, // Default duration
    character_count: 0, // Will be set when enriched with characters
    characters: [],
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
    // Add difficulty settings as additional properties
    ...(difficultyMeta && {
      difficulty: difficultyMeta._difficulty?.charAt(0).toUpperCase() + difficultyMeta._difficulty?.slice(1),
      show_difficulty: difficultyMeta._show_difficulty
    })
  };
};

export const enrichScenarioWithCharacters = (scenario: Scenario, characterAssignments: any[]): Scenario => {
  const mappedCharacters: Character[] = characterAssignments.map(assignment => {
    const char = assignment.character || assignment; // Handle both assignment objects and direct character objects
    return {
      id: char.id,
      name: char.name,
      role: char.role || 'Team Member',
      personality: char.personality,
      expertise_keywords: char.expertise_keywords || [],
      avatar_color: getAvatarColor(char.name),
      avatar_url: char.avatar_url
    };
  });

  return {
    ...scenario,
    characters: mappedCharacters,
    character_count: mappedCharacters.length
  };
};

const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};
