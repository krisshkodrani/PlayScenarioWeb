
-- Add super admin flag to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT FALSE;

-- Add moderation fields to scenarios table
ALTER TABLE public.scenarios
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'pending_review')),
ADD COLUMN IF NOT EXISTS blocked_reason TEXT,
ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS blocked_by UUID REFERENCES auth.users(id);

-- Add moderation fields to scenario_characters table
ALTER TABLE public.scenario_characters
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'pending_review')),
ADD COLUMN IF NOT EXISTS blocked_reason TEXT,
ADD COLUMN IF NOT EXISTS blocked_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS blocked_by UUID REFERENCES auth.users(id);

-- Create admin actions audit log table
CREATE TABLE IF NOT EXISTS public.admin_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES auth.users(id),
    action_type TEXT NOT NULL CHECK (action_type IN ('user_blocked', 'user_unblocked', 'content_blocked', 'content_unblocked', 'content_deleted')),
    target_type TEXT NOT NULL CHECK (target_type IN ('user', 'scenario', 'character')),
    target_id UUID NOT NULL,
    reason TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_actions table
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Create policy for admin actions - only super admins can view
CREATE POLICY "Super admins can view all admin actions" 
    ON public.admin_actions 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_super_admin = true
        )
    );

-- Create policy for admin actions - only super admins can insert
CREATE POLICY "Super admins can create admin actions" 
    ON public.admin_actions 
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_super_admin = true
        )
    );

-- Create helper function to check super admin status
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT COALESCE(is_super_admin, FALSE)
    FROM public.profiles
    WHERE id = user_id;
$$;

-- Update scenarios RLS policy to allow super admins to see blocked content
DROP POLICY IF EXISTS "View public scenarios or own scenarios" ON public.scenarios;
CREATE POLICY "View public scenarios or own scenarios or admin access" 
    ON public.scenarios 
    FOR SELECT 
    USING (
        (is_public = true AND status = 'active') OR 
        (creator_id = auth.uid()) OR 
        public.is_super_admin(auth.uid()) OR 
        log_rls_violation('scenarios'::text, auth.uid(), 'SELECT'::text, id)
    );

-- Update scenario_characters RLS policy to allow super admins to see blocked content
DROP POLICY IF EXISTS "Characters follow scenario visibility" ON public.scenario_characters;
CREATE POLICY "Characters follow scenario visibility or admin access" 
    ON public.scenario_characters 
    FOR SELECT 
    USING (
        (EXISTS (
            SELECT 1 FROM scenarios 
            WHERE scenarios.id = scenario_characters.scenario_id 
            AND ((scenarios.is_public = true AND scenarios.status = 'active' AND scenario_characters.status = 'active') 
                 OR scenarios.creator_id = auth.uid())
        )) OR 
        public.is_super_admin(auth.uid()) OR 
        log_rls_violation('scenario_characters'::text, auth.uid(), 'SELECT'::text, id)
    );

-- Create index for admin actions queries
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON public.admin_actions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON public.admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target ON public.admin_actions(target_type, target_id);
