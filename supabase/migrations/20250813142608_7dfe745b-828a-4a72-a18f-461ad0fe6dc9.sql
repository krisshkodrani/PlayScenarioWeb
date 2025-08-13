-- Update RLS policies for characters to allow viewing public characters from other users
DROP POLICY IF EXISTS "Users can view own characters or public characters" ON characters;

CREATE POLICY "Users can view own characters or public characters" 
ON characters FOR SELECT
USING (
  (creator_id = auth.uid()) OR 
  ((is_public = true) AND (status = 'active'::text)) OR 
  is_super_admin(auth.uid())
);