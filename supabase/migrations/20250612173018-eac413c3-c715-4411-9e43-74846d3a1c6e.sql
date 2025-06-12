
-- 006_character_management.sql (without migration logging)

-- Add creator tracking to scenario_characters
ALTER TABLE public.scenario_characters ADD COLUMN IF NOT EXISTS creator_id UUID;
ALTER TABLE public.scenario_characters ADD CONSTRAINT fk_character_creator FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backfill creator_id from scenarios
UPDATE public.scenario_characters SET creator_id = (
    SELECT creator_id FROM public.scenarios WHERE scenarios.id = scenario_characters.scenario_id
) WHERE creator_id IS NULL;

ALTER TABLE public.scenario_characters ALTER COLUMN creator_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS idx_scenario_characters_creator_id ON public.scenario_characters(creator_id);

-- Character usage statistics table
CREATE TABLE IF NOT EXISTS public.character_usage_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    character_id UUID NOT NULL REFERENCES public.scenario_characters(id) ON DELETE CASCADE,
    scenario_count INTEGER NOT NULL DEFAULT 0,
    total_responses INTEGER NOT NULL DEFAULT 0,
    total_reactions INTEGER NOT NULL DEFAULT 0,
    positive_reactions INTEGER NOT NULL DEFAULT 0,
    average_rating DECIMAL(3,2),
    last_used TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(character_id)
);

CREATE INDEX IF NOT EXISTS idx_character_usage_stats_character_id ON public.character_usage_stats(character_id);
CREATE INDEX IF NOT EXISTS idx_character_usage_stats_scenario_count ON public.character_usage_stats(scenario_count DESC);

-- Update RLS policies for characters
DROP POLICY IF EXISTS "Users can manage characters in own scenarios" ON public.scenario_characters;

CREATE POLICY "Users can manage own characters or scenario characters" ON public.scenario_characters
    FOR ALL USING (
        creator_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.scenarios WHERE id = scenario_id AND creator_id = auth.uid()
        )
    );

CREATE POLICY "Users can view characters in accessible scenarios" ON public.scenario_characters
    FOR SELECT USING (
        creator_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.scenarios
            WHERE id = scenario_id AND (is_public = true OR creator_id = auth.uid())
        )
    );

-- Function to update character usage statistics
CREATE OR REPLACE FUNCTION public.update_character_stats(
    p_character_id UUID,
    p_response_count INTEGER DEFAULT 0,
    p_positive_reactions INTEGER DEFAULT 0,
    p_total_reactions INTEGER DEFAULT 0
) RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- Function to clean up orphaned character stats
CREATE OR REPLACE FUNCTION public.cleanup_character_stats()
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    DELETE FROM public.character_usage_stats
    WHERE character_id NOT IN (SELECT id FROM public.scenario_characters);

    UPDATE public.character_usage_stats
    SET scenario_count = (
        SELECT COUNT(DISTINCT scenario_id)
        FROM public.scenario_characters
        WHERE id = character_usage_stats.character_id
    );
END;
$$;
