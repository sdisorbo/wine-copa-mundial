"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/lib/storage";
import { useVoting, canVoteGroup } from "@/lib/voting";
import {
  GROUPS,
  GROUP_NAMES,
  teamsInGroup,
  getTeam,
  type Group,
} from "@/config/teams";
import Flag from "@/components/Flag";

export default function GroupVoting() {
  const { session, mounted } = useSession();
  const { phases, configured } = useVoting();

  if (!configured || !mounted) return null;
  if (session?.role !== "team") return null;
  if (phases.group !== "open") return null;

  const me = getTeam(session.team);
  if (!me) return null;

  const votableGroups = GROUPS.filter((g) => canVoteGroup(session.team, g));

  return (
    <div className="hairline bg-white">
      <div className="px-6 py-5 hairline-b flex items-center justify-between">
        <span className="heading text-ink">Cast Your Ballots</span>
        <span className="text-[10px] uppercase tracking-cinematic text-advance">
          Voting open
        </span>
      </div>
      <div className="p-6 space-y-10">
        <p className="text-xs text-ink/60 max-w-2xl">
          Rank the wines in each group below — both of your team&apos;s two
          ballots count. You cannot vote in your own group ({me.group}). Save
          each ballot; you can revise it until the admin closes voting.
        </p>
        {votableGroups.map((g) => (
          <GroupBlock key={g} grp={g} teamSlug={session.team} />
        ))}
      </div>
    </div>
  );
}

function GroupBlock({ grp, teamSlug }: { grp: Group; teamSlug: string }) {
  return (
    <div className="space-y-5">
      <div>
        <span className="heading text-wine">Group {grp}</span>
        <span className="ml-3 text-xs uppercase tracking-cinematic text-ink/50">
          {GROUP_NAMES[grp]}
        </span>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <RankForm grp={grp} entry={1} teamSlug={teamSlug} />
        <RankForm grp={grp} entry={2} teamSlug={teamSlug} />
      </div>
    </div>
  );
}

function RankForm({
  grp,
  entry,
  teamSlug,
}: {
  grp: Group;
  entry: number;
  teamSlug: string;
}) {
  const { ballotFor, castGroupBallot } = useVoting();
  const teams = useMemo(() => teamsInGroup(grp), [grp]);
  const saved = ballotFor(teamSlug, grp, entry);

  // ranks: slug -> "1".."4"
  const [ranks, setRanks] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [msg, setMsg] = useState("");

  // Prefill from saved ballot when it loads/changes.
  useEffect(() => {
    if (saved && saved.length === teams.length) {
      const next: Record<string, string> = {};
      saved.forEach((slug, i) => (next[slug] = String(i + 1)));
      setRanks(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(saved)]);

  async function submit() {
    setMsg("");
    const positions = teams.map((t) => ranks[t.slug]);
    if (positions.some((p) => !p)) {
      setStatus("error");
      setMsg("Rank all four wines.");
      return;
    }
    if (new Set(positions).size !== teams.length) {
      setStatus("error");
      setMsg("Each rank 1–4 once.");
      return;
    }
    const ordered = [...teams]
      .sort((a, b) => Number(ranks[a.slug]) - Number(ranks[b.slug]))
      .map((t) => t.slug);
    try {
      setStatus("saving");
      await castGroupBallot(teamSlug, grp, entry, ordered);
      setStatus("saved");
    } catch (e) {
      setStatus("error");
      setMsg(e instanceof Error ? e.message : "Could not save.");
    }
  }

  return (
    <div className="hairline p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-cinematic text-ink/55">
          Ballot {entry}
        </span>
        {saved && (
          <span className="text-[9px] uppercase tracking-cinematic text-advance">
            Submitted
          </span>
        )}
      </div>
      {teams.map((t) => (
        <div
          key={t.slug}
          className="flex items-center justify-between hairline px-3 py-2"
        >
          <span className="flex items-center gap-2 text-sm text-ink">
            <Flag slug={t.slug} className="w-5" />
            {t.name}
          </span>
          <select
            value={ranks[t.slug] ?? ""}
            onChange={(e) => {
              setStatus("idle");
              setRanks((r) => ({ ...r, [t.slug]: e.target.value }));
            }}
            className="bg-white hairline px-2 py-1.5 text-sm text-ink focus:outline-none focus:border-wine"
          >
            <option value="">—</option>
            {teams.map((_, i) => (
              <option key={i} value={String(i + 1)}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      ))}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={submit}
          disabled={status === "saving"}
          className="text-[10px] uppercase tracking-cinematic px-4 py-2 hairline hover:border-wine hover:text-wine transition-colors disabled:opacity-50"
        >
          {saved ? "Update" : "Submit"} Ballot {entry}
        </button>
        {status === "saved" && (
          <span className="text-advance text-[10px] uppercase tracking-cinematic">
            Saved
          </span>
        )}
        {status === "error" && (
          <span className="text-eliminate text-[10px] tracking-wide">{msg}</span>
        )}
      </div>
    </div>
  );
}
