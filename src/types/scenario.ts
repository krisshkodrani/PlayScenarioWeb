
export interface ObjectiveData {
  id: number;
  description: string;
}

export interface CharacterData {
  name: string;
  personality: string;
  expertise_keywords: string[];
  is_player_character: boolean;
}

export interface ScenarioData {
  // Core scenario fields (matches ScenarioBase in backend)
  title: string;
  description: string;
  objectives: ObjectiveData[];
  win_conditions: string;
  lose_conditions: string;
  max_turns: number;
  initial_scene_prompt: string;
  is_public: boolean;
  
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
}

export interface ScenarioCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}
