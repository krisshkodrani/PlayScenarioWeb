-- Create new standalone characters table
CREATE TABLE public.characters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Character',
  personality TEXT NOT NULL,
  expertise_keywords TEXT[] NOT NULL DEFAULT '{}',
  avatar_url TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  status TEXT DEFAULT 'active',
  blocked_at TIMESTAMP WITH TIME ZONE,
  blocked_by UUID,
  blocked_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create junction table for scenario-character assignments
CREATE TABLE public.scenario_character_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scenario_id UUID NOT NULL,
  character_id UUID NOT NULL,
  is_player_character BOOLEAN NOT NULL DEFAULT false,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID NOT NULL,
  FOREIGN KEY (scenario_id) REFERENCES public.scenarios(id) ON DELETE CASCADE,
  FOREIGN KEY (character_id) REFERENCES public.characters(id) ON DELETE CASCADE,
  UNIQUE(scenario_id, character_id)
);

-- Enable RLS on new tables
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_character_assignments ENABLE ROW LEVEL SECURITY;

-- RLS policies for characters table
CREATE POLICY "Users can view own characters or public characters" 
ON public.characters 
FOR SELECT 
USING (
  creator_id = auth.uid() OR 
  (is_public = true AND status = 'active') OR 
  is_super_admin(auth.uid())
);

CREATE POLICY "Users can create their own characters" 
ON public.characters 
FOR INSERT 
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own characters" 
ON public.characters 
FOR UPDATE 
USING (creator_id = auth.uid());

CREATE POLICY "Users can delete their own characters" 
ON public.characters 
FOR DELETE 
USING (creator_id = auth.uid());

-- RLS policies for scenario_character_assignments table
CREATE POLICY "Users can view assignments for accessible scenarios" 
ON public.scenario_character_assignments 
FOR SELECT 
USING (
  scenario_id IN (
    SELECT id FROM public.scenarios 
    WHERE creator_id = auth.uid() OR (is_public = true AND status = 'active')
  )
);

CREATE POLICY "Users can create assignments for own scenarios" 
ON public.scenario_character_assignments 
FOR INSERT 
WITH CHECK (
  assigned_by = auth.uid() AND
  scenario_id IN (SELECT id FROM public.scenarios WHERE creator_id = auth.uid())
);

CREATE POLICY "Users can update assignments for own scenarios" 
ON public.scenario_character_assignments 
FOR UPDATE 
USING (
  scenario_id IN (SELECT id FROM public.scenarios WHERE creator_id = auth.uid())
);

CREATE POLICY "Users can delete assignments for own scenarios" 
ON public.scenario_character_assignments 
FOR DELETE 
USING (
  scenario_id IN (SELECT id FROM public.scenarios WHERE creator_id = auth.uid())
);

-- Create indexes for performance
CREATE INDEX idx_characters_creator_id ON public.characters(creator_id);
CREATE INDEX idx_characters_public ON public.characters(is_public) WHERE is_public = true;
CREATE INDEX idx_scenario_character_assignments_scenario_id ON public.scenario_character_assignments(scenario_id);
CREATE INDEX idx_scenario_character_assignments_character_id ON public.scenario_character_assignments(character_id);

-- Migrate existing data from scenario_characters to new structure
INSERT INTO public.characters (
  id,
  creator_id,
  name,
  role,
  personality,
  expertise_keywords,
  avatar_url,
  is_public,
  status,
  blocked_at,
  blocked_by,
  blocked_reason,
  created_at,
  updated_at
)
SELECT DISTINCT ON (creator_id, name, personality)
  gen_random_uuid(),
  creator_id,
  name,
  role,
  personality,
  expertise_keywords,
  avatar_url,
  false, -- Default to private
  status,
  blocked_at,
  blocked_by,
  blocked_reason,
  created_at,
  now()
FROM public.scenario_characters
WHERE status = 'active';

-- Create scenario-character assignments from existing data
INSERT INTO public.scenario_character_assignments (
  scenario_id,
  character_id,
  is_player_character,
  assigned_by,
  assigned_at
)
SELECT 
  sc.scenario_id,
  c.id,
  sc.is_player_character,
  sc.creator_id,
  sc.created_at
FROM public.scenario_characters sc
JOIN public.characters c ON (
  c.creator_id = sc.creator_id AND
  c.name = sc.name AND
  c.personality = sc.personality
)
WHERE sc.status = 'active';