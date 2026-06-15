import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import GroupTable from "@/components/GroupTable";
import GroupVoting from "@/components/GroupVoting";
import AdminVotingControls from "@/components/AdminVotingControls";
import PhaseBanner from "@/components/PhaseBanner";
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

      {/* Status + legend */}
      <section className="px-6">
        <div className="max-w-page mx-auto space-y-6 pb-10">
          <PhaseBanner phase="group" />
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {LEGEND.map((l) => (
              <span key={l.label} className="flex items-center gap-2">
                <span className={`inline-block w-3 h-3 ${l.color}`} />
                <span className="text-[10px] uppercase tracking-cinematic text-ink/60">
                  {l.label}
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Live leaderboards */}
      <section className="px-6 pb-16">
        <div className="max-w-page mx-auto grid gap-8 lg:grid-cols-3">
          {GROUPS.map((g) => (
            <GroupTable key={g} group={g} />
          ))}
        </div>
      </section>

      {/* Team ballot entry (when group voting is open) */}
      <section className="px-6 pb-12">
        <div className="max-w-3xl mx-auto">
          <GroupVoting />
        </div>
      </section>

      {/* Admin voting control */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <AdminVotingControls phases={["group"]} />
        </div>
      </section>

      {/* Note */}
      <section className="px-6 pb-24">
        <div className="max-w-page mx-auto hairline-t pt-8">
          <p className="text-xs text-ink/60 tracking-wide max-w-2xl">
            Every team casts two ballots in each group but its own. Top two
            nations per group advance automatically; the two best third-place
            finishers across all groups claim the wildcard berths. When the admin
            closes group voting, the bracket is set.
          </p>
        </div>
      </section>
    </>
  );
}
