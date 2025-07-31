
export interface DatabaseCharacter {
  id: string;
  name: string;
  role: string;
  personality: string;
  expertise_keywords: string[];
  creator_id: string;
  created_at: string;
  is_player_character: boolean;
  avatar_url?: string;
}

export interface CharacterCreateData {
  name: string;
  personality: string;
  expertise_keywords: string[];
  is_player_character: boolean;
  role?: string;
  avatar_url?: string;
}

export interface CharacterUpdateData {
  name?: string;
  personality?: string;
  expertise_keywords?: string[];
  is_player_character?: boolean;
  role?: string;
  avatar_url?: string;
}
