-- Add unique constraint to prevent duplicate scenario titles per user
ALTER TABLE public.scenarios 
ADD CONSTRAINT scenarios_creator_title_unique 
UNIQUE (creator_id, title);

-- Add index for faster duplicate title checking
CREATE INDEX idx_scenarios_creator_title ON public.scenarios (creator_id, title) 
WHERE status = 'active';