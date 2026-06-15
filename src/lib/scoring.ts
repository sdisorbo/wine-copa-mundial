import { GROUPS, teamsInGroup, getTeam, type Group, type Team } from "@/config/teams";
import type { GroupScores } from "@/lib/storage";

export interface Standing {
  slug: string;
  team: Team;
  points: number;
  firstVotes: number;
  secondVotes: number;
  thirdVotes: number;
  ballots: number; // how many guests ranked this group
  position: number; // 1-indexed final rank within group
}

const POINTS_FOR_RANK = [3, 2, 1]; // 1st, 2nd, 3rd. 4th and beyond = 0.

/** Whether any ballots have been recorded for a group. */
export function hasGroupData(scores: GroupScores, group: Group): boolean {
  const ballots = scores[group];
  return !!ballots && Object.keys(ballots).length > 0;
}

/** Compute sorted standings for a single group. */
export function groupStandings(scores: GroupScores, group: Group): Standing[] {
  const teams = teamsInGroup(group);
  const ballots = scores[group] ?? {};
  const ballotList = Object.values(ballots);

  const base = new Map<string, Standing>();
  for (const team of teams) {
    base.set(team.slug, {
      slug: team.slug,
      team,
      points: 0,
      firstVotes: 0,
      secondVotes: 0,
      thirdVotes: 0,
      ballots: ballotList.length,
      position: 0,
    });
  }

  for (const ranking of ballotList) {
    ranking.forEach((slug, idx) => {
      const s = base.get(slug);
      if (!s) return;
      s.points += POINTS_FOR_RANK[idx] ?? 0;
      if (idx === 0) s.firstVotes += 1;
      else if (idx === 1) s.secondVotes += 1;
      else if (idx === 2) s.thirdVotes += 1;
    });
  }

  const standings = Array.from(base.values()).sort(compareStandings);
  standings.forEach((s, i) => (s.position = i + 1));
  return standings;
}

function compareStandings(a: Standing, b: Standing): number {
  if (b.points !== a.points) return b.points - a.points;
  if (b.firstVotes !== a.firstVotes) return b.firstVotes - a.firstVotes;
  if (b.secondVotes !== a.secondVotes) return b.secondVotes - a.secondVotes;
  if (b.thirdVotes !== a.thirdVotes) return b.thirdVotes - a.thirdVotes;
  return a.team.name.localeCompare(b.team.name);
}

export interface Standings {
  byGroup: Record<Group, Standing[]>;
  /** Slug -> standing, for quick lookup. */
  bySlug: Map<string, Standing>;
}

export function allStandings(scores: GroupScores): Standings {
  const byGroup = {} as Record<Group, Standing[]>;
  const bySlug = new Map<string, Standing>();
  for (const g of GROUPS) {
    const s = groupStandings(scores, g);
    byGroup[g] = s;
    s.forEach((st) => bySlug.set(st.slug, st));
  }
  return { byGroup, bySlug };
}

export interface Qualifiers {
  // group winners and runners-up keyed by slot label
  A1?: string;
  A2?: string;
  B1?: string;
  B2?: string;
  C1?: string;
  C2?: string;
  WC1?: string;
  WC2?: string;
}

/**
 * Resolve the 8 bracket qualifiers from group standings.
 * Top 2 per group qualify directly; best two 3rd-place finishers are wildcards.
 * Returns undefined slots until enough data exists.
 */
export function qualifiers(scores: GroupScores): Qualifiers {
  const q: Qualifiers = {};
  const thirds: Standing[] = [];

  for (const g of GROUPS) {
    if (!hasGroupData(scores, g)) continue;
    const standings = groupStandings(scores, g);
    if (standings[0]) q[`${g}1` as "A1"] = standings[0].slug;
    if (standings[1]) q[`${g}2` as "A2"] = standings[1].slug;
    if (standings[2]) thirds.push(standings[2]);
  }

  thirds.sort(compareStandings);
  if (thirds[0]) q.WC1 = thirds[0].slug;
  if (thirds[1]) q.WC2 = thirds[1].slug;

  return q;
}

/** Is this third-place team currently in a wildcard slot? */
export function wildcardSlugs(scores: GroupScores): Set<string> {
  const q = qualifiers(scores);
  return new Set([q.WC1, q.WC2].filter(Boolean) as string[]);
}

export interface MatchSlot {
  slug?: string;
  label: string; // e.g. "A1", "WC2"
}

export interface Matchup {
  id: string;
  round: "QF" | "SF" | "F";
  home: MatchSlot;
  away: MatchSlot;
}

/** Quarter-final seeding per spec: A1 vs WC2, B1 vs A2, C1 vs B2, WC1 vs C2. */
export function quarterfinals(scores: GroupScores): Matchup[] {
  const q = qualifiers(scores);
  const slot = (label: keyof Qualifiers): MatchSlot => ({
    slug: q[label],
    label,
  });
  return [
    { id: "qf1", round: "QF", home: slot("A1"), away: slot("WC2") },
    { id: "qf2", round: "QF", home: slot("B1"), away: slot("A2") },
    { id: "qf3", round: "QF", home: slot("C1"), away: slot("B2") },
    { id: "qf4", round: "QF", home: slot("WC1"), away: slot("C2") },
  ];
}

export function teamName(slug?: string): string {
  if (!slug) return "TBD";
  return getTeam(slug)?.name ?? "TBD";
}

export function teamFlag(slug?: string): string {
  if (!slug) return "🏳️";
  return getTeam(slug)?.flag ?? "🏳️";
}
