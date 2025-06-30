
-- Remove unused fields from scenario_characters table
ALTER TABLE public.scenario_characters 
DROP COLUMN IF EXISTS backstory,
DROP COLUMN IF EXISTS speech_patterns,
DROP COLUMN IF EXISTS motivations,
DROP COLUMN IF EXISTS relationships;

-- Update the default role to be more generic since we're keeping it simple
ALTER TABLE public.scenario_characters 
ALTER COLUMN role SET DEFAULT 'Character';
