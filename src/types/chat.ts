export interface Message {
  id: string;
  sender_name: string;
  message: string;
  turn_number: number;
  message_type: 'user_message' | 'ai_response' | 'system' | 'narration';
  timestamp: string;
  sequence_number?: number; // New field for perfect ordering
  mode?: 'chat' | 'action'; // New field for message mode
  // Enhanced fields for rich AI responses
  character_name?: string;
  response_type?: string;
  internal_state?: {
    emotion: string;
    thoughts: string;
    objective_impact: string;
  };
  suggested_follow_ups?: string[];
  metrics?: {
    authenticity: number;
    relevance: number;
    engagement: number;
    consistency: number;
  };
  flags?: {
    requires_other_character: boolean;
    advances_objective: boolean;
    reveals_information: boolean;
  };
}

export interface ScenarioInstance {
  id: string;
  user_id: string;
  scenario_id: string;
  status: string;
  current_turn: number;
  started_at: string;
  max_turns: number | null;
  objectives_progress: any;
  ai_characters?: any; // Embedded AI characters as JSON
  player_character?: any; // Embedded player character as JSON
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  scenario_opening_message: string;
  objectives: any[];
  max_turns: number | null;
}

export interface UseRealtimeChatProps {
  instanceId: string;
  scenarioId: string;
}

// NEW: shape of enhanced chat response the frontend consumes
export interface EnhancedChatCompletionResponse {
  character_responses: Array<{
    character_id: string;
    character_name: string;
    message: string;
    strategy_used: string;
    response_metadata: Record<string, any>;
  }>;
  moderator_analysis: {
    selected_characters: string[];
    reasoning: string;
    confidence: number;
  };
  turn_number: number;
  turn_progressed: boolean;
  objectives_progress?: Record<string, any> | null;
  safety_check: Record<string, any>;
  scenario_completed: boolean;
  completion_reason?: string | null;
  narrator_message?: string | null;
}
