import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Bracket from "@/components/Bracket";
import PhaseBanner from "@/components/PhaseBanner";
import RoundController from "@/components/RoundController";
import AdminVotingControls from "@/components/AdminVotingControls";

export const metadata: Metadata = {
  title: "Bracket · Wine Copa Mundial",
};

export default function BracketPage() {
  return (
    <>
      <PageHeader title="The Bracket" kicker="Eight Nations · Single Elimination" />

      <section className="px-6">
        <div className="max-w-page mx-auto pb-8">
          <RoundController />
        </div>
      </section>

      <section className="px-6">
        <div className="max-w-page mx-auto grid sm:grid-cols-3 gap-4 pb-10">
          <PhaseBanner phase="qf" />
          <PhaseBanner phase="sf" />
          <PhaseBanner phase="final" />
        </div>
      </section>

      <section className="px-6">
        <div className="max-w-page mx-auto">
          <Bracket />
        </div>
      </section>

      {/* Admin round control */}
      <section className="px-6 pt-12">
        <div className="max-w-3xl mx-auto">
          <AdminVotingControls phases={["qf", "sf", "final"]} />
        </div>
      </section>

      <section className="px-6 pt-12">
        <div className="max-w-page mx-auto hairline-t pt-8">
          <p className="text-xs text-ink/60 tracking-wide max-w-2xl">
            Seeding — A1 vs WC2 · B1 vs A2 · C1 vs B2 · WC1 vs C2. Each round, the
            admin opens voting; every team casts two votes in each matchup it is
            not playing in. Most votes advances; the admin breaks ties.
            Elimination rounds feature 2 new wines per match, tasted blind.
          </p>
        </div>
      </section>
    </>
  );
}
