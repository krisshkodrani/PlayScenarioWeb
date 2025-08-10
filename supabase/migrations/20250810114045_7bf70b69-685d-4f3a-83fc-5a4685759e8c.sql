-- Enable RLS on scenario_instances (safe to run if already enabled)
ALTER TABLE public.scenario_instances ENABLE ROW LEVEL SECURITY;

-- Allow users to delete only their own in-progress game instances
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'scenario_instances'
      AND policyname = 'Users can delete their own in-progress instances'
  ) THEN
    CREATE POLICY "Users can delete their own in-progress instances"
    ON public.scenario_instances
    FOR DELETE
    USING (
      auth.uid() = user_id AND status = 'playing'
    );
  END IF;
END $$;

-- Create a BEFORE DELETE trigger to cascade delete messages and reactions for the instance
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'scenario_instances_before_delete'
  ) THEN
    CREATE TRIGGER scenario_instances_before_delete
    BEFORE DELETE ON public.scenario_instances
    FOR EACH ROW
    EXECUTE FUNCTION public.cascade_delete_scenario_instance();
  END IF;
END $$;