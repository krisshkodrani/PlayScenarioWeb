-- Drop the character_usage_stats table as it's not being actively used
-- Most references in the codebase are marked as TODO and not implemented

-- First drop the database functions that reference this table
DROP FUNCTION IF EXISTS public.update_character_stats(uuid, integer, integer, integer);
DROP FUNCTION IF EXISTS public.cleanup_character_stats();

-- Drop the table
DROP TABLE IF EXISTS public.character_usage_stats;