-- Update the cleanup_character_stats function to work with the new table structure
CREATE OR REPLACE FUNCTION public.cleanup_character_stats()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    -- Delete stats for characters that no longer exist
    DELETE FROM public.character_usage_stats
    WHERE character_id NOT IN (SELECT id FROM public.characters);

    -- Update scenario count based on character assignments
    UPDATE public.character_usage_stats
    SET scenario_count = (
        SELECT COUNT(DISTINCT scenario_id)
        FROM public.scenario_character_assignments
        WHERE character_id = character_usage_stats.character_id
    );
END;
$function$;