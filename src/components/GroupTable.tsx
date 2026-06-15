"use client";

import { useVoting } from "@/lib/voting";
import { type Standing } from "@/lib/scoring";
import { GROUP_NAMES, type Group } from "@/config/teams";
import Flag from "@/components/Flag";

function rowAccent(position: number, isWildcard: boolean): string {
  switch (position) {
    case 1:
      return "border-l-2 border-advance";
    case 2:
      return "border-l-2 border-gold";
    case 3:
      return isWildcard ? "border-l-2 border-wildcard" : "border-l-2 border-ink/15";
    case 4:
      return "border-l-2 border-eliminate";
    default:
      return "border-l-2 border-transparent";
  }
}

function statusLabel(position: number, isWildcard: boolean): string {
  if (position === 1 || position === 2) return "Advancing";
  if (position === 3 && isWildcard) return "Wildcard";
  if (position === 3) return "Bubble";
  return "Eliminated";
}

function statusColor(position: number, isWildcard: boolean): string {
  if (position === 1 || position === 2) return "text-advance";
  if (position === 3 && isWildcard) return "text-wildcard";
  if (position === 3) return "text-ink/45";
  return "text-eliminate";
}

export default function GroupTable({ group }: { group: Group }) {
  const { standings: all, wildcards: wc, groupHasData, configured } = useVoting();
  const standings = all.byGroup[group];
  const hasData = configured && groupHasData(group);

  return (
    <div className="hairline bg-white">
      {/* Header */}
      <div className="px-5 py-4 hairline-b flex items-baseline justify-between">
        <div>
          <span className="heading text-wine text-lg">Group {group}</span>
          <span className="ml-3 text-xs uppercase tracking-cinematic text-ink/50">
            {GROUP_NAMES[group]}
          </span>
        </div>
      </div>

      {/* Column heads */}
      <div className="grid grid-cols-[1fr_2.5rem_2.5rem_2.5rem_2.5rem] gap-1 px-5 py-3 text-[10px] uppercase tracking-cinematic text-ink/50 hairline-b">
        <span>Nation</span>
        <span className="text-right">Pts</span>
        <span className="text-right">1st</span>
        <span className="text-right">2nd</span>
        <span className="text-right">3rd</span>
      </div>

      {/* Rows */}
      <div>
        {standings.map((s: Standing) => {
          const isWC = wc.has(s.slug);
          return (
            <div
              key={s.slug}
              className={`grid grid-cols-[1fr_2.5rem_2.5rem_2.5rem_2.5rem] gap-1 items-center px-5 py-4 hairline-b last:border-b-0 pl-4 ${rowAccent(
                s.position,
                isWC
              )}`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <Flag slug={s.slug} title={s.team.name} className="w-7 shrink-0" />
                  <span className="truncate text-sm text-ink">
                    {s.team.name}
                  </span>
                </div>
                <span
                  className={`block text-[9px] uppercase tracking-cinematic mt-1 ${statusColor(
                    s.position,
                    isWC
                  )}`}
                >
                  {hasData ? statusLabel(s.position, isWC) : "Awaiting"}
                </span>
              </div>
              <span className="text-right text-base text-wine tabular-nums">
                {hasData ? s.points : "—"}
              </span>
              <span className="text-right text-sm text-ink/70 tabular-nums">
                {hasData ? s.firstVotes : "—"}
              </span>
              <span className="text-right text-sm text-ink/70 tabular-nums">
                {hasData ? s.secondVotes : "—"}
              </span>
              <span className="text-right text-sm text-ink/70 tabular-nums">
                {hasData ? s.thirdVotes : "—"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer ballots count */}
      <div className="px-5 py-3 hairline-t text-[10px] uppercase tracking-cinematic text-ink/45">
        {hasData
          ? `${standings[0]?.ballots ?? 0} ballot${
              (standings[0]?.ballots ?? 0) === 1 ? "" : "s"
            } counted`
          : "No ballots yet"}
      </div>
    </div>
  );
}
