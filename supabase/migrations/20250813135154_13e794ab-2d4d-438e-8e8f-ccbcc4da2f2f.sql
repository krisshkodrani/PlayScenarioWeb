-- Add character columns to scenario_instances
ALTER TABLE public.scenario_instances 
ADD COLUMN ai_characters JSONB DEFAULT '[]'::jsonb,
ADD COLUMN player_character JSONB;

-- Drop the scenario_character_assignments table and its policies
DROP TABLE IF EXISTS public.scenario_character_assignments;