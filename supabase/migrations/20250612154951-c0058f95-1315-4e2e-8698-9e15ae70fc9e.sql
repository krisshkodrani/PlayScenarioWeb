
-- 002_playscenario_core_schema.sql
-- Complete PlayScenarioAI schema building on Lovable's user/credit foundation
-- This migration adds multi-agent AI scenario management, character orchestration, and messaging systems

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- SCENARIOS: Core scenario definitions with JSONB objectives
-- =============================================================================

CREATE TABLE public.scenarios (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    creator_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    is_public BOOLEAN NOT NULL DEFAULT false,
    objectives JSONB NOT NULL DEFAULT '[]'::jsonb,
    win_conditions TEXT,
    lose_conditions TEXT,
    max_turns INTEGER,
    initial_scene_prompt TEXT NOT NULL,
    like_count INTEGER NOT NULL DEFAULT 0,
    bookmark_count INTEGER NOT NULL DEFAULT 0,
    play_count INTEGER NOT NULL DEFAULT 0,
    average_score DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================================================
-- SCENARIO CHARACTERS: AI character definitions with orchestration data
-- =============================================================================

CREATE TABLE public.scenario_characters (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    scenario_id UUID NOT NULL REFERENCES public.scenarios ON DELETE CASCADE,
    name TEXT NOT NULL,
    personality TEXT NOT NULL,
    expertise_keywords TEXT[] NOT NULL DEFAULT '{}',
    role TEXT NOT NULL DEFAULT 'Team Member',
    backstory TEXT,
    speech_patterns TEXT,
    motivations TEXT,
    relationships JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_player_character BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================================================
-- USER ENGAGEMENT: Likes and bookmarks for scenarios
-- =============================================================================

CREATE TABLE public.scenario_likes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    scenario_id UUID NOT NULL REFERENCES public.scenarios ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, scenario_id)
);

CREATE TABLE public.scenario_bookmarks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    scenario_id UUID NOT NULL REFERENCES public.scenarios ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, scenario_id)
);

-- =============================================================================
-- GAMEPLAY SESSIONS: Individual scenario playthroughs
-- =============================================================================

CREATE TABLE public.scenario_instances (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    scenario_id UUID NOT NULL REFERENCES public.scenarios ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'playing' CHECK (status IN ('playing', 'completed', 'won', 'lost', 'abandoned')),
    objectives_progress JSONB NOT NULL DEFAULT '{}'::jsonb,
    current_turn INTEGER NOT NULL DEFAULT 0,
    max_turns INTEGER,
    final_score INTEGER,
    win_condition_met BOOLEAN,
    lose_condition_met BOOLEAN,
    completion_reason TEXT,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    ended_at TIMESTAMP WITH TIME ZONE
);

-- =============================================================================
-- CONVERSATION HISTORY: Messages between users and AI characters
-- =============================================================================

CREATE TABLE public.instance_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    instance_id UUID NOT NULL REFERENCES public.scenario_instances ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    turn_number INTEGER NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'chat',
    like_count INTEGER NOT NULL DEFAULT 0,
    dislike_count INTEGER NOT NULL DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================================================
-- MESSAGE REACTIONS: User feedback on AI responses
-- =============================================================================

CREATE TABLE public.message_reactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    message_id UUID NOT NULL REFERENCES public.instance_messages ON DELETE CASCADE,
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, message_id)
);

-- =============================================================================
-- LOGGING TABLES: Performance monitoring and audit trails
-- =============================================================================

CREATE TABLE public.query_performance_logs (
    id BIGSERIAL PRIMARY KEY,
    log_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_id UUID,
    query TEXT,
    duration_ms INTEGER
);

