-- Add feedback_details column to message_reactions table
ALTER TABLE public.message_reactions 
ADD COLUMN feedback_details TEXT NULL;

-- Create unique constraint to prevent duplicate reactions
ALTER TABLE public.message_reactions 
ADD CONSTRAINT unique_user_message_reaction 
UNIQUE (user_id, message_id);