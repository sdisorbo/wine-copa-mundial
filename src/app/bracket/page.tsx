import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Bracket from "@/components/Bracket";

export const metadata: Metadata = {
  title: "Bracket · Wine Copa Mundial",
};

export default function BracketPage() {
  return (
    <>
      <PageHeader title="The Bracket" kicker="Eight Nations · Single Elimination" />

      <section className="px-6">
        <div className="max-w-page mx-auto">
          <Bracket />
        </div>
      </section>

      <section className="px-6 pt-16">
        <div className="max-w-page mx-auto hairline-t pt-8">
          <p className="text-xs text-ink/60 tracking-wide max-w-2xl">
            Seeding — A1 vs WC2 · B1 vs A2 · C1 vs B2 · WC1 vs C2. Elimination
            rounds feature 2 new wines per match, tasted blind.
          </p>
        </div>
      </section>
    </>
  );
}
