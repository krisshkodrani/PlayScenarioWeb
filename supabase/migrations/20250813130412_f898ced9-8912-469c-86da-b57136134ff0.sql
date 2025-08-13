-- Check for existing duplicate character names per user before adding constraint
WITH duplicates AS (
  SELECT creator_id, name, COUNT(*) as count
  FROM public.characters 
  WHERE status = 'active'
  GROUP BY creator_id, name 
  HAVING COUNT(*) > 1
)
SELECT COUNT(*) as duplicate_count FROM duplicates;

-- Delete older duplicate characters, keeping only the most recent one per (creator_id, name)
WITH ranked_characters AS (
  SELECT id, creator_id, name, created_at,
         ROW_NUMBER() OVER (PARTITION BY creator_id, name ORDER BY created_at DESC) as rn
  FROM public.characters
  WHERE status = 'active'
)
DELETE FROM public.characters 
WHERE id IN (
  SELECT id FROM ranked_characters WHERE rn > 1
);

-- Add unique constraint to prevent duplicate character names per user
ALTER TABLE public.characters 
ADD CONSTRAINT characters_creator_name_unique 
UNIQUE (creator_id, name);

-- Add index for faster duplicate name checking
CREATE INDEX idx_characters_creator_name ON public.characters (creator_id, name) 
WHERE status = 'active';