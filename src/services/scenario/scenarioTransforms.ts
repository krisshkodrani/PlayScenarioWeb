
import { Scenario } from '@/types/scenario';

export const mapDatabaseScenario = (dbScenario: any): Scenario => {
  return {
    id: dbScenario.id,
    title: dbScenario.title,
    description: dbScenario.description,
    category: 'general',
    difficulty: 'Intermediate',
    estimated_duration: dbScenario.max_turns ? dbScenario.max_turns * 2 : 30,
    character_count: 0,
    characters: [],
    objectives: Array.isArray(dbScenario.objectives) ? dbScenario.objectives : [],
    created_at: dbScenario.created_at,
    created_by: dbScenario.profiles?.username || 'Unknown',
    play_count: dbScenario.play_count || 0,
    average_rating: dbScenario.average_score ? Number(dbScenario.average_score) : 0,
    tags: [],
    is_liked: false,
    is_bookmarked: false,
    is_public: dbScenario.is_public
  };
};

export const generateAvatarColor = (name: string): string => {
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
};

export const enrichScenarioWithCharacters = (scenario: Scenario, dbScenario: any): Scenario => {
  if (dbScenario.scenario_characters) {
    scenario.characters = dbScenario.scenario_characters.map((char: any) => ({
      id: char.id,
      name: char.name,
      role: char.role,
      personality: char.personality,
      expertise_keywords: char.expertise_keywords,
      avatar_color: generateAvatarColor(char.name)
    }));
    scenario.character_count = scenario.characters.length;
  }
  return scenario;
};
