-- Fix the unique constraint to properly handle scenario updates
-- Drop the existing constraint first
ALTER TABLE public.scenarios DROP CONSTRAINT IF EXISTS unique_scenario_title_per_creator;

-- Create a more sophisticated constraint that allows updates
-- This constraint will only be checked for rows that are not being updated
CREATE UNIQUE INDEX unique_scenario_title_per_creator 
ON public.scenarios (title, creator_id) 
WHERE status = 'active';

-- Add a function to validate title uniqueness during updates
CREATE OR REPLACE FUNCTION public.validate_scenario_title_uniqueness()
RETURNS trigger AS $$
BEGIN
    -- Only check for duplicates if we're inserting or changing the title
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.title != OLD.title) THEN
        -- Check if another scenario with the same title exists for this creator
        IF EXISTS (
            SELECT 1 FROM public.scenarios 
            WHERE title = NEW.title 
            AND creator_id = NEW.creator_id 
            AND status = 'active'
            AND id != NEW.id  -- Exclude the current record for updates
        ) THEN
            RAISE EXCEPTION 'duplicate_title: You already have a scenario with this title. Please choose a different title.'
                USING ERRCODE = '23505';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS validate_scenario_title_trigger ON public.scenarios;
CREATE TRIGGER validate_scenario_title_trigger
    BEFORE INSERT OR UPDATE ON public.scenarios
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_scenario_title_uniqueness();