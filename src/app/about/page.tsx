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
      "Across the group stage, every wine is poured, tasted, and ranked by the room. The two highest-scoring nations in each group advance automatically. The two best third-place finishers across all groups claim the wildcard berths — completing an eight-team bracket.",
    ],
  },
  {
    n: "02",
    title: "The Rules",
    body: [
      "Teams of two. A combined budget of one hundred dollars. Three wines for the group stage, poured openly for everyone to taste, talk over, and judge.",
      "Every team votes in each group but its own, and in each knockout matchup it isn't playing in — two ballots per team, every round.",
    ],
  },
  {
    n: "03",
    title: "The Scoring",
    body: [
      "Each ballot ranks the wines in a group. A first-place vote is worth three points, a second-place vote two, a third-place vote one. Points are summed across every ballot.",
      "Top two per group advance, plus the two best third-place wildcards — an eight-team single-elimination bracket. Each knockout round features two new wines per match, and the winner advances.",
    ],
  },
  {
    n: "04",
    title: "The Prize",
    body: [
      "The champion nation lifts the Copa Mundial Trophy and takes home a $180 cash prize. The runner-up claims $60, and third place earns $20.",
      "Silverware, bragging rights, and a wallet that comes home heavier than it left.",
    ],
  },
];

const PRIZES = [
  { place: "Champion", amount: "$180", note: "+ Copa Mundial Trophy 🏆" },
  { place: "Runner-up", amount: "$60", note: "Second place" },
  { place: "Third", amount: "$20", note: "Third place" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About the Copa" kicker="The Competition" />

      {SECTIONS.map((s, i) => (
        <section
          key={s.n}
          className={`hairline-t ${i % 2 === 1 ? "bg-paper2" : ""}`}
        >
          <div className="max-w-page mx-auto px-6 py-20 grid md:grid-cols-[200px_1fr] gap-10 md:gap-20 items-start">
            <div className="heading text-7xl md:text-8xl text-wine/30 leading-none">
              {s.n}
            </div>
            <div>
              <h2 className="heading text-2xl md:text-4xl text-ink mb-8">
                {s.title}
              </h2>
              <div className="space-y-5 text-ink/75 text-lg max-w-2xl">
                {s.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Prize pool */}
      <section className="hairline-t">
        <div className="max-w-page mx-auto px-6 py-20">
          <p className="text-xs uppercase tracking-wide2 text-wine mb-10">
            Prize pool
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[rgba(55,32,52,0.16)] hairline">
            {PRIZES.map((p) => (
              <div key={p.place} className="bg-paper2 p-10 text-center">
                <div className="text-[10px] uppercase tracking-cinematic text-ink/55 mb-3">
                  {p.place}
                </div>
                <div className="heading text-5xl text-wine">{p.amount}</div>
                <div className="text-[11px] uppercase tracking-cinematic text-ink/55 mt-4">
                  {p.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scoring quick-reference */}
      <section className="hairline-t">
        <div className="max-w-page mx-auto px-6 py-20">
          <p className="text-xs uppercase tracking-wide2 text-wine mb-10">
            Points at a glance
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[rgba(55,32,52,0.16)] hairline">
            {[
              { pts: "3", label: "First-place vote" },
              { pts: "2", label: "Second-place vote" },
              { pts: "1", label: "Third-place vote" },
            ].map((r) => (
              <div key={r.pts} className="bg-paper2 p-10 text-center">
                <div className="heading text-6xl text-wine">{r.pts}</div>
                <div className="text-xs uppercase tracking-cinematic text-ink/55 mt-4">
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
