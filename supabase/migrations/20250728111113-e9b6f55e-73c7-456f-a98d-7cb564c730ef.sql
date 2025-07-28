-- Phase 1: Critical RLS and Database Security Fixes

-- 1. Enable RLS on tables that don't have it enabled
ALTER TABLE public.query_performance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rls_violation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_metrics_logs ENABLE ROW LEVEL SECURITY;

-- 2. Create RLS policies for audit and performance tables (admin only)
CREATE POLICY "Super admins can view query performance logs"
ON public.query_performance_logs
FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can view credit audit logs"
ON public.credit_audit_logs
FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can view RLS violation logs"
ON public.rls_violation_logs
FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can view connection metrics logs"
ON public.connection_metrics_logs
FOR SELECT
USING (is_super_admin(auth.uid()));

-- 3. Create RLS policies for character usage stats
CREATE POLICY "Character creators and admins can view usage stats"
ON public.character_usage_stats
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.scenario_characters 
    WHERE scenario_characters.id = character_usage_stats.character_id 
    AND scenario_characters.creator_id = auth.uid()
  ) 
  OR is_super_admin(auth.uid())
);

-- 4. Fix database function security by adding proper search_path
CREATE OR REPLACE FUNCTION public.add_credits(user_id uuid, amount integer, description text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- Update user credits
  UPDATE public.profiles 
  SET credits = credits + amount,
      updated_at = now()
  WHERE id = user_id;
  
  -- Log transaction
  INSERT INTO public.transactions (user_id, amount, type, description)
  VALUES (user_id, amount, 'credit', description);
END;
$function$;

CREATE OR REPLACE FUNCTION public.deduct_credits(user_id uuid, amount integer, reason text, instance_id uuid DEFAULT NULL::uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
    current_credits INTEGER;
BEGIN
    -- Get current credits from profiles table (Lovable's table)
    SELECT credits INTO current_credits
    FROM public.profiles
    WHERE id = user_id;
    
    -- Check if user has enough credits
    IF current_credits < amount THEN
        -- Log the failed attempt
        INSERT INTO public.credit_audit_logs (user_id, credits_change, reason)
        VALUES (user_id, -amount, 'FAILED: ' || reason);
        RETURN FALSE;
    END IF;
    
    -- Deduct credits from profiles table
    UPDATE public.profiles
    SET credits = credits - amount,
        updated_at = now()
    WHERE id = user_id;
    
    -- Log transaction using Lovable's transactions table
    INSERT INTO public.transactions (user_id, amount, type, description)
    VALUES (user_id, amount, 'debit', reason);
    
    -- Log to our audit table for detailed tracking
    INSERT INTO public.credit_audit_logs (user_id, credits_change, reason)
    VALUES (user_id, -amount, reason);
    
    RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_character_stats(p_character_id uuid, p_response_count integer DEFAULT 0, p_positive_reactions integer DEFAULT 0, p_total_reactions integer DEFAULT 0)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
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

-- 5. Add additional security function for admin role verification
CREATE OR REPLACE FUNCTION public.verify_admin_access()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = ''
AS $function$
    SELECT COALESCE(is_super_admin, FALSE)
    FROM public.profiles
    WHERE id = auth.uid();
$function$;