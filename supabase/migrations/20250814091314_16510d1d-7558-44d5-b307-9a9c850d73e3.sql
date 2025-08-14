-- Clean up duplicate scenarios - delete the older private versions directly
-- Keep only the most recent published version: ebd56b5d-f698-4e74-acf1-6d394881de44

DELETE FROM scenarios 
WHERE id IN ('481796c5-57fe-46c3-b527-fc08473b9e45', '7f536ec8-2a8f-465f-9576-32c67aca77e9');

-- Add prevention: Create unique constraint on title + creator_id to prevent exact duplicates
-- This will prevent creating scenarios with identical titles by the same user
ALTER TABLE scenarios 
ADD CONSTRAINT unique_scenario_title_per_creator 
UNIQUE (title, creator_id);