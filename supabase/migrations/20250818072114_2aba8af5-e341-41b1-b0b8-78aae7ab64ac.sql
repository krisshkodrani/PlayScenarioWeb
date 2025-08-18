-- Add message_text column to message_reactions table
ALTER TABLE public.message_reactions 
ADD COLUMN message_text TEXT;