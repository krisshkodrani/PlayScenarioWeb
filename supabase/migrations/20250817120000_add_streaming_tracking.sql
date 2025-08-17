-- Migration: Add streaming tracking to instance_messages
-- This adds a simple boolean field to track whether a message has been streamed,
-- eliminating the need for complex client-side sessionStorage management

-- Add streamed column to track streaming status
ALTER TABLE public.instance_messages 
ADD COLUMN streamed BOOLEAN NOT NULL DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.instance_messages.streamed IS 'Tracks whether this message has been streamed to the user (prevents re-streaming)';

-- Add index for efficient streaming queries
-- Only index messages that could potentially be streamed (ai_response and narration)
CREATE INDEX idx_instance_messages_streaming 
ON public.instance_messages(instance_id, streamed) 
WHERE message_type IN ('ai_response', 'narration');

-- Create function to mark messages as streamed
CREATE OR REPLACE FUNCTION public.mark_message_streamed(message_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- Update the streamed status for the message
    UPDATE public.instance_messages
    SET streamed = true
    WHERE id = message_id
    AND streamed = false; -- Only update if not already streamed
    
    -- Return true if a row was updated
    RETURN FOUND;
END;
$$;

-- Create function to batch mark multiple messages as streamed
CREATE OR REPLACE FUNCTION public.mark_messages_streamed(message_ids UUID[])
RETURNS INTEGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    -- Update multiple messages at once
    UPDATE public.instance_messages
    SET streamed = true
    WHERE id = ANY(message_ids)
    AND streamed = false; -- Only update if not already streamed
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$;

-- Grant execute permissions on the new functions
GRANT EXECUTE ON FUNCTION public.mark_message_streamed(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_messages_streamed(UUID[]) TO authenticated;

-- Backfill existing messages
-- By default, mark all existing messages as already streamed since they would have
-- appeared instantly when loaded. Only new messages from this point forward
-- will have streamed = false and be eligible for streaming animation.
UPDATE public.instance_messages 
SET streamed = true 
WHERE streamed = false;

-- Add helpful comment explaining the design
COMMENT ON TABLE public.instance_messages IS 'Conversation history between users and AI characters. The streamed column prevents re-animation of messages on page refresh.';

-- Migration completed
SELECT 'Streaming tracking migration completed successfully' AS status;