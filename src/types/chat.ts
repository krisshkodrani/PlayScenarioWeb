
export interface Message {
  id: string;
  sender_name: string;
  message: string;
  turn_number: number;
  message_type: 'user_message' | 'ai_response' | 'system';
  timestamp: string;
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
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  initial_scene_prompt: string;
  objectives: any[];
  max_turns: number | null;
}

export interface UseRealtimeChatProps {
  instanceId: string;
  scenarioId: string;
}
