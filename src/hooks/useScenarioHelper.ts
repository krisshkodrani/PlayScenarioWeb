import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { config } from '@/lib/config';

// Request/Response types matching backend schemas
interface ScenarioHelperRequest {
  user_request: string;
  mode: 'create' | 'edit';
  current_scenario_data?: {
    title?: string;
    description?: string;
    category?: string;
    difficulty?: string;
    estimated_duration?: number;
    objectives?: Array<{
      id: number;
      description: string;
      priority: string;
    }>;
    win_conditions?: string;
    lose_conditions?: string;
    max_turns?: number;
    initial_scene_prompt?: string;
    characters?: Array<{
      name: string;
      role: string;
      personality: string;
      expertise_keywords: string[];
      background?: string;
      appearance?: string;
      goals?: string;
      fears?: string;
      notable_quotes?: string;
      is_player_character?: boolean;
    }>;
    tags?: string[];
  };
}

interface ScenarioHelperResponse {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimated_duration: number;
  objectives: Array<{
    id: number;
    description: string;
    priority: string;
  }>;
  win_conditions: string;
  lose_conditions: string;
  max_turns: number;
  // Backend returns scenario_opening_message; keep initial_scene_prompt as optional fallback for compatibility
  scenario_opening_message: string;
  initial_scene_prompt?: string;
  characters: Array<{
    name: string;
    role: string;
    personality: string;
    expertise_keywords: string[];
    background: string;
    appearance: string;
    goals: string;
    fears: string;
    notable_quotes: string;
    is_player_character: boolean;
  }>;
  tags: string[];
  is_public: boolean;
}

// API call function
async function callScenarioHelper(request: ScenarioHelperRequest): Promise<ScenarioHelperResponse> {
  const response = await fetch(`${config.api.baseUrl}/v1/scenario-helper/enhance`, {
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

// Hook for scenario creation
export function useCreateScenario(): UseMutationResult<
  ScenarioHelperResponse,
  Error,
  { userRequest: string }
> {
  return useMutation({
    mutationFn: ({ userRequest }) => 
      callScenarioHelper({
        user_request: userRequest,
        mode: 'create',
      }),
    onError: (error) => {
      console.error('Scenario creation failed:', error);
    },
  });
}

// Hook for scenario enhancement
export function useEnhanceScenario(): UseMutationResult<
  ScenarioHelperResponse,
  Error,
  {
    userRequest: string;
    currentScenarioData: {
      title?: string;
      description?: string;
      category?: string;
      difficulty?: string;
      estimated_duration?: number;
      objectives?: Array<{
        id: number;
        description: string;
        priority: string;
      }>;
      win_conditions?: string;
      lose_conditions?: string;
      max_turns?: number;
      initial_scene_prompt?: string;
      characters?: Array<{
        name: string;
        role: string;
        personality: string;
        expertise_keywords: string[];
        background?: string;
        appearance?: string;
        goals?: string;
        fears?: string;
        notable_quotes?: string;
        is_player_character?: boolean;
      }>;
      tags?: string[];
    };
  }
> {
  return useMutation({
    mutationFn: ({ userRequest, currentScenarioData }) =>
      callScenarioHelper({
        user_request: userRequest,
        mode: 'edit',
        current_scenario_data: currentScenarioData,
      }),
    onError: (error) => {
      console.error('Scenario enhancement failed:', error);
    },
  });
}

// Combined hook that automatically determines mode
export function useScenarioHelper(): {
  createScenario: UseMutationResult<ScenarioHelperResponse, Error, { userRequest: string }>;
  enhanceScenario: UseMutationResult<
    ScenarioHelperResponse,
    Error,
    {
      userRequest: string;
      currentScenarioData: {
        title?: string;
        description?: string;
        category?: string;
        difficulty?: string;
        estimated_duration?: number;
        objectives?: Array<{
          id: number;
          description: string;
          priority: string;
        }>;
        win_conditions?: string;
        lose_conditions?: string;
        max_turns?: number;
        initial_scene_prompt?: string;
        characters?: Array<{
          name: string;
          role: string;
          personality: string;
          expertise_keywords: string[];
          background?: string;
          appearance?: string;
          goals?: string;
          fears?: string;
          notable_quotes?: string;
          is_player_character?: boolean;
        }>;
        tags?: string[];
      };
    }
  >;
} {
  const createScenario = useCreateScenario();
  const enhanceScenario = useEnhanceScenario();

  return {
    createScenario,
    enhanceScenario,
  };
}

export type { ScenarioHelperRequest, ScenarioHelperResponse };