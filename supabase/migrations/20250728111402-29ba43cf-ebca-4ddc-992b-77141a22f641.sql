-- Fix the remaining functions without proper search_path

CREATE OR REPLACE FUNCTION public.log_rls_violation(table_name text, user_id uuid, operation text, row_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
    INSERT INTO public.rls_violation_logs (table_name, user_id, operation, row_id)
    VALUES (table_name, user_id, operation, row_id);
    
    -- Always return false to deny access
    RETURN FALSE;
END;
$function$;