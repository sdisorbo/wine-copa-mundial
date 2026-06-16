"use client";

import { useSession } from "@/lib/storage";
import { useVoting, type Phase } from "@/lib/voting";
import { teamName } from "@/lib/scoring";
import Flag from "@/components/Flag";

const ORDER: Phase[] = ["group", "qf", "sf", "final"];

const LABEL: Record<Phase, string> = {
  group: "Group Stage",
  qf: "Quarter-Finals",
  sf: "Semi-Finals",
  final: "Final",
};

// Short labels for the compact stepper.
const SHORT: Record<Phase, string> = {
  group: "Groups",
  qf: "QF",
  sf: "SF",
  final: "Final",
};

type Action =
  | { kind: "begin"; stage: Phase }
  | { kind: "close"; stage: Phase }
  | { kind: "done" };

function nextAction(phases: Record<Phase, string>): Action {
  for (const s of ORDER) {
    if (phases[s] === "open") return { kind: "close", stage: s };
    if (phases[s] === "pending") return { kind: "begin", stage: s };
  }
  return { kind: "done" };
}

export default function RoundController() {
  const { session } = useSession();
  const { phases, setPhase, configured, champion } = useVoting();

  if (!configured) return null;

  const isAdmin = session?.role === "admin";
  const action = nextAction(phases);

  return (
    <div className="hairline bg-white">
      {/* Stepper — visible to everyone */}
      <div className="px-6 py-5 flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
        {ORDER.map((s, i) => {
          const status = phases[s];
          const isActive = status === "open";
          const isDone = status === "closed";
          const dot = isActive
            ? "bg-advance"
            : isDone
            ? "bg-wine"
            : "bg-ink/20";
          const text = isActive
            ? "text-ink"
            : isDone
            ? "text-ink/70"
            : "text-ink/35";
          return (
            <div key={s} className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${dot}`} />
                <span
                  className={`text-[11px] uppercase tracking-cinematic ${text}`}
                >
                  {SHORT[s]}
                  {isActive && (
                    <span className="text-advance"> · live</span>
                  )}
                  {isDone && <span className="text-wine"> · done</span>}
                </span>
              </div>
              {i < ORDER.length - 1 && (
                <span className="w-5 sm:w-8 h-px bg-ink/15" />
              )}
            </div>
          );
        })}
      </div>

      {/* Admin guided next step */}
      {isAdmin && (
        <div className="px-6 py-5 hairline-t flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-cinematic text-wine mb-1">
              Admin · Next step
            </p>
            <p className="text-sm text-ink">
              {action.kind === "begin" &&
                `${LABEL[action.stage]} hasn't started.`}
              {action.kind === "close" &&
                `${LABEL[action.stage]} voting is open.`}
              {action.kind === "done" &&
                (champion ? (
                  <span className="flex items-center gap-2">
                    Champion crowned:
                    <Flag slug={champion} className="w-5" />
                    <span className="text-wine">{teamName(champion)}</span>
                  </span>
                ) : (
                  "All stages closed."
                ))}
            </p>
          </div>

          {action.kind === "begin" && (
            <button
              onClick={() => setPhase(action.stage, "open")}
              className="text-xs uppercase tracking-wide2 px-6 py-3 hairline hover:border-advance hover:text-advance transition-colors"
            >
              Begin {LABEL[action.stage]}
            </button>
          )}
          {action.kind === "close" && (
            <button
              onClick={() => setPhase(action.stage, "closed")}
              className="text-xs uppercase tracking-wide2 px-6 py-3 hairline hover:border-wine hover:text-wine transition-colors"
            >
              Close {LABEL[action.stage]}
            </button>
          )}
          {action.kind === "done" && (
            <span className="text-[10px] uppercase tracking-cinematic text-ink/40">
              Tournament complete
            </span>
          )}
        </div>
      )}
    </div>
  );
}
