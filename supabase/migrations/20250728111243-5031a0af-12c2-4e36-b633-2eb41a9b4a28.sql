-- Fix remaining function security issues by adding search_path to all functions

CREATE OR REPLACE FUNCTION public.award_welcome_credits()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- Only award credits if email was just confirmed (changed from null to not null)
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    -- Award 10 welcome credits
    PERFORM public.add_credits(NEW.id, 10, 'Welcome bonus for email verification');
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username, credits)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'username',
    0
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_character_stats()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;