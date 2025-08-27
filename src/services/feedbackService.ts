export type DetailLevel = 'short' | 'standard' | 'deep';

export interface FeedbackSummary {
  title: string;
  narrative: string;
  ending_type: 'success' | 'mixed' | 'setback' | 'open';
  tone: 'affirming' | 'neutral' | 'candid';
}

export interface KeyEvent {
  turn: number;
  title: string;
  what_happened: string;
  consequence: string;
  evidence?: string;
}

export interface CharacterDelta {
  id: string;
  name: string;
  before: Record<string, number>;
  after: Record<string, number>;
  delta: Record<string, number>;
  reflection?: string;
}

export interface FeedbackRelationships {
  characters: CharacterDelta[];
}

export interface SkillItem {
  id: string;
  name: string;
  before: number;
  after: number;
  delta: number;
  evidence?: string;
}

export interface FeedbackSkills {
  items: SkillItem[];
}

export interface Achievement {
  code: string;
  name: string;
  tier: 1 | 2 | 3;
  why?: string;
  unlocked_at?: string;
}

export interface Suggestions {
  next_attempt: Array<{ strategy: string; rationale?: string; when_to_use?: string }>;
  replay_hooks: Array<{ what_if: string; hook?: string }>;
}

export interface Metrics {
  turns?: number;
  completion_time_s?: number;
  branching_index?: number;
  style?: { empathy?: number; risk?: number };
}

export interface DeepDivePath { path: string; likely_outcome?: string }
export interface DeepDive { analysis?: string; alternative_paths: DeepDivePath[] }

export interface RenderingHints { show_meters?: boolean; emphasize_char_reflection?: boolean }

export interface FeedbackPayload {
  version: string;
  instance_id: string;
  scenario_id: string;
  user_id: string;
  detail_level: DetailLevel;
  summary: FeedbackSummary;
  key_events: KeyEvent[];
  relationships: FeedbackRelationships;
  skills: FeedbackSkills;
  achievements: Achievement[];
  suggestions: Suggestions;
  metrics?: Metrics;
  deep_dive?: DeepDive;
  rendering_hints?: RenderingHints;
  ai_model?: string;
  prompt_version?: string;
}

export interface FeedbackResponse {
  instance_id: string;
  scenario_id: string;
  user_id: string;
  detail_level: DetailLevel;
  feedback: FeedbackPayload;
  achievements: Achievement[];
  generated_at: string;
  ai_model?: string;
  prompt_version?: string;
  cached: boolean;
}

const API_BASE = (import.meta as any).env?.VITE_API_BASE || `${window.location.protocol}//${window.location.hostname}:8000/api/v1`;

async function getResults(instanceId: string, detailLevel: DetailLevel = 'standard', force = false): Promise<FeedbackResponse> {
  const params = new URLSearchParams({ detail_level: detailLevel });
  if (force) params.set('force', 'true');
  const url = `${API_BASE}/results/${encodeURIComponent(instanceId)}?${params.toString()}`;
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Failed to fetch results (${res.status})`);
  }
  return res.json();
}

async function generateDetailedAndWait(instanceId: string): Promise<FeedbackResponse> {
  // Warm deep generation explicitly with force=true
  return getResults(instanceId, 'deep', true);
}

export const feedbackService = { getResults, generateDetailedAndWait };
