"use client";

import {
  useGroupScores,
  useBracket,
  useSession,
  setBracket,
  type BracketState,
} from "@/lib/storage";
import { quarterfinals, teamFlag, teamName } from "@/lib/scoring";

interface SlotData {
  slug: string | null;
  label: string;
}

function Slot({
  data,
  isWinner,
  canPick,
  onPick,
  gold,
}: {
  data: SlotData;
  isWinner: boolean;
  canPick: boolean;
  onPick: () => void;
  gold?: boolean;
}) {
  const has = !!data.slug;
  const base =
    "flex items-center justify-between px-4 py-3 transition-colors w-full text-left";
  const state = isWinner
    ? gold
      ? "bg-gold/10 text-gold"
      : "bg-advance/10 text-advance"
    : "text-bone/80";
  const interactive = canPick && has ? "hover:bg-white/5 cursor-pointer" : "";

  const inner = (
    <>
      <span className="flex items-center gap-3 min-w-0">
        <span className="text-xl leading-none">
          {has ? teamFlag(data.slug!) : "🏳️"}
        </span>
        <span className="truncate text-sm">
          {has ? teamName(data.slug!) : "TBD"}
        </span>
      </span>
      <span className="text-[9px] uppercase tracking-cinematic text-bone/30 shrink-0">
        {isWinner ? "ADV" : data.label}
      </span>
    </>
  );

  if (canPick && has) {
    return (
      <button onClick={onPick} className={`${base} ${state} ${interactive}`}>
        {inner}
      </button>
    );
  }
  return <div className={`${base} ${state}`}>{inner}</div>;
}

function Match({
  home,
  away,
  winner,
  canPick,
  onPick,
  gold,
}: {
  home: SlotData;
  away: SlotData;
  winner: string | null;
  canPick: boolean;
  onPick: (slug: string) => void;
  gold?: boolean;
}) {
  return (
    <div
      className={`${
        gold ? "border border-gold" : "hairline"
      } divide-y divide-[rgba(255,255,255,0.12)]`}
    >
      <Slot
        data={home}
        isWinner={!!winner && winner === home.slug}
        canPick={canPick}
        onPick={() => home.slug && onPick(home.slug)}
        gold={gold}
      />
      <Slot
        data={away}
        isWinner={!!winner && winner === away.slug}
        canPick={canPick}
        onPick={() => away.slug && onPick(away.slug)}
        gold={gold}
      />
    </div>
  );
}

function Column({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-w-[220px]">
      <p className="text-[10px] uppercase tracking-wide2 text-gold/70 mb-6">
        {title}
      </p>
      <div className="flex flex-col justify-around gap-8 h-full">{children}</div>
    </div>
  );
}

export default function Bracket() {
  const { value: scores } = useGroupScores();
  const { value: bracket, mounted } = useBracket();
  const { session } = useSession();
  const isAdmin = session?.role === "admin";

  const qf = quarterfinals(scores);

  // Quarter-final winners (validated against actual participants).
  const qfWinners = qf.map((m, i) => {
    const w = bracket.qf[i] ?? null;
    if (w && (w === m.home.slug || w === m.away.slug)) return w;
    return null;
  });

  // Semi-final pairings come from QF winners.
  const sfMatches: [SlotData, SlotData][] = [
    [
      { slug: qfWinners[0], label: "QF1" },
      { slug: qfWinners[1], label: "QF2" },
    ],
    [
      { slug: qfWinners[2], label: "QF3" },
      { slug: qfWinners[3], label: "QF4" },
    ],
  ];

  const sfWinners = sfMatches.map((m, i) => {
    const w = bracket.sf[i] ?? null;
    if (w && (w === m[0].slug || w === m[1].slug)) return w;
    return null;
  });

  const finalMatch: [SlotData, SlotData] = [
    { slug: sfWinners[0], label: "SF1" },
    { slug: sfWinners[1], label: "SF2" },
  ];

  const finalWinner =
    bracket.final &&
    (bracket.final === finalMatch[0].slug ||
      bracket.final === finalMatch[1].slug)
      ? bracket.final
      : null;

  function persist(next: BracketState) {
    setBracket(next);
  }

  function pickQF(i: number, slug: string) {
    const qfNext = [...bracket.qf];
    qfNext[i] = slug;
    persist({ ...bracket, qf: qfNext });
  }
  function pickSF(i: number, slug: string) {
    const sfNext = [...bracket.sf];
    sfNext[i] = slug;
    persist({ ...bracket, sf: sfNext });
  }
  function pickFinal(slug: string) {
    persist({ ...bracket, final: slug });
  }

  if (!mounted) {
    return (
      <div className="px-6 py-20 text-center text-bone/30 text-xs uppercase tracking-cinematic">
        Loading bracket…
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {isAdmin && (
        <p className="text-[10px] uppercase tracking-cinematic text-wine">
          Admin · tap a nation to advance it
        </p>
      )}

      <div className="flex gap-6 md:gap-10 overflow-x-auto no-scrollbar pb-4">
        {/* QUARTER-FINALS */}
        <Column title="Quarter-Finals">
          {qf.map((m, i) => (
            <Match
              key={m.id}
              home={{ slug: m.home.slug ?? null, label: m.home.label }}
              away={{ slug: m.away.slug ?? null, label: m.away.label }}
              winner={qfWinners[i]}
              canPick={isAdmin}
              onPick={(slug) => pickQF(i, slug)}
            />
          ))}
        </Column>

        {/* SEMI-FINALS */}
        <Column title="Semi-Finals">
          {sfMatches.map((m, i) => (
            <Match
              key={`sf${i}`}
              home={m[0]}
              away={m[1]}
              winner={sfWinners[i]}
              canPick={isAdmin}
              onPick={(slug) => pickSF(i, slug)}
            />
          ))}
        </Column>

        {/* FINAL */}
        <Column title="Final">
          <Match
            home={finalMatch[0]}
            away={finalMatch[1]}
            winner={finalWinner}
            canPick={isAdmin}
            onPick={pickFinal}
            gold
          />
          {finalWinner && (
            <div className="text-center pt-2">
              <p className="text-[10px] uppercase tracking-wide2 text-bone/40">
                Champion
              </p>
              <p className="heading text-2xl text-gold mt-2">
                {teamFlag(finalWinner)} {teamName(finalWinner)}
              </p>
            </div>
          )}
        </Column>
      </div>
    </div>
  );
}
