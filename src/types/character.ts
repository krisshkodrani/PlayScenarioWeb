// Backend-aligned character interface
export interface CharacterData {
  name: string;                    // Maps to database name TEXT NOT NULL
  personality: string;             // Maps to database personality TEXT NOT NULL  
  expertise_keywords: string[];    // Maps to database expertise_keywords TEXT[]
  is_player_character: boolean;    // Maps to database is_player_character BOOLEAN
}

// Helper interface for UI context
export interface CharacterContext {
  role: string; // For providing smart suggestions
}

// Extended character interface for My Characters page
export interface Character {
  id: string;
  name: string;
  role: string;
  personality: string;
  expertise_keywords: string[];
  created_at: string;
  scenario_count: number;
  total_responses: number;
  average_rating: number;
  avatar_color: string;
  last_used: string;
}

export interface CharacterStats {
  totalCharacters: number;
  activeCharacters: number;
  mostUsedCharacter: string;
  averageRating: number;
}

export interface CharacterFilters {
  search: string;
  role: string;
  expertise: string;
  sortBy: 'name' | 'created' | 'usage' | 'rating';
}
