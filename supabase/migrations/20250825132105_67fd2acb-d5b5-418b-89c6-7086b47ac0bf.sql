-- Fix RLS policy inconsistency for scenario image uploads
-- Update the scenario images upload policy to use auth.uid() IS NOT NULL for consistency

DROP POLICY IF EXISTS "Authenticated users can upload scenario images" ON storage.objects;

CREATE POLICY "Authenticated users can upload scenario images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'scenario-images' AND 
  auth.uid() IS NOT NULL
);