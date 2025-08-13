-- Rename initial_scene_prompt to scenario_opening_message in scenarios table
ALTER TABLE public.scenarios 
RENAME COLUMN initial_scene_prompt TO scenario_opening_message;