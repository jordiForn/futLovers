create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon, authenticated;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  avatar_url text,
  level numeric not null default 5,
  reliability_score numeric not null default 100,
  created_at timestamptz not null default now(),
  constraint profiles_username_not_blank check (char_length(trim(username)) > 0)
);

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  address text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz not null default now()
);

create table if not exists public.fields (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues (id) on delete cascade,
  name text not null,
  modality text not null default 'F5',
  capacity integer not null default 10,
  created_at timestamptz not null default now(),
  constraint fields_capacity_positive check (capacity > 0)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles (id) on delete restrict,
  field_id uuid references public.fields (id) on delete set null,
  starts_at timestamptz not null,
  modality text not null default 'F5',
  capacity integer not null default 10,
  min_level numeric,
  max_level numeric,
  status text not null default 'open',
  notes text,
  created_at timestamptz not null default now(),
  constraint matches_capacity_positive check (capacity > 0),
  constraint matches_status_valid check (status in ('open', 'cancelled', 'completed'))
);

create table if not exists public.match_players (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches (id) on delete cascade,
  player_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  constraint match_players_unique unique (match_id, player_id)
);

create index if not exists fields_venue_id_idx on public.fields (venue_id);
create index if not exists matches_starts_at_idx on public.matches (starts_at);
create index if not exists matches_field_id_idx on public.matches (field_id);
create index if not exists matches_status_starts_at_idx on public.matches (status, starts_at);
create index if not exists match_players_match_id_idx on public.match_players (match_id);
create index if not exists match_players_player_id_idx on public.match_players (player_id);

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
      nullif(split_part(new.email, '@', 1), ''),
      'jugador'
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

create or replace function private.protect_profile_stats()
returns trigger
language plpgsql
as $$
begin
  new.id := old.id;
  new.level := old.level;
  new.reliability_score := old.reliability_score;
  new.created_at := old.created_at;
  return new;
end;
$$;

drop trigger if exists protect_profile_stats on public.profiles;
create trigger protect_profile_stats
  before update on public.profiles
  for each row execute function private.protect_profile_stats();

create or replace function private.enforce_match_join()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  match_capacity integer;
  match_status text;
  player_count integer;
begin
  select capacity, status
  into match_capacity, match_status
  from public.matches
  where id = new.match_id
  for update;

  if match_status is null then
    raise exception 'match_not_found';
  end if;

  if match_status is distinct from 'open' then
    raise exception 'match_not_open';
  end if;

  select count(*)
  into player_count
  from public.match_players
  where match_id = new.match_id;

  if player_count >= match_capacity then
    raise exception 'match_full';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_match_join on public.match_players;
create trigger enforce_match_join
  before insert on public.match_players
  for each row execute function private.enforce_match_join();

create or replace function private.add_creator_as_player()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.match_players (match_id, player_id)
  values (new.id, new.created_by);
  return new;
end;
$$;

drop trigger if exists add_creator_as_player on public.matches;
create trigger add_creator_as_player
  after insert on public.matches
  for each row execute function private.add_creator_as_player();

alter table public.profiles enable row level security;
alter table public.venues enable row level security;
alter table public.fields enable row level security;
alter table public.matches enable row level security;
alter table public.match_players enable row level security;

grant usage on schema public to anon, authenticated;

grant select on table public.profiles to anon, authenticated;
grant insert, update on table public.profiles to authenticated;

grant select on table public.venues to anon, authenticated;
grant select on table public.fields to anon, authenticated;

grant select on table public.matches to anon, authenticated;
grant insert, update, delete on table public.matches to authenticated;

grant select on table public.match_players to anon, authenticated;
grant insert, delete on table public.match_players to authenticated;

drop policy if exists profiles_select_public on public.profiles;
create policy profiles_select_public
  on public.profiles
  for select
  to anon, authenticated
  using (true);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists venues_select_public on public.venues;
create policy venues_select_public
  on public.venues
  for select
  to anon, authenticated
  using (true);

drop policy if exists fields_select_public on public.fields;
create policy fields_select_public
  on public.fields
  for select
  to anon, authenticated
  using (true);

drop policy if exists matches_select_public on public.matches;
create policy matches_select_public
  on public.matches
  for select
  to anon, authenticated
  using (true);

drop policy if exists matches_insert_own on public.matches;
create policy matches_insert_own
  on public.matches
  for insert
  to authenticated
  with check (auth.uid() = created_by);

drop policy if exists matches_update_own on public.matches;
create policy matches_update_own
  on public.matches
  for update
  to authenticated
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

drop policy if exists matches_delete_own on public.matches;
create policy matches_delete_own
  on public.matches
  for delete
  to authenticated
  using (auth.uid() = created_by);

drop policy if exists match_players_select_public on public.match_players;
create policy match_players_select_public
  on public.match_players
  for select
  to anon, authenticated
  using (true);

drop policy if exists match_players_insert_own on public.match_players;
create policy match_players_insert_own
  on public.match_players
  for insert
  to authenticated
  with check (auth.uid() = player_id);

drop policy if exists match_players_delete_own on public.match_players;
create policy match_players_delete_own
  on public.match_players
  for delete
  to authenticated
  using (auth.uid() = player_id);

insert into public.venues (id, name, city, address, latitude, longitude)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Polideportivo Municipal de Dénia',
    'Dénia',
    'Avenida de Miguel Hernández, Dénia',
    38.8408,
    0.1057
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Campo Municipal Diego Casanova',
    'Dénia',
    'Partida Madrigueres, Dénia',
    38.837,
    0.118
  )
on conflict (id) do nothing;

insert into public.fields (id, venue_id, name, modality, capacity)
values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Campo 1',
    'F5',
    10
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    'Campo 2',
    'F5',
    10
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '22222222-2222-2222-2222-222222222222',
    'Campo principal',
    'F5',
    10
  )
on conflict (id) do nothing;
