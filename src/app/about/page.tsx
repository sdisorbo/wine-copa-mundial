import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "About · Wine Copa Mundial",
};

const SECTIONS = [
  {
    n: "01",
    title: "The Format",
    body: [
      "Twelve nations are drawn into three groups of four. Each nation is represented by a two-person team that selects and presents its bottles.",
      "Across the group stage, every wine is poured blind and ranked by the assembled guests. The two highest-scoring nations in each group advance automatically. The two best third-place finishers across all groups claim the wildcard berths — completing an eight-team bracket.",
    ],
  },
  {
    n: "02",
    title: "The Rules",
    body: [
      "Teams of two. A combined budget of one hundred dollars. Three wines for the group stage — chosen, concealed, and poured without labels.",
      "Nothing is revealed until the room has ranked. No vintages whispered, no regions hinted. The wine speaks, or it does not.",
    ],
  },
  {
    n: "03",
    title: "The Scoring",
    body: [
      "Each guest ranks the wines in their group. A first-place vote is worth three points, a second-place vote two, a third-place vote one. Points are summed across every ballot.",
      "Top two per group advance, plus the two best third-place wildcards — an eight-team single-elimination bracket. Each elimination round features two new wines per match, tasted blind, winner advances.",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About the Copa" kicker="The Competition" />

      {SECTIONS.map((s, i) => (
        <section
          key={s.n}
          className={`hairline-t ${i % 2 === 1 ? "bg-black" : ""}`}
        >
          <div className="max-w-page mx-auto px-6 py-20 grid md:grid-cols-[200px_1fr] gap-10 md:gap-20 items-start">
            <div className="heading text-7xl md:text-8xl text-gold/30 leading-none">
              {s.n}
            </div>
            <div>
              <h2 className="heading text-2xl md:text-4xl text-bone mb-8">
                {s.title}
              </h2>
              <div className="space-y-5 text-bone/70 text-lg max-w-2xl">
                {s.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Scoring quick-reference */}
      <section className="hairline-t">
        <div className="max-w-page mx-auto px-6 py-20">
          <p className="text-xs uppercase tracking-wide2 text-gold/80 mb-10">
            Points at a glance
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[rgba(255,255,255,0.15)] hairline">
            {[
              { pts: "3", label: "First-place vote" },
              { pts: "2", label: "Second-place vote" },
              { pts: "1", label: "Third-place vote" },
            ].map((r) => (
              <div key={r.pts} className="bg-ink p-10 text-center">
                <div className="heading text-6xl text-gold">{r.pts}</div>
                <div className="text-xs uppercase tracking-cinematic text-bone/50 mt-4">
                  {r.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