CREATE TABLE public.credit_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    transaction_id UUID,
    user_id UUID,
    credits_change INTEGER,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.rls_violation_logs (
    id BIGSERIAL PRIMARY KEY,
    table_name TEXT,
    user_id UUID,
    operation TEXT,
    row_id UUID,
    violation_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.connection_metrics_logs (
    id BIGSERIAL PRIMARY KEY,
    log_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    active_connections INTEGER,
    total_connections INTEGER
);

-- =============================================================================
-- INDEXES: Performance optimization for character selection and queries
-- =============================================================================

-- Scenario queries
CREATE INDEX idx_scenarios_creator_id ON public.scenarios(creator_id);
CREATE INDEX idx_scenarios_is_public ON public.scenarios(is_public);
CREATE INDEX idx_scenarios_created_at ON public.scenarios(created_at DESC);

-- Character selection optimization
CREATE INDEX idx_scenario_characters_scenario_id ON public.scenario_characters(scenario_id);
CREATE INDEX idx_scenario_characters_expertise ON public.scenario_characters USING GIN(expertise_keywords);

-- Gameplay session queries
CREATE INDEX idx_scenario_instances_user_id ON public.scenario_instances(user_id);
CREATE INDEX idx_scenario_instances_scenario_id ON public.scenario_instances(scenario_id);
CREATE INDEX idx_scenario_instances_status ON public.scenario_instances(status);

-- Message queries for conversation context
CREATE INDEX idx_instance_messages_instance_id ON public.instance_messages(instance_id);
CREATE INDEX idx_instance_messages_turn_number ON public.instance_messages(turn_number);

-- User engagement queries
CREATE INDEX idx_scenario_likes_user_id ON public.scenario_likes(user_id);
CREATE INDEX idx_scenario_likes_scenario_id ON public.scenario_likes(scenario_id);
CREATE INDEX idx_scenario_bookmarks_user_id ON public.scenario_bookmarks(user_id);

-- =============================================================================
-- CUSTOM FUNCTIONS: Credit management and automated counters
-- =============================================================================

-- Enhanced credit deduction function that integrates with Lovable's system
CREATE OR REPLACE FUNCTION public.deduct_credits(
    user_id UUID,
    amount INTEGER,
    reason TEXT,
    instance_id UUID DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- Function to log RLS violations for security monitoring
CREATE OR REPLACE FUNCTION public.log_rls_violation(
    table_name TEXT,
    user_id UUID,
    operation TEXT,
    row_id UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.rls_violation_logs (table_name, user_id, operation, row_id)
    VALUES (table_name, user_id, operation, row_id);
    
    -- Always return false to deny access
    RETURN FALSE;
END;
$$;

-- =============================================================================
-- TRIGGER FUNCTIONS: Automated counters for likes, bookmarks, reactions
-- =============================================================================

-- Update scenario like count when likes are added/removed
CREATE OR REPLACE FUNCTION public.update_scenario_like_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.scenarios
        SET like_count = like_count + 1
        WHERE id = NEW.scenario_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.scenarios
        SET like_count = like_count - 1
        WHERE id = OLD.scenario_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

-- Update scenario bookmark count when bookmarks are added/removed
CREATE OR REPLACE FUNCTION public.update_scenario_bookmark_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.scenarios
        SET bookmark_count = bookmark_count + 1
        WHERE id = NEW.scenario_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.scenarios
        SET bookmark_count = bookmark_count - 1
        WHERE id = OLD.scenario_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

-- Update message reaction counts when reactions are added/removed/changed
CREATE OR REPLACE FUNCTION public.update_message_reaction_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.reaction_type = 'like' THEN
            UPDATE public.instance_messages
            SET like_count = like_count + 1
            WHERE id = NEW.message_id;
        ELSIF NEW.reaction_type = 'dislike' THEN
            UPDATE public.instance_messages
            SET dislike_count = dislike_count + 1
            WHERE id = NEW.message_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.reaction_type = 'like' THEN
            UPDATE public.instance_messages
            SET like_count = like_count - 1
            WHERE id = OLD.message_id;
        ELSIF OLD.reaction_type = 'dislike' THEN
            UPDATE public.instance_messages
            SET dislike_count = dislike_count - 1
            WHERE id = OLD.message_id;
        END IF;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle reaction type changes
        IF OLD.reaction_type = 'like' THEN
            UPDATE public.instance_messages
            SET like_count = like_count - 1
            WHERE id = OLD.message_id;
        ELSIF OLD.reaction_type = 'dislike' THEN
            UPDATE public.instance_messages
            SET dislike_count = dislike_count - 1
            WHERE id = OLD.message_id;
        END IF;
        
        IF NEW.reaction_type = 'like' THEN
            UPDATE public.instance_messages
            SET like_count = like_count + 1
            WHERE id = NEW.message_id;
        ELSIF NEW.reaction_type = 'dislike' THEN
            UPDATE public.instance_messages
            SET dislike_count = dislike_count + 1
            WHERE id = NEW.message_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$;

-- =============================================================================
-- TRIGGERS: Activate automated counting functions
-- =============================================================================

CREATE TRIGGER trigger_update_scenario_like_count
    AFTER INSERT OR DELETE ON public.scenario_likes
    FOR EACH ROW EXECUTE FUNCTION public.update_scenario_like_count();

CREATE TRIGGER trigger_update_scenario_bookmark_count
    AFTER INSERT OR DELETE ON public.scenario_bookmarks
    FOR EACH ROW EXECUTE FUNCTION public.update_scenario_bookmark_count();

CREATE TRIGGER trigger_update_message_reaction_count
    AFTER INSERT OR UPDATE OR DELETE ON public.message_reactions
    FOR EACH ROW EXECUTE FUNCTION public.update_message_reaction_count();

-- =============================================================================
-- ROW LEVEL SECURITY: Enable RLS on all tables
-- =============================================================================

ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instance_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS POLICIES: Comprehensive data access control
-- =============================================================================

-- Scenarios: Public scenarios viewable by all, private by creator only
CREATE POLICY "View public scenarios or own scenarios" ON public.scenarios
    FOR SELECT USING (
        is_public = true 
        OR creator_id = auth.uid()
        OR log_rls_violation('scenarios', auth.uid(), 'SELECT', id)
    );

CREATE POLICY "Users can create scenarios" ON public.scenarios
    FOR INSERT WITH CHECK (
        creator_id = auth.uid()
        OR log_rls_violation('scenarios', auth.uid(), 'INSERT', id)
    );

CREATE POLICY "Users can update own scenarios" ON public.scenarios
    FOR UPDATE USING (
        creator_id = auth.uid()
        OR log_rls_violation('scenarios', auth.uid(), 'UPDATE', id)
    );

CREATE POLICY "Users can delete own scenarios" ON public.scenarios
    FOR DELETE USING (
        creator_id = auth.uid()
        OR log_rls_violation('scenarios', auth.uid(), 'DELETE', id)
    );

-- Scenario Characters: Follow scenario visibility rules
CREATE POLICY "Characters follow scenario visibility" ON public.scenario_characters
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.scenarios
            WHERE id = scenario_id
            AND (is_public = true OR creator_id = auth.uid())
        )
        OR log_rls_violation('scenario_characters', auth.uid(), 'SELECT', id)
    );

CREATE POLICY "Users can manage characters in own scenarios" ON public.scenario_characters
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.scenarios
            WHERE id = scenario_id AND creator_id = auth.uid()
        )
        OR log_rls_violation('scenario_characters', auth.uid(), 'ALL', id)
    );

