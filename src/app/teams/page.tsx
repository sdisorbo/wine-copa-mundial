import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { TEAMS, GROUP_NAMES } from "@/config/teams";
import { countryColor } from "@/config/colors";

export const metadata: Metadata = {
  title: "Teams · Wine Copa Mundial",
};

export default function TeamsPage() {
  return (
    <>
      <PageHeader title="The Nations" kicker="Twelve Teams" />

      <section className="px-6 pb-24">
        <div className="max-w-page mx-auto grid gap-px bg-[rgba(255,255,255,0.15)] hairline sm:grid-cols-2 lg:grid-cols-3">
          {TEAMS.map((t) => (
            <Link
              key={t.slug}
              href={`/teams/${t.slug}`}
              className="group relative bg-ink p-8 flex flex-col gap-6 hover:bg-black transition-colors"
              style={{ borderTop: `2px solid ${countryColor(t.slug)}` }}
            >
              <div className="flex items-start justify-between">
                <span className="text-6xl leading-none">{t.flag}</span>
                <span className="text-[10px] uppercase tracking-cinematic text-bone/40 border-hair hairline rounded-full px-3 py-1">
                  Group {t.group}
                </span>
              </div>
              <div>
                <h2 className="heading text-2xl text-bone group-hover:text-gold transition-colors">
                  {t.name}
                </h2>
                <p className="text-[10px] uppercase tracking-cinematic text-bone/40 mt-2">
                  {GROUP_NAMES[t.group]}
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-cinematic text-bone/30 group-hover:text-bone/60 mt-auto">
                View profile →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
