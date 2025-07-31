-- Add avatar_url column to scenario_characters table
ALTER TABLE public.scenario_characters 
ADD COLUMN avatar_url TEXT;

-- Create character avatars storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'character-avatars', 
  'character-avatars', 
  true, 
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Create storage policies for character avatars
CREATE POLICY "Character avatars are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'character-avatars');

CREATE POLICY "Authenticated users can upload character avatars" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'character-avatars' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own character avatars" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'character-avatars' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete their own character avatars" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'character-avatars' 
  AND auth.uid() IS NOT NULL
);