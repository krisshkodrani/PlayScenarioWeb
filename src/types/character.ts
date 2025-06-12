
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
