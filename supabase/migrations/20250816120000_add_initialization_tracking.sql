-- Migration: Add initialization tracking for chat system
-- This enables proper scenario initialization flow with narrator and character greetings

-- Add initialization tracking to scenario_instances
ALTER TABLE public.scenario_instances
ADD COLUMN is_initialized BOOLEAN DEFAULT FALSE;

-- Add index for quick initialization status queries
CREATE INDEX idx_scenario_instances_initialization 
ON public.scenario_instances(is_initialized);

-- Migration completed successfully
SELECT 'Chat initialization support migration completed' AS status;