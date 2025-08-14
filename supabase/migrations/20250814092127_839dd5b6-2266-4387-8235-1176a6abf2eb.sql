-- Add characters column to scenarios table to persist character data
ALTER TABLE scenarios ADD COLUMN characters JSONB DEFAULT '[]'::jsonb;