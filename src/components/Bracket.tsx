"use client";

import { useSession } from "@/lib/storage";
import {
  useVoting,
  canVoteMatch,
  type MatchView,
  type Round,
} from "@/lib/voting";
import { teamFlag, teamName } from "@/lib/scoring";

function Column({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-w-[260px]">
      <p className="text-[10px] uppercase tracking-wide2 text-wine mb-6">
        {title}
      </p>
      <div className="flex flex-col justify-around gap-8 h-full">{children}</div>
    </div>
  );
}

function SlotRow({
  slug,
  label,
  votes,
  isWinner,
  canVote,
  myPick,
  onVote,
  gold,
}: {
  slug?: string;
  label: string;
  votes: number;
  isWinner: boolean;
  canVote: boolean;
  myPick: boolean;
  onVote: () => void;
  gold?: boolean;
}) {
  const has = !!slug;
  const winState = isWinner
    ? gold
      ? "bg-gold/15 text-wine"
      : "bg-advance/10 text-advance"
    : "text-ink/80";

  const inner = (
    <>
      <span className="flex items-center gap-3 min-w-0">
        <span className="text-xl leading-none">{has ? teamFlag(slug!) : "🏳️"}</span>
        <span className="truncate text-sm">{has ? teamName(slug!) : "TBD"}</span>
        {myPick && (
          <span className="text-[8px] uppercase tracking-cinematic text-wine border border-wine/40 rounded-full px-1.5 py-0.5">
            Your pick
          </span>
        )}
      </span>
      <span className="flex items-center gap-3 shrink-0">
        <span className="text-sm tabular-nums text-ink/60">{votes}</span>
        <span className="text-[9px] uppercase tracking-cinematic text-ink/35 w-7 text-right">
          {isWinner ? "ADV" : label}
        </span>
      </span>
    </>
  );

  const base =
    "flex items-center justify-between px-4 py-3 transition-colors w-full text-left";

  if (canVote && has) {
    return (
      <button
        onClick={onVote}
        className={`${base} ${winState} ${
          myPick ? "" : "hover:bg-ink/5"
        } cursor-pointer`}
      >
        {inner}
      </button>
    );
  }
  return <div className={`${base} ${winState}`}>{inner}</div>;
}

function Match({ m, gold }: { m: MatchView; gold?: boolean }) {
  const { session } = useSession();
  const { phases, castMatchVote, setOverride, clearOverride, voteFor } =
    useVoting();

  const isAdmin = session?.role === "admin";
  const myTeam = session?.role === "team" ? session.team : null;
  const phaseOpen = phases[m.round] === "open";
  const phaseClosed = phases[m.round] === "closed";

  const eligible =
    !!myTeam && phaseOpen && !!m.home && !!m.away && canVoteMatch(myTeam, m);
  const iAmIn = !!myTeam && (myTeam === m.home || myTeam === m.away);
  const myPick = myTeam ? voteFor(myTeam, m.round, m.matchId) : null;

  function vote(slug?: string) {
    if (!myTeam || !slug) return;
    castMatchVote(myTeam, m.round, m.matchId, slug);
  }

  // Admin needs to resolve when the round is closed (or tied) with no winner.
  const needsAdmin =
    isAdmin && !!m.home && !!m.away && !m.winner && (phaseClosed || m.tie);

  return (
    <div className="space-y-2">
      <div
        className={`bg-white ${
          gold ? "border border-gold" : "hairline"
        } divide-y divide-[rgba(55,32,52,0.14)]`}
      >
        <SlotRow
          slug={m.home}
          label={m.homeLabel}
          votes={m.homeVotes}
          isWinner={m.winner === m.home && !!m.home}
          canVote={eligible}
          myPick={!!myPick && myPick === m.home}
          onVote={() => vote(m.home)}
          gold={gold}
        />
        <SlotRow
          slug={m.away}
          label={m.awayLabel}
          votes={m.awayVotes}
          isWinner={m.winner === m.away && !!m.away}
          canVote={eligible}
          myPick={!!myPick && myPick === m.away}
          onVote={() => vote(m.away)}
          gold={gold}
        />
      </div>

      {/* contextual footer */}
      <div className="px-1 flex items-center justify-between gap-2 min-h-[16px]">
        <span className="text-[9px] uppercase tracking-cinematic text-ink/40">
          {iAmIn
            ? "You're in this match"
            : m.totalVotes > 0
            ? `${m.totalVotes} vote${m.totalVotes === 1 ? "" : "s"}`
            : phaseOpen
            ? "Awaiting votes"
            : ""}
        </span>
        {m.overridden && (
          <span className="text-[9px] uppercase tracking-cinematic text-wine">
            Admin pick
          </span>
        )}
        {m.tie && !m.overridden && (
          <span className="text-[9px] uppercase tracking-cinematic text-eliminate">
            Tied
          </span>
        )}
      </div>

      {/* admin tie-break / manual advance */}
      {needsAdmin && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-[9px] uppercase tracking-cinematic text-ink/50">
            Advance:
          </span>
          <button
            onClick={() => setOverride(m.round, m.matchId, m.home!)}
            className="text-[9px] uppercase tracking-cinematic px-2 py-1 hairline hover:border-wine hover:text-wine"
          >
            {teamName(m.home)}
          </button>
          <button
            onClick={() => setOverride(m.round, m.matchId, m.away!)}
            className="text-[9px] uppercase tracking-cinematic px-2 py-1 hairline hover:border-wine hover:text-wine"
          >
            {teamName(m.away)}
          </button>
        </div>
      )}
      {isAdmin && m.overridden && (
        <button
          onClick={() => clearOverride(m.round, m.matchId)}
          className="text-[9px] uppercase tracking-cinematic text-ink/40 hover:text-eliminate px-1"
        >
          Clear admin pick
        </button>
      )}
    </div>
  );
}

export default function Bracket() {
  const { matches, champion, configured, loading } = useVoting();

  if (!configured) {
    return (
      <div className="hairline bg-white px-6 py-16 text-center">
        <p className="text-ink/55 text-sm uppercase tracking-cinematic">
          Voting backend not configured
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-6 py-20 text-center text-ink/40 text-xs uppercase tracking-cinematic">
        Loading bracket…
      </div>
    );
  }

  const round = (r: Round) => matches[r];

  return (
    <div className="flex gap-6 md:gap-10 overflow-x-auto no-scrollbar pb-4">
      <Column title="Quarter-Finals">
        {round("qf").map((m) => (
          <Match key={m.matchId} m={m} />
        ))}
      </Column>

      <Column title="Semi-Finals">
        {round("sf").map((m) => (
          <Match key={m.matchId} m={m} />
        ))}
      </Column>

      <Column title="Final">
        <Match m={round("final")[0]} gold />
        {champion && (
          <div className="text-center pt-2">
            <p className="text-[10px] uppercase tracking-wide2 text-ink/50">
              Champion
            </p>
            <p className="heading text-2xl text-wine mt-2">
              {teamFlag(champion)} {teamName(champion)}
            </p>
          </div>
        )}
      </Column>
    </div>
  );
}
