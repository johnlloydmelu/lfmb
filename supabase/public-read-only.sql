-- Apply this once in Supabase SQL Editor for the project used by lfmb.
-- This removes the old admin allowlist and all client-side write policies.

begin;

do $$
begin
  if to_regclass('public.app_admins') is not null then
    execute 'drop policy if exists "Admins can view their own admin record" on public.app_admins';
  end if;
end;
$$;

drop policy if exists "Anyone can view memories"
  on public.memories;
drop policy if exists "Admins can insert memories"
  on public.memories;
drop policy if exists "Admins can update memories"
  on public.memories;
drop policy if exists "Admins can delete memories"
  on public.memories;

drop policy if exists "Anyone can view timeline"
  on public.timeline_events;
drop policy if exists "Admins can insert timeline"
  on public.timeline_events;
drop policy if exists "Admins can update timeline"
  on public.timeline_events;
drop policy if exists "Admins can delete timeline"
  on public.timeline_events;

drop policy if exists "Public can view memory images"
  on storage.objects;
drop policy if exists "Admins can upload memory images"
  on storage.objects;
drop policy if exists "Admins can update memory images"
  on storage.objects;
drop policy if exists "Admins can delete memory images"
  on storage.objects;

drop function if exists public.is_app_admin();
drop table if exists public.app_admins;

alter table public.memories enable row level security;
alter table public.timeline_events enable row level security;

grant select on public.memories to anon, authenticated;
grant select on public.timeline_events to anon, authenticated;
revoke insert, update, delete on public.memories from anon, authenticated;
revoke insert, update, delete on public.timeline_events from anon, authenticated;

create policy "Anyone can view memories"
  on public.memories
  for select
  to anon, authenticated
  using (true);

create policy "Anyone can view timeline"
  on public.timeline_events
  for select
  to anon, authenticated
  using (true);

insert into storage.buckets (id, name, public)
values ('memories', 'memories', true)
on conflict (id) do update set public = true;

create policy "Public can view memory images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'memories');

commit;
