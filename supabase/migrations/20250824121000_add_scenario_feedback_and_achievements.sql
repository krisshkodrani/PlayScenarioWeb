-- Scenario feedback cache
create table if not exists public.scenario_feedback (
  id uuid primary key default gen_random_uuid(),
  instance_id uuid not null unique,
  user_id uuid not null,
  scenario_id uuid not null,
  detail_level text check (detail_level in ('short','standard','deep')) default 'standard',
  feedback jsonb not null,
  ai_model text,
  prompt_version text,
  generated_at timestamptz not null default now(),
  version int not null default 1
);

create index if not exists scenario_feedback_user_idx on public.scenario_feedback(user_id);
create index if not exists scenario_feedback_scenario_idx on public.scenario_feedback(scenario_id);

alter table public.scenario_feedback enable row level security;

-- Ensure idempotency: drop policies if they already exist
drop policy if exists "users can read own feedback" on public.scenario_feedback;
drop policy if exists "users can insert own feedback" on public.scenario_feedback;
drop policy if exists "users can update own feedback" on public.scenario_feedback;

create policy "users can read own feedback"
  on public.scenario_feedback for select
  using (auth.uid() = user_id);

create policy "users can insert own feedback"
  on public.scenario_feedback for insert
  with check (auth.uid() = user_id);

create policy "users can update own feedback"
  on public.scenario_feedback for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Achievement unlocks derived from feedback
create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  scenario_id uuid not null,
  instance_id uuid not null,
  code text not null default 'scenario_completion',
  title text not null,
  description text,
  tier smallint not null default 1,
  unlocked_at timestamptz not null default now(),
  payload jsonb,
  unique (user_id, instance_id, code)
);

create index if not exists user_achievements_user_idx on public.user_achievements(user_id);
create index if not exists user_achievements_scenario_idx on public.user_achievements(scenario_id);

alter table public.user_achievements enable row level security;

-- Ensure idempotency: drop policies if they already exist
drop policy if exists "users can read own achievements" on public.user_achievements;
drop policy if exists "users can create own achievements" on public.user_achievements;

create policy "users can read own achievements"
  on public.user_achievements for select
  using (auth.uid() = user_id);

create policy "users can create own achievements"
  on public.user_achievements for insert
  with check (auth.uid() = user_id);
