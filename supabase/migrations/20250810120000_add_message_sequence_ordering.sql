-- Migration: Add message sequence ordering for perfect message ordering
-- This addresses the core chat message ordering issues by adding sequence numbers
-- and proper indexes for optimal performance

-- Add sequence_number column to instance_messages
ALTER TABLE public.instance_messages ADD COLUMN sequence_number BIGINT;

-- Create function to auto-assign sequence numbers per instance
CREATE OR REPLACE FUNCTION public.assign_message_sequence()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-assign the next sequence number for this instance
    NEW.sequence_number = (
        SELECT COALESCE(MAX(sequence_number), 0) + 1 
        FROM public.instance_messages 
        WHERE instance_id = NEW.instance_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-assign sequence numbers on insert
CREATE TRIGGER trigger_assign_sequence 
    BEFORE INSERT ON public.instance_messages
    FOR EACH ROW EXECUTE FUNCTION public.assign_message_sequence();

-- Create indexes for optimal message ordering performance
-- Primary index for sequence-based ordering (most important)
CREATE INDEX idx_instance_messages_ordering ON public.instance_messages(instance_id, sequence_number);

-- Backup index for timestamp-based ordering (fallback)
CREATE INDEX idx_instance_messages_timestamp ON public.instance_messages(instance_id, timestamp);

-- Index for turn-based queries (used in some scenarios)  
CREATE INDEX idx_instance_messages_turn ON public.instance_messages(instance_id, turn_number, sequence_number);

-- Backfill sequence numbers for existing messages
-- Order by timestamp and turn_number to maintain logical order
WITH ordered_messages AS (
    SELECT 
        id, 
        instance_id,
        ROW_NUMBER() OVER (
            PARTITION BY instance_id 
            ORDER BY timestamp ASC, turn_number ASC, timestamp ASC
        ) as seq
    FROM public.instance_messages
    WHERE sequence_number IS NULL
)
UPDATE public.instance_messages 
SET sequence_number = ordered_messages.seq
FROM ordered_messages 
WHERE public.instance_messages.id = ordered_messages.id;

-- Add NOT NULL constraint after backfilling data
ALTER TABLE public.instance_messages ALTER COLUMN sequence_number SET NOT NULL;

-- Add unique constraint to ensure no duplicate sequences per instance
ALTER TABLE public.instance_messages 
ADD CONSTRAINT unique_instance_sequence 
UNIQUE (instance_id, sequence_number);