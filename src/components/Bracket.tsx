"use client";

import { useSession } from "@/lib/storage";
import {
  useVoting,
  canVoteMatch,
  type MatchView,
  type Round,
} from "@/lib/voting";
import { teamName } from "@/lib/scoring";
import Flag from "@/components/Flag";

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
  gold,
}: {
  slug?: string;
  label: string;
  votes: number;
  isWinner: boolean;
  gold?: boolean;
}) {
  const has = !!slug;
  const winState = isWinner
    ? gold
      ? "bg-gold/15 text-wine"
      : "bg-advance/10 text-advance"
    : "text-ink/80";

  return (
    <div
      className={`flex items-center justify-between px-4 py-3 ${winState}`}
    >
      <span className="flex items-center gap-3 min-w-0">
        {has ? (
          <Flag slug={slug!} className="w-6 shrink-0" />
        ) : (
          <span className="text-base leading-none">🏳️</span>
        )}
        <span className="truncate text-sm">{has ? teamName(slug!) : "TBD"}</span>
      </span>
      <span className="flex items-center gap-3 shrink-0">
        <span className="text-sm tabular-nums text-ink/60">{votes}</span>
        <span className="text-[9px] uppercase tracking-cinematic text-ink/35 w-7 text-right">
          {isWinner ? "ADV" : label}
        </span>
      </span>
    </div>
  );
}

// Two ballots per matchup (a team's two members), shown when eligible.
function VoteBox({ m, myTeam }: { m: MatchView; myTeam: string }) {
  const { castMatchVote, voteFor } = useVoting();
  const choices = [m.home as string, m.away as string];

  return (
    <div className="hairline px-3 py-3 space-y-2">
      <span className="block text-[9px] uppercase tracking-cinematic text-ink/50">
        Your two votes
      </span>
      {[1, 2].map((entry) => {
        const pick = voteFor(myTeam, m.round, m.matchId, entry);
        return (
          <div key={entry} className="flex items-center gap-2">
            <span className="text-[9px] uppercase tracking-cinematic text-ink/45 w-12 shrink-0">
              Ballot {entry}
            </span>
            {choices.map((slug) => {
              const active = pick === slug;
              return (
                <button
                  key={slug}
                  onClick={() =>
                    castMatchVote(myTeam, m.round, m.matchId, entry, slug)
                  }
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] transition-colors ${
                    active
                      ? "bg-advance/10 text-advance border border-advance/40"
                      : "hairline hover:bg-ink/5"
                  }`}
                >
                  <Flag slug={slug} className="w-4 shrink-0" />
                  <span className="truncate">{teamName(slug)}</span>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function Match({ m, gold }: { m: MatchView; gold?: boolean }) {
  const { session } = useSession();
  const { phases, setOverride, clearOverride } = useVoting();

  const isAdmin = session?.role === "admin";
  const myTeam = session?.role === "team" ? session.team : null;
  const phaseOpen = phases[m.round] === "open";
  const phaseClosed = phases[m.round] === "closed";

  const eligible =
    !!myTeam && phaseOpen && !!m.home && !!m.away && canVoteMatch(myTeam, m);
  const iAmIn = !!myTeam && (myTeam === m.home || myTeam === m.away);

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
          gold={gold}
        />
        <SlotRow
          slug={m.away}
          label={m.awayLabel}
          votes={m.awayVotes}
          isWinner={m.winner === m.away && !!m.away}
          gold={gold}
        />
      </div>

      {eligible && myTeam && <VoteBox m={m} myTeam={myTeam} />}

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
            <p className="heading text-2xl text-wine mt-2 flex items-center justify-center gap-2">
              <Flag slug={champion} className="w-8" />
              {teamName(champion)}
            </p>
          </div>
        )}
      </Column>
    </div>
  );
}
