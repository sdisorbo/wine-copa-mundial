"use client";

import { useSession } from "@/lib/storage";
import { useVoting, type Phase, type PhaseStatus } from "@/lib/voting";

const PHASE_LABELS: Record<Phase, string> = {
  group: "Group Stage",
  qf: "Quarter-Finals",
  sf: "Semi-Finals",
  final: "Final",
};

const STATUS_STYLE: Record<PhaseStatus, string> = {
  pending: "text-ink/45",
  open: "text-advance",
  closed: "text-wine",
};

const STATUS_LABEL: Record<PhaseStatus, string> = {
  pending: "Not started",
  open: "Voting open",
  closed: "Closed / locked",
};

// Each bracket round may open only after the previous phase has closed.
const PREREQ: Record<Phase, Phase | null> = {
  group: null,
  qf: "group",
  sf: "qf",
  final: "sf",
};

export default function AdminVotingControls({ phases }: { phases: Phase[] }) {
  const { session } = useSession();
  const { phases: state, setPhase, resetPhase, resetAll, configured } =
    useVoting();

  if (session?.role !== "admin") return null;
  if (!configured) return null;

  function open(phase: Phase) {
    setPhase(phase, "open");
  }
  function close(phase: Phase) {
    setPhase(phase, "closed");
  }
  function reset(phase: Phase) {
    if (
      window.confirm(
        `Reset ${PHASE_LABELS[phase]}? This deletes all of its votes and cannot be undone.`
      )
    ) {
      resetPhase(phase);
    }
  }
  function nuke() {
    if (
      window.confirm(
        "Reset the ENTIRE tournament? All ballots, votes, and results are deleted."
      )
    ) {
      resetAll();
    }
  }

  return (
    <div className="hairline bg-white">
      <div className="px-6 py-5 hairline-b flex items-center justify-between">
        <span className="heading text-ink">Voting Control</span>
        <span className="text-[10px] uppercase tracking-cinematic text-wine">
          Admin
        </span>
      </div>

      <div className="divide-y divide-[rgba(55,32,52,0.14)]">
        {phases.map((phase) => {
          const status = state[phase];
          const prereq = PREREQ[phase];
          const locked = prereq ? state[prereq] !== "closed" : false;

          return (
            <div
              key={phase}
              className="px-6 py-4 flex flex-wrap items-center gap-x-6 gap-y-3 justify-between"
            >
              <div>
                <div className="text-sm text-ink">{PHASE_LABELS[phase]}</div>
                <div
                  className={`text-[10px] uppercase tracking-cinematic ${STATUS_STYLE[status]}`}
                >
                  {STATUS_LABEL[status]}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {locked ? (
                  <span className="text-[10px] uppercase tracking-cinematic text-ink/40">
                    Close {PHASE_LABELS[prereq!]} first
                  </span>
                ) : (
                  <>
                    {status !== "open" && (
                      <button
                        onClick={() => open(phase)}
                        className="text-[10px] uppercase tracking-cinematic px-4 py-2 hairline hover:border-advance hover:text-advance transition-colors"
                      >
                        {status === "closed" ? "Reopen" : "Open voting"}
                      </button>
                    )}
                    {status === "open" && (
                      <button
                        onClick={() => close(phase)}
                        className="text-[10px] uppercase tracking-cinematic px-4 py-2 hairline hover:border-wine hover:text-wine transition-colors"
                      >
                        Close voting
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={() => reset(phase)}
                  className="text-[10px] uppercase tracking-cinematic px-4 py-2 text-eliminate/70 hover:text-eliminate transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-6 py-4 hairline-t flex justify-end">
        <button
          onClick={nuke}
          className="text-[10px] uppercase tracking-cinematic px-4 py-2 hairline border-eliminate/40 text-eliminate hover:bg-eliminate/5 transition-colors"
        >
          Reset entire tournament
        </button>
      </div>
    </div>
  );
}
