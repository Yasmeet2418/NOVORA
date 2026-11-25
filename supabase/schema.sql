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
