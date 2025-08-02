-- Step 1: Update character_usage_stats to reference characters table instead of scenario_characters
DROP TABLE IF EXISTS character_usage_stats;

-- Recreate character_usage_stats table to work with new characters table
CREATE TABLE public.character_usage_stats (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    scenario_count INTEGER NOT NULL DEFAULT 0,
    total_responses INTEGER NOT NULL DEFAULT 0,
    total_reactions INTEGER NOT NULL DEFAULT 0,
    positive_reactions INTEGER NOT NULL DEFAULT 0,
    average_rating NUMERIC,
    last_used TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(character_id)
);

-- Enable RLS on character_usage_stats
ALTER TABLE public.character_usage_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for character_usage_stats
CREATE POLICY "Character creators and admins can view usage stats" ON public.character_usage_stats
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.characters
            WHERE characters.id = character_usage_stats.character_id
            AND characters.creator_id = auth.uid()
        ) OR is_super_admin(auth.uid())
    );

-- Update the update_character_stats function to work with new table structure
CREATE OR REPLACE FUNCTION public.update_character_stats(p_character_id uuid, p_response_count integer DEFAULT 0, p_positive_reactions integer DEFAULT 0, p_total_reactions integer DEFAULT 0)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
    INSERT INTO public.character_usage_stats (
        character_id,
        total_responses,
        positive_reactions,
        total_reactions,
        last_used
    ) VALUES (
        p_character_id,
        p_response_count,
        p_positive_reactions,
        p_total_reactions,
        now()
    )
    ON CONFLICT (character_id) DO UPDATE SET
        total_responses = character_usage_stats.total_responses + p_response_count,
        positive_reactions = character_usage_stats.positive_reactions + p_positive_reactions,
        total_reactions = character_usage_stats.total_reactions + p_total_reactions,
        last_used = now(),
        updated_at = now();

    UPDATE public.character_usage_stats
    SET average_rating = CASE
        WHEN total_reactions > 0 THEN ROUND((positive_reactions::decimal / total_reactions::decimal) * 5, 2)
        ELSE NULL
    END
    WHERE character_id = p_character_id;
END;
$function$;