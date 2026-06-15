"use client";

import { useVoting, type Phase } from "@/lib/voting";

const LABELS: Record<Phase, string> = {
  group: "Group stage voting",
  qf: "Quarter-final voting",
  sf: "Semi-final voting",
  final: "Final voting",
};

export default function PhaseBanner({ phase }: { phase: Phase }) {
  const { phases, configured, error } = useVoting();

  if (!configured) {
    return (
      <div className="hairline bg-white px-5 py-3 flex items-center gap-3">
        <span className="inline-block w-2 h-2 rounded-full bg-ink/30" />
        <span className="text-[11px] uppercase tracking-cinematic text-ink/55">
          Voting backend not configured
        </span>
      </div>
    );
  }

  const status = phases[phase];
  const dot =
    status === "open"
      ? "bg-advance"
      : status === "closed"
      ? "bg-wine"
      : "bg-ink/30";
  const text =
    status === "open"
      ? "Open — cast your ballots"
      : status === "closed"
      ? "Closed — results locked"
      : "Not yet open";

  return (
    <div className="hairline bg-white px-5 py-3 flex items-center gap-3">
      <span className={`inline-block w-2 h-2 rounded-full ${dot}`} />
      <span className="text-[11px] uppercase tracking-cinematic text-ink/70">
        {LABELS[phase]}: <span className="text-ink">{text}</span>
      </span>
      {error && (
        <span className="text-[10px] text-eliminate ml-auto">{error}</span>
      )}
    </div>
  );
}
