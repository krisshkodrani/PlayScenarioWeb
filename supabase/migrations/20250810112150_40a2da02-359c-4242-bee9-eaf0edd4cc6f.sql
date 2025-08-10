
-- Allow users to delete ONLY their own in-progress (playing) scenario instances,
-- and log attempted violations.
drop policy if exists "Users can delete own in-progress instances" on public.scenario_instances;

create policy "Users can delete own in-progress instances"
on public.scenario_instances
for delete
using (
  (user_id = auth.uid() and status = 'playing')
  or public.log_rls_violation('scenario_instances', auth.uid(), 'DELETE', id)
);

-- Cascade cleanup: delete messages and reactions when deleting an instance
create or replace function public.cascade_delete_scenario_instance()
returns trigger
language plpgsql
security definer
set search_path to ''
as $function$
begin
  -- Delete reactions for messages in this instance
  delete from public.message_reactions
  where message_id in (
    select id from public.instance_messages where instance_id = old.id
  );

  -- Delete messages for this instance
  delete from public.instance_messages
  where instance_id = old.id;

  return old;
end;
$function$;

drop trigger if exists scenario_instances_cascade_delete on public.scenario_instances;

create trigger scenario_instances_cascade_delete
before delete on public.scenario_instances
for each row
execute function public.cascade_delete_scenario_instance();
