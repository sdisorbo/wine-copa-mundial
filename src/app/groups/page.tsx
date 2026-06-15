import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import GroupTable from "@/components/GroupTable";
import ScoreEntry from "@/components/ScoreEntry";
import AdminGate from "@/components/AdminGate";
import { GROUPS } from "@/config/teams";

export const metadata: Metadata = {
  title: "Group Stage · Wine Copa Mundial",
};

const LEGEND = [
  { color: "bg-advance", label: "Advancing" },
  { color: "bg-gold", label: "Runner-up" },
  { color: "bg-wildcard", label: "Wildcard" },
  { color: "bg-eliminate", label: "Eliminated" },
];

export default function GroupsPage() {
  return (
    <>
      <PageHeader title="Group Stage" kicker="Three Groups · Twelve Nations" />

      {/* Legend */}
      <section className="px-6">
        <div className="max-w-page mx-auto flex flex-wrap gap-x-8 gap-y-3 pb-10">
          {LEGEND.map((l) => (
            <span key={l.label} className="flex items-center gap-2">
              <span className={`inline-block w-3 h-3 ${l.color}`} />
              <span className="text-[10px] uppercase tracking-cinematic text-ink/60">
                {l.label}
              </span>
            </span>
          ))}
        </div>
      </section>

      {/* Tables */}
      <section className="px-6 pb-16">
        <div className="max-w-page mx-auto grid gap-8 lg:grid-cols-3">
          {GROUPS.map((g) => (
            <GroupTable key={g} group={g} />
          ))}
        </div>
      </section>

      {/* Admin score entry */}
      <AdminGate>
        <section className="px-6 pb-24">
          <div className="max-w-2xl mx-auto">
            <ScoreEntry />
          </div>
        </section>
      </AdminGate>

      {/* Note */}
      <section className="px-6 pb-24">
        <div className="max-w-page mx-auto hairline-t pt-8">
          <p className="text-xs text-ink/60 tracking-wide max-w-2xl">
            Top two nations per group advance automatically. The two best
            third-place finishers across all groups claim the wildcard berths —
            completing the eight-team bracket.
          </p>
        </div>
      </section>
    </>
  );
}
