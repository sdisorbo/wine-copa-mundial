-- Wine Copa Mundial — Supabase schema
-- Run this once in your Supabase project: SQL Editor → New query → paste → Run.
-- Safe to re-run (idempotent).

-- ---------------------------------------------------------------------------
-- Voting phases: the admin opens/closes each phase. Closing 'group' locks the
-- bracket; each bracket round opens/closes in turn.
-- ---------------------------------------------------------------------------
create table if not exists voting_phases (
  phase text primary key check (phase in ('group', 'qf', 'sf', 'final')),
  status text not null default 'pending' check (status in ('pending', 'open', 'closed')),
  updated_at timestamptz not null default now()
);

insert into voting_phases (phase, status) values
  ('group', 'pending'),
  ('qf', 'pending'),
  ('sf', 'pending'),
  ('final', 'pending')
on conflict (phase) do nothing;

-- ---------------------------------------------------------------------------
-- Group ballots: each team casts TWO entries (its two members) for every group
-- OTHER than its own. `ranking` is the 4 team slugs, best first.
-- ---------------------------------------------------------------------------
create table if not exists group_ballots (
  id uuid primary key default gen_random_uuid(),
  team_slug text not null,                       -- the voting team
  grp text not null check (grp in ('A', 'B', 'C')),
  entry int not null check (entry in (1, 2)),    -- which of the two members
  ranking jsonb not null,                        -- ['italy','france',...] best first
  updated_at timestamptz not null default now(),
  unique (team_slug, grp, entry)
);

-- ---------------------------------------------------------------------------
-- Bracket matchup votes: each team casts TWO votes (its two members) per
-- matchup it is not playing in.
-- ---------------------------------------------------------------------------
create table if not exists match_votes (
  id uuid primary key default gen_random_uuid(),
  round text not null check (round in ('qf', 'sf', 'final')),
  match_id text not null,                         -- qf1..qf4, sf1, sf2, final
  voter_team_slug text not null,
  entry int not null default 1 check (entry in (1, 2)),  -- which of the two members
  pick_slug text not null,
  updated_at timestamptz not null default now(),
  unique (round, match_id, voter_team_slug, entry)
);

-- Migration for databases created before the two-votes-per-round change:
alter table match_votes
  add column if not exists entry int not null default 1 check (entry in (1, 2));
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'match_votes_round_match_id_voter_team_slug_key'
  ) then
    alter table match_votes drop constraint match_votes_round_match_id_voter_team_slug_key;
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'match_votes_round_match_entry_key'
  ) then
    alter table match_votes
      add constraint match_votes_round_match_entry_key
      unique (round, match_id, voter_team_slug, entry);
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Admin tie-break / manual winner override for a matchup.
-- ---------------------------------------------------------------------------
create table if not exists match_overrides (
  round text not null check (round in ('qf', 'sf', 'final')),
  match_id text not null,
  winner_slug text not null,
  primary key (round, match_id)
);

-- ---------------------------------------------------------------------------
-- Row Level Security. This is a private party app authenticated only by
-- client-side PINs, so we allow the anon key full access. Tighten if you ever
-- expose the URL publicly.
-- ---------------------------------------------------------------------------
alter table voting_phases  enable row level security;
alter table group_ballots  enable row level security;
alter table match_votes    enable row level security;
alter table match_overrides enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'voting_phases' and policyname = 'anon all') then
    create policy "anon all" on voting_phases for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'group_ballots' and policyname = 'anon all') then
    create policy "anon all" on group_ballots for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'match_votes' and policyname = 'anon all') then
    create policy "anon all" on match_votes for all using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'match_overrides' and policyname = 'anon all') then
    create policy "anon all" on match_overrides for all using (true) with check (true);
  end if;
end $$;
