
export interface Message {
  id: string;
  sender_name: string;
  message: string;
  turn_number: number;
  message_type: string;
  timestamp: string;
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
