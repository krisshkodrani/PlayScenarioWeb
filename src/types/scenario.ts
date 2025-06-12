
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
}

export interface ScenarioCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}
