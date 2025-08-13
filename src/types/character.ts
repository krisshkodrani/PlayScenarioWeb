// Backend-aligned character interface for creation/editing
export interface CharacterData {
  id?: string;                     // Optional ID for existing characters
  name: string;                    // Maps to database name TEXT NOT NULL
  role?: string;                   // Maps to database role TEXT DEFAULT 'Character'
  personality: string;             // Maps to database personality TEXT NOT NULL  
  expertise_keywords: string[];    // Maps to database expertise_keywords TEXT[]
  avatar_url?: string;             // Maps to database avatar_url TEXT
  is_public?: boolean;             // Maps to database is_public BOOLEAN DEFAULT false
  is_player_character?: boolean;   // For scenario character assignments
  // Extended fields for AI assistance
  background?: string;             // Character background and history
  appearance?: string;             // Physical appearance description
  goals?: string;                  // Character goals and motivations
  fears?: string;                  // Character fears and vulnerabilities
  notable_quotes?: string;         // Example quotes or phrases
}

// Database character interface
export interface DatabaseCharacter {
  id: string;
  creator_id: string;
  name: string;
  role: string;
  personality: string;
  expertise_keywords: string[];
  avatar_url?: string;
  is_public: boolean;
  status: string;
  blocked_at?: string;
  blocked_by?: string;
  blocked_reason?: string;
  created_at: string;
  updated_at: string;
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
  avatar_url?: string;
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
