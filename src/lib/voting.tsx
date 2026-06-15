"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase, supabaseEnabled } from "@/lib/supabase";
import {
  allStandings,
  qualifiers as computeQualifiers,
  quarterfinals,
  wildcardSlugs,
  hasGroupData,
  type Standings,
  type Qualifiers,
} from "@/lib/scoring";
import type { GroupScores } from "@/lib/storage";
import { getTeam, type Group } from "@/config/teams";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Phase = "group" | "qf" | "sf" | "final";
export type PhaseStatus = "pending" | "open" | "closed";
export type Round = "qf" | "sf" | "final";

export interface GroupBallot {
  team_slug: string;
  grp: Group;
  entry: number;
  ranking: string[];
}

export interface MatchVote {
  round: Round;
  match_id: string;
  voter_team_slug: string;
  pick_slug: string;
}

export interface MatchView {
  round: Round;
  matchId: string;
  home?: string;
  away?: string;
  homeLabel: string;
  awayLabel: string;
  homeVotes: number;
  awayVotes: number;
  totalVotes: number;
  winner?: string; // resolved (majority or admin override)
  overridden: boolean;
  tie: boolean; // equal votes with at least one vote, no override
}

interface VotingValue {
  configured: boolean;
  loading: boolean;
  error: string | null;

  phases: Record<Phase, PhaseStatus>;
  standings: Standings;
  qualifiers: Qualifiers;
  wildcards: Set<string>;
  groupHasData: (grp: Group) => boolean;

  matches: Record<Round, MatchView[]>;
  champion?: string;

  ballotFor: (teamSlug: string, grp: Group, entry: number) => string[] | null;
  voteFor: (teamSlug: string, round: Round, matchId: string) => string | null;

  // team actions
  castGroupBallot: (
    teamSlug: string,
    grp: Group,
    entry: number,
    ranking: string[]
  ) => Promise<void>;
  castMatchVote: (
    teamSlug: string,
    round: Round,
    matchId: string,
    pick: string
  ) => Promise<void>;

  // admin actions
  setPhase: (phase: Phase, status: PhaseStatus) => Promise<void>;
  setOverride: (round: Round, matchId: string, winner: string) => Promise<void>;
  clearOverride: (round: Round, matchId: string) => Promise<void>;
  resetPhase: (phase: Phase) => Promise<void>;
  resetAll: () => Promise<void>;

  refetch: () => Promise<void>;
}

const VotingContext = createContext<VotingValue | null>(null);

/* ------------------------------------------------------------------ */
/* Derivation helpers                                                  */
/* ------------------------------------------------------------------ */

function ballotsToScores(ballots: GroupBallot[]): GroupScores {
  const scores: GroupScores = {};
  for (const b of ballots) {
    const bucket = (scores[b.grp] ??= {});
    bucket[`${b.team_slug}#${b.entry}`] = b.ranking;
  }
  return scores;
}

function overrideKey(round: Round, matchId: string) {
  return `${round}:${matchId}`;
}

function tally(
  votes: MatchVote[],
  round: Round,
  matchId: string,
  home?: string,
  away?: string
) {
  let homeVotes = 0;
  let awayVotes = 0;
  for (const v of votes) {
    if (v.round !== round || v.match_id !== matchId) continue;
    if (home && v.pick_slug === home) homeVotes++;
    else if (away && v.pick_slug === away) awayVotes++;
  }
  return { homeVotes, awayVotes };
}

function buildMatch(
  round: Round,
  matchId: string,
  home: string | undefined,
  away: string | undefined,
  homeLabel: string,
  awayLabel: string,
  votes: MatchVote[],
  overrides: Map<string, string>
): MatchView {
  const { homeVotes, awayVotes } = tally(votes, round, matchId, home, away);
  const total = homeVotes + awayVotes;
  const override = overrides.get(overrideKey(round, matchId));

  let winner: string | undefined;
  let tie = false;
  if (override && (override === home || override === away)) {
    winner = override;
  } else if (home && away) {
    if (homeVotes > awayVotes) winner = home;
    else if (awayVotes > homeVotes) winner = away;
    else if (total > 0) tie = true; // equal with votes → needs tie-break
  }

  return {
    round,
    matchId,
    home,
    away,
    homeLabel,
    awayLabel,
    homeVotes,
    awayVotes,
    totalVotes: total,
    winner,
    overridden: Boolean(override),
    tie,
  };
}

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

