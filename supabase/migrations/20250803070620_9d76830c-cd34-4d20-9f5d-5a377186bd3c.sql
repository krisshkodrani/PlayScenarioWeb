-- Fix RLS security issue on backup table
ALTER TABLE public.scenario_characters_backup ENABLE ROW LEVEL SECURITY;

-- Create a basic RLS policy for the backup table (admin only access)
CREATE POLICY "Only super admins can access backup data" ON public.scenario_characters_backup
    FOR ALL 
    USING (is_super_admin(auth.uid()));