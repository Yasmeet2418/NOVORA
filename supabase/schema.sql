create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  class_level text not null default 'Class 10',
  target_exam text not null default 'jee-main',
  daily_target_hours numeric(4, 1) not null default 3.5 check (daily_target_hours > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

grant select, insert, update on public.profiles to authenticated;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_profile_created on auth.users;
create trigger on_auth_user_profile_created
  after insert on auth.users
  for each row execute function public.handle_new_user_profile();

insert into public.profiles (id, full_name)
select id, coalesce(raw_user_meta_data ->> 'full_name', '')
from auth.users
on conflict (id) do nothing;

create table if not exists public.recallmate_user_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.recallmate_user_data enable row level security;

grant select, insert, update on public.recallmate_user_data to authenticated;

drop policy if exists "Users can read their own RecallMate data" on public.recallmate_user_data;
create policy "Users can read their own RecallMate data"
  on public.recallmate_user_data for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own RecallMate data" on public.recallmate_user_data;
create policy "Users can create their own RecallMate data"
  on public.recallmate_user_data for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own RecallMate data" on public.recallmate_user_data;
create policy "Users can update their own RecallMate data"
  on public.recallmate_user_data for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