const POLL_MS = 4000;

export function VotingProvider({ children }: { children: React.ReactNode }) {
  const [phasesRaw, setPhasesRaw] = useState<Record<Phase, PhaseStatus>>({
    group: "pending",
    qf: "pending",
    sf: "pending",
    final: "pending",
  });
  const [ballots, setBallots] = useState<GroupBallot[]>([]);
  const [votes, setVotes] = useState<MatchVote[]>([]);
  const [overrides, setOverrides] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const refetch = useCallback(async () => {
    if (!supabase || inFlight.current) return;
    inFlight.current = true;
    try {
      const [p, b, v, o] = await Promise.all([
        supabase.from("voting_phases").select("phase,status"),
        supabase.from("group_ballots").select("team_slug,grp,entry,ranking"),
        supabase
          .from("match_votes")
          .select("round,match_id,voter_team_slug,pick_slug"),
        supabase.from("match_overrides").select("round,match_id,winner_slug"),
      ]);

      if (p.data) {
        const next: Record<Phase, PhaseStatus> = {
          group: "pending",
          qf: "pending",
          sf: "pending",
          final: "pending",
        };
        for (const row of p.data as { phase: Phase; status: PhaseStatus }[]) {
          next[row.phase] = row.status;
        }
        setPhasesRaw(next);
      }
      if (b.data) setBallots(b.data as GroupBallot[]);
      if (v.data) setVotes(v.data as MatchVote[]);
      if (o.data) {
        const m = new Map<string, string>();
        for (const row of o.data as {
          round: Round;
          match_id: string;
          winner_slug: string;
        }[]) {
          m.set(overrideKey(row.round, row.match_id), row.winner_slug);
        }
        setOverrides(m);
      }
      setError(
        p.error?.message ||
          b.error?.message ||
          v.error?.message ||
          o.error?.message ||
          null
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load voting data");
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!supabaseEnabled) {
      setLoading(false);
      return;
    }
    refetch();
    const id = setInterval(() => {
      if (document.visibilityState === "visible") refetch();
    }, POLL_MS);
    const onVis = () => {
      if (document.visibilityState === "visible") refetch();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [refetch]);

  /* ----- derived data ----- */

  const scores = useMemo(() => ballotsToScores(ballots), [ballots]);
  const standings = useMemo(() => allStandings(scores), [scores]);
  const qualifiers = useMemo(() => computeQualifiers(scores), [scores]);
  const wildcards = useMemo(() => wildcardSlugs(scores), [scores]);

  const matches = useMemo(() => {
    // Quarter-finals seeded from group qualifiers.
    const qfSeeds = quarterfinals(scores);
    const qf = qfSeeds.map((m) =>
      buildMatch(
        "qf",
        m.id,
        m.home.slug,
        m.away.slug,
        m.home.label,
        m.away.label,
        votes,
        overrides
      )
    );

    const win = (id: string) => qf.find((m) => m.matchId === id)?.winner;

    // Semi-finals from QF winners: qf1×qf2 → sf1, qf3×qf4 → sf2.
    const sf = [
      buildMatch("sf", "sf1", win("qf1"), win("qf2"), "QF1", "QF2", votes, overrides),
      buildMatch("sf", "sf2", win("qf3"), win("qf4"), "QF3", "QF4", votes, overrides),
    ];
    const sfWin = (id: string) => sf.find((m) => m.matchId === id)?.winner;

    const final = [
      buildMatch(
        "final",
        "final",
        sfWin("sf1"),
        sfWin("sf2"),
        "SF1",
        "SF2",
        votes,
        overrides
      ),
    ];

    return { qf, sf, final };
  }, [scores, votes, overrides]);

  const champion = matches.final[0]?.winner;

  const groupHasData = useCallback(
    (grp: Group) => hasGroupData(scores, grp),
    [scores]
  );

  const ballotFor = useCallback(
    (teamSlug: string, grp: Group, entry: number) =>
      ballots.find(
        (b) => b.team_slug === teamSlug && b.grp === grp && b.entry === entry
      )?.ranking ?? null,
    [ballots]
  );

  const voteFor = useCallback(
    (teamSlug: string, round: Round, matchId: string) =>
      votes.find(
        (v) =>
          v.voter_team_slug === teamSlug &&
          v.round === round &&
          v.match_id === matchId
      )?.pick_slug ?? null,
    [votes]
  );

  /* ----- actions ----- */

  const castGroupBallot = useCallback(
    async (teamSlug: string, grp: Group, entry: number, ranking: string[]) => {
      if (!supabase) return;
      const { error } = await supabase
        .from("group_ballots")
        .upsert(
          { team_slug: teamSlug, grp, entry, ranking, updated_at: new Date().toISOString() },
          { onConflict: "team_slug,grp,entry" }
        );
      if (error) throw new Error(error.message);
      await refetch();
    },
    [refetch]
  );

  const castMatchVote = useCallback(
    async (teamSlug: string, round: Round, matchId: string, pick: string) => {
      if (!supabase) return;
      const { error } = await supabase.from("match_votes").upsert(
        {
          round,
          match_id: matchId,
          voter_team_slug: teamSlug,
          pick_slug: pick,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "round,match_id,voter_team_slug" }
      );
      if (error) throw new Error(error.message);
      await refetch();
    },
    [refetch]
  );

  const setPhase = useCallback(
    async (phase: Phase, status: PhaseStatus) => {
      if (!supabase) return;
      const { error } = await supabase
        .from("voting_phases")
        .upsert(
          { phase, status, updated_at: new Date().toISOString() },
          { onConflict: "phase" }
        );
      if (error) throw new Error(error.message);
      await refetch();
    },
    [refetch]
  );

  const setOverride = useCallback(
    async (round: Round, matchId: string, winner: string) => {
      if (!supabase) return;
      const { error } = await supabase
        .from("match_overrides")
        .upsert(
          { round, match_id: matchId, winner_slug: winner },
          { onConflict: "round,match_id" }
        );
      if (error) throw new Error(error.message);
      await refetch();
    },
    [refetch]
  );

  const clearOverride = useCallback(
    async (round: Round, matchId: string) => {
      if (!supabase) return;
      const { error } = await supabase
        .from("match_overrides")
        .delete()
        .match({ round, match_id: matchId });
      if (error) throw new Error(error.message);
      await refetch();
    },
    [refetch]
  );

  const resetPhase = useCallback(
    async (phase: Phase) => {
      if (!supabase) return;
      if (phase === "group") {
        await supabase.from("group_ballots").delete().neq("team_slug", "");
      } else {
        await supabase.from("match_votes").delete().eq("round", phase);
        await supabase.from("match_overrides").delete().eq("round", phase);
      }
      await setPhase(phase, "pending");
    },
    [setPhase]
  );

  const resetAll = useCallback(async () => {
    if (!supabase) return;
    await Promise.all([
      supabase.from("group_ballots").delete().neq("team_slug", ""),
      supabase.from("match_votes").delete().neq("voter_team_slug", ""),
      supabase.from("match_overrides").delete().neq("match_id", ""),
    ]);
    await Promise.all([
      setPhase("group", "pending"),
      setPhase("qf", "pending"),
      setPhase("sf", "pending"),
      setPhase("final", "pending"),
    ]);
  }, [setPhase]);

  const value: VotingValue = {
    configured: supabaseEnabled,
    loading,
    error,
    phases: phasesRaw,
    standings,
    qualifiers,
    wildcards,
    groupHasData,
    matches,
    champion,
    ballotFor,
    voteFor,
    castGroupBallot,
    castMatchVote,
    setPhase,
    setOverride,
    clearOverride,
    resetPhase,
    resetAll,
    refetch,
  };

  return (
    <VotingContext.Provider value={value}>{children}</VotingContext.Provider>
  );
}

export function useVoting(): VotingValue {
  const ctx = useContext(VotingContext);
  if (!ctx) throw new Error("useVoting must be used within <VotingProvider>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Eligibility helpers                                                 */
/* ------------------------------------------------------------------ */

export function canVoteGroup(teamSlug: string, grp: Group): boolean {
  const t = getTeam(teamSlug);
  return Boolean(t) && t!.group !== grp;
}

export function canVoteMatch(teamSlug: string, m: MatchView): boolean {
  return teamSlug !== m.home && teamSlug !== m.away;
}