-- Scenario Likes: Anyone can view, users manage their own
CREATE POLICY "Anyone can view likes" ON public.scenario_likes
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own likes" ON public.scenario_likes
    FOR ALL USING (
        user_id = auth.uid()
        OR log_rls_violation('scenario_likes', auth.uid(), 'ALL', id)
    );

-- Scenario Bookmarks: Users can only see and manage their own
CREATE POLICY "Users can view own bookmarks" ON public.scenario_bookmarks
    FOR SELECT USING (
        user_id = auth.uid()
        OR log_rls_violation('scenario_bookmarks', auth.uid(), 'SELECT', id)
    );

CREATE POLICY "Users can manage own bookmarks" ON public.scenario_bookmarks
    FOR ALL USING (
        user_id = auth.uid()
        OR log_rls_violation('scenario_bookmarks', auth.uid(), 'ALL', id)
    );

-- Scenario Instances: Users can only access their own gameplay sessions
CREATE POLICY "Users can view own instances" ON public.scenario_instances
    FOR SELECT USING (
        user_id = auth.uid()
        OR log_rls_violation('scenario_instances', auth.uid(), 'SELECT', id)
    );

CREATE POLICY "Users can create instances" ON public.scenario_instances
    FOR INSERT WITH CHECK (
        user_id = auth.uid()
        OR log_rls_violation('scenario_instances', auth.uid(), 'INSERT', id)
    );

CREATE POLICY "Users can update own instances" ON public.scenario_instances
    FOR UPDATE USING (
        user_id = auth.uid()
        OR log_rls_violation('scenario_instances', auth.uid(), 'UPDATE', id)
    );

-- Instance Messages: Users can only see messages from their own instances
CREATE POLICY "Users can view messages from own instances" ON public.instance_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.scenario_instances
            WHERE id = instance_id AND user_id = auth.uid()
        )
        OR log_rls_violation('instance_messages', auth.uid(), 'SELECT', id)
    );

CREATE POLICY "Users can add messages to own instances" ON public.instance_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.scenario_instances
            WHERE id = instance_id AND user_id = auth.uid()
        )
        OR log_rls_violation('instance_messages', auth.uid(), 'INSERT', id)
    );

-- Message Reactions: Anyone can view, users manage their own
CREATE POLICY "Users can view all message reactions" ON public.message_reactions
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own message reactions" ON public.message_reactions
    FOR ALL USING (
        user_id = auth.uid()
        OR log_rls_violation('message_reactions', auth.uid(), 'ALL', id)
    );

-- =============================================================================
-- FINAL SETUP: Grant permissions and create initial data
-- =============================================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.deduct_credits(UUID, INTEGER, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_rls_violation(TEXT, UUID, TEXT, UUID) TO authenticated;

-- Comment the tables for documentation
COMMENT ON TABLE public.scenarios IS 'Core scenario definitions with JSONB objectives and win/lose conditions';
COMMENT ON TABLE public.scenario_characters IS 'AI character definitions with personality, expertise, and relationships';
COMMENT ON TABLE public.scenario_instances IS 'Individual gameplay sessions with progress tracking';
COMMENT ON TABLE public.instance_messages IS 'Conversation history between users and AI characters';
COMMENT ON TABLE public.message_reactions IS 'User feedback on AI character responses';

-- Migration completed successfully
SELECT 'PlayScenarioAI core schema migration completed successfully' AS status;
