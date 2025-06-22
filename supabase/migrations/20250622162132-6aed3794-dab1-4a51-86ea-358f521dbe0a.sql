
-- Enable RLS on message-related tables
ALTER TABLE public.instance_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_instances ENABLE ROW LEVEL SECURITY;

-- RLS policies for instance_messages
-- Users can only see messages from their own scenario instances
CREATE POLICY "Users can view messages from their instances" 
  ON public.instance_messages 
  FOR SELECT 
  USING (
    instance_id IN (
      SELECT id FROM public.scenario_instances WHERE user_id = auth.uid()
    )
  );

-- Users can insert messages to their own instances
CREATE POLICY "Users can create messages in their instances" 
  ON public.instance_messages 
  FOR INSERT 
  WITH CHECK (
    instance_id IN (
      SELECT id FROM public.scenario_instances WHERE user_id = auth.uid()
    )
  );

-- RLS policies for scenario_instances
-- Users can view their own instances
CREATE POLICY "Users can view their own instances" 
  ON public.scenario_instances 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Users can create their own instances
CREATE POLICY "Users can create their own instances" 
  ON public.scenario_instances 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- Users can update their own instances
CREATE POLICY "Users can update their own instances" 
  ON public.scenario_instances 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- RLS policies for message_reactions
-- Users can view reactions on messages they can see
CREATE POLICY "Users can view reactions on accessible messages" 
  ON public.message_reactions 
  FOR SELECT 
  USING (
    message_id IN (
      SELECT id FROM public.instance_messages 
      WHERE instance_id IN (
        SELECT id FROM public.scenario_instances WHERE user_id = auth.uid()
      )
    )
  );

-- Users can create reactions on messages they can see
CREATE POLICY "Users can create reactions on accessible messages" 
  ON public.message_reactions 
  FOR INSERT 
  WITH CHECK (
    user_id = auth.uid() AND
    message_id IN (
      SELECT id FROM public.instance_messages 
      WHERE instance_id IN (
        SELECT id FROM public.scenario_instances WHERE user_id = auth.uid()
      )
    )
  );

-- Enable real-time for the tables
ALTER TABLE public.instance_messages REPLICA IDENTITY FULL;
ALTER TABLE public.scenario_instances REPLICA IDENTITY FULL;
ALTER TABLE public.message_reactions REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.instance_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scenario_instances;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;
