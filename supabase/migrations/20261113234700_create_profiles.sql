create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  age_range text,
  cognitive_wellness_rating smallint
    check (cognitive_wellness_rating between 1 and 10),
  stress_rating smallint
    check (stress_rating between 1 and 10),
  responsibility_rating smallint
    check (responsibility_rating between 1 and 10),
  audio_genres text[] not null default array[]::text[],
  brain_games text[] not null default array[]::text[],
  notifications_enabled boolean not null default false,
  reminder_hour text not null default '08',
  reminder_minute text not null default '40',
  reminder_period text not null default 'PM'
    check (reminder_period in ('AM', 'PM')),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists full_name text not null default '',
  add column if not exists age_range text,
  add column if not exists cognitive_wellness_rating smallint,
  add column if not exists stress_rating smallint,
  add column if not exists responsibility_rating smallint,
  add column if not exists audio_genres text[] not null default array[]::text[],
  add column if not exists brain_games text[] not null default array[]::text[],
  add column if not exists notifications_enabled boolean not null default false,
  add column if not exists reminder_hour text not null default '08',
  add column if not exists reminder_minute text not null default '40',
  add column if not exists reminder_period text not null default 'PM',
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

grant select, insert, update on public.profiles to authenticated;
revoke all on public.profiles from anon;

create or replace function public.sync_profile_from_auth_metadata(
  p_user_id uuid,
  p_metadata jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  user_metadata jsonb := coalesce(p_metadata, '{}'::jsonb);
begin
  insert into public.profiles (
    id,
    full_name,
    age_range,
    cognitive_wellness_rating,
    stress_rating,
    responsibility_rating,
    audio_genres,
    brain_games,
    notifications_enabled,
    reminder_hour,
    reminder_minute,
    reminder_period,
    onboarding_completed,
    updated_at
  )
  values (
    p_user_id,
    coalesce(user_metadata ->> 'full_name', ''),
    nullif(user_metadata ->> 'age_range', ''),
    case
      when coalesce(user_metadata ->> 'cognitive_wellness_rating', '') ~ '^([1-9]|10)$'
        then (user_metadata ->> 'cognitive_wellness_rating')::smallint
      else null
    end,
    case
      when coalesce(user_metadata ->> 'stress_rating', '') ~ '^([1-9]|10)$'
        then (user_metadata ->> 'stress_rating')::smallint
      else null
    end,
    case
      when coalesce(user_metadata ->> 'responsibility_rating', '') ~ '^([1-9]|10)$'
        then (user_metadata ->> 'responsibility_rating')::smallint
      else null
    end,
    case
      when jsonb_typeof(user_metadata -> 'audio_genres') = 'array'
        then array(select jsonb_array_elements_text(user_metadata -> 'audio_genres'))
      else array[]::text[]
    end,
    case
      when jsonb_typeof(user_metadata -> 'brain_games') = 'array'
        then array(select jsonb_array_elements_text(user_metadata -> 'brain_games'))
      else array[]::text[]
    end,
    lower(coalesce(user_metadata ->> 'notifications_enabled', 'false')) = 'true',
    coalesce(user_metadata ->> 'reminder_hour', '08'),
    coalesce(user_metadata ->> 'reminder_minute', '40'),
    case
      when user_metadata ->> 'reminder_period' in ('AM', 'PM')
        then user_metadata ->> 'reminder_period'
      else 'PM'
    end,
    lower(coalesce(user_metadata ->> 'onboarding_completed', 'false')) = 'true',
    now()
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    age_range = excluded.age_range,
    cognitive_wellness_rating = excluded.cognitive_wellness_rating,
    stress_rating = excluded.stress_rating,
    responsibility_rating = excluded.responsibility_rating,
    audio_genres = excluded.audio_genres,
    brain_games = excluded.brain_games,
    notifications_enabled = excluded.notifications_enabled,
    reminder_hour = excluded.reminder_hour,
    reminder_minute = excluded.reminder_minute,
    reminder_period = excluded.reminder_period,
    onboarding_completed = excluded.onboarding_completed,
    updated_at = now();
end;
$$;

revoke all on function public.sync_profile_from_auth_metadata(uuid, jsonb)
  from public, anon, authenticated;

create or replace function public.handle_new_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.sync_profile_from_auth_metadata(new.id, new.raw_user_meta_data);
  return new;
end;
$$;

revoke all on function public.handle_new_auth_user_profile()
  from public, anon, authenticated;

drop trigger if exists on_auth_user_profile_created on auth.users;

create trigger on_auth_user_profile_created
  after insert on auth.users
  for each row
  execute function public.handle_new_auth_user_profile();

do $$
declare
  auth_user record;
begin
  for auth_user in
    select id, raw_user_meta_data
    from auth.users
  loop
    perform public.sync_profile_from_auth_metadata(
      auth_user.id,
      auth_user.raw_user_meta_data
    );
  end loop;
end;
$$;
