-- Add featured image column to scenarios table
ALTER TABLE public.scenarios ADD COLUMN featured_image_url TEXT;

-- Create scenario images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'scenario-images', 
  'scenario-images', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Create RLS policies for scenario images bucket
CREATE POLICY "Anyone can view scenario images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'scenario-images');

CREATE POLICY "Authenticated users can upload scenario images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'scenario-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own scenario images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'scenario-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own scenario images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'scenario-images' AND auth.uid()::text = (storage.foldername(name))[1]);