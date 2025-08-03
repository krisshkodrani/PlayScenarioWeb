import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { config } from '@/lib/config';

// Request/Response types matching backend schemas
interface CharacterHelperRequest {
  user_request: string;
  mode: 'create' | 'edit';
  current_character_data?: {
    name?: string;
    role?: string;
    personality?: string;
    expertise_keywords?: string[];
    background?: string;
    appearance?: string;
    goals?: string;
    fears?: string;
    notable_quotes?: string;
  };
}

interface CharacterHelperResponse {
  name: string;
  role: string;
  personality: string;
  expertise_keywords: string[];
  background: string;
  appearance: string;
  goals: string;
  fears: string;
  notable_quotes: string;
}

// API call function
async function callCharacterHelper(request: CharacterHelperRequest): Promise<CharacterHelperResponse> {
  const response = await fetch(`${config.api.baseUrl}/v1/character-helper/enhance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Hook for character creation
export function useCreateCharacter(): UseMutationResult<
  CharacterHelperResponse,
  Error,
  { userRequest: string }
> {
  return useMutation({
    mutationFn: ({ userRequest }) => 
      callCharacterHelper({
        user_request: userRequest,
        mode: 'create',
      }),
    onError: (error) => {
      console.error('Character creation failed:', error);
    },
  });
}

// Hook for character enhancement
export function useEnhanceCharacter(): UseMutationResult<
  CharacterHelperResponse,
  Error,
  { 
    userRequest: string;
    currentCharacterData: {
      name?: string;
      role?: string;
      personality?: string;
      expertise_keywords?: string[];
      background?: string;
      appearance?: string;
      goals?: string;
      fears?: string;
      notable_quotes?: string;
    };
  }
> {
  return useMutation({
    mutationFn: ({ userRequest, currentCharacterData }) =>
      callCharacterHelper({
        user_request: userRequest,
        mode: 'edit',
        current_character_data: currentCharacterData,
      }),
    onError: (error) => {
      console.error('Character enhancement failed:', error);
    },
  });
}

// Combined hook that automatically determines mode
export function useCharacterHelper(): {
  createCharacter: UseMutationResult<CharacterHelperResponse, Error, { userRequest: string }>;
  enhanceCharacter: UseMutationResult<
    CharacterHelperResponse,
    Error,
    { 
      userRequest: string;
      currentCharacterData: {
        name?: string;
        role?: string;
        personality?: string;
        expertise_keywords?: string[];
        background?: string;
        appearance?: string;
        goals?: string;
        fears?: string;
        notable_quotes?: string;
      };
    }
  >;
} {
  const createCharacter = useCreateCharacter();
  const enhanceCharacter = useEnhanceCharacter();

  return {
    createCharacter,
    enhanceCharacter,
  };
}

export type { CharacterHelperRequest, CharacterHelperResponse };