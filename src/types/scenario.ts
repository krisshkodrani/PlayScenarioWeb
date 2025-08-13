
export interface ObjectiveData {
  id: number;
  description: string;
  [key: string]: any; // Add index signature for JSON compatibility
}

export interface CharacterData {
  id?: string; // Optional for new characters, required for existing
  name: string;
  personality: string;
  expertise_keywords: string[];
  is_player_character: boolean;
  role?: string; // Add role property
}

export interface ScenarioData {
  // Core scenario fields (matches ScenarioBase in backend)
  title: string;
  description: string;
  objectives: ObjectiveData[];
  win_conditions: string;
  lose_conditions: string;
  max_turns: number;
  scenario_opening_message: string;
  is_public: boolean;
  
  // New difficulty settings
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  show_difficulty?: boolean;
  
  // Characters for this scenario
  characters: CharacterData[];
}

export interface Character {
  id: string;
  name: string;
  role: string;
  personality: string;
  expertise_keywords: string[];
  avatar_color: string;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'important' | 'optional';
  // Allow metadata properties for difficulty settings
  _difficulty?: string;
  _show_difficulty?: boolean;
  [key: string]: any;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_duration: number;
  character_count: number;
  characters: Character[];
  objectives: Objective[];
  created_at: string;
  created_by: string;
  play_count: number;
  average_rating: number;
  tags: string[];
  is_liked?: boolean;
  is_bookmarked?: boolean;
  is_public: boolean;
  scenario_opening_message?: string;
  win_conditions?: string; // Add missing properties
  lose_conditions?: string;
  max_turns?: number;
}

export interface ScenarioCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}
