
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

export interface CharacterCreateData {
  name: string;
  role?: string;
  personality: string;
  expertise_keywords: string[];
  avatar_url?: string;
  is_public?: boolean;
}

export interface CharacterUpdateData {
  name?: string;
  role?: string;
  personality?: string;
  expertise_keywords?: string[];
  avatar_url?: string;
  is_public?: boolean;
}
