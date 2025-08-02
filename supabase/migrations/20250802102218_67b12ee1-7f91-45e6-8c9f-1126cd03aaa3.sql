-- Final cleanup: Drop the old scenario_characters table
-- This should only be done after all code has been migrated to use the new system

-- First, let's create a backup table just in case (optional safety measure)
CREATE TABLE IF NOT EXISTS public.scenario_characters_backup AS 
SELECT * FROM public.scenario_characters;

-- Now drop the old table and its dependent objects
DROP TABLE IF EXISTS public.scenario_characters CASCADE;