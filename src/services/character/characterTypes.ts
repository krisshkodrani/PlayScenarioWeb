
export interface DatabaseCharacter {
  id: string;
  name: string;
  role: string;
  personality: string;
  expertise_keywords: string[];
  creator_id: string;
  created_at: string;
  backstory?: string;
  motivations?: string;
  speech_patterns?: string;
  guidelines?: string;
  is_player_character: boolean;
}

export interface CharacterCreateData {
  name: string;
  personality: string;
  expertise_keywords: string[];
  is_player_character: boolean;
  role?: string;
  backstory?: string;
  motivations?: string;
  speech_patterns?: string;
  guidelines?: string;
}

export interface CharacterUpdateData {
  name?: string;
  personality?: string;
  expertise_keywords?: string[];
  is_player_character?: boolean;
  role?: string;
  backstory?: string;
  motivations?: string;
  speech_patterns?: string;
  guidelines?: string;
}
