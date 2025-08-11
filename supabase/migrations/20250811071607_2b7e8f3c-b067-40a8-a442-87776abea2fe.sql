-- Drop unused analytics-related and backup tables safely
-- These tables are not part of the final admin scope (moderation only)

-- 1) Connection metrics logs
DROP TABLE IF EXISTS public.connection_metrics_logs CASCADE;

-- 2) Query performance logs
DROP TABLE IF EXISTS public.query_performance_logs CASCADE;

-- 3) Scenario characters backup table
DROP TABLE IF EXISTS public.scenario_characters_backup CASCADE;