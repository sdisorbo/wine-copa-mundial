import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import { TEAMS, GROUP_NAMES } from "@/config/teams";
import { countryColor } from "@/config/colors";
import { teamImage } from "@/config/images";

export const metadata: Metadata = {
  title: "Teams · Wine Copa Mundial",
};

export default function TeamsPage() {
  return (
    <>
      <PageHeader title="The Nations" kicker="Twelve Teams" />

      <section className="px-6 pb-24">
        <div className="max-w-page mx-auto grid gap-px bg-[rgba(255,255,255,0.15)] hairline sm:grid-cols-2 lg:grid-cols-3">
          {TEAMS.map((t) => {
            const img = teamImage(t.slug);
            return (
            <Link
              key={t.slug}
              href={`/teams/${t.slug}`}
              className="group relative bg-ink p-8 flex flex-col gap-6 hover:bg-inkdeep transition-colors overflow-hidden"
              style={{ borderTop: `2px solid ${countryColor(t.slug)}` }}
            >
              {img && (
                <>
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-shade/55 group-hover:bg-shade/45 transition-colors" />
                </>
              )}
              <div className="relative flex items-start justify-between">
                <span className="text-6xl leading-none drop-shadow">{t.flag}</span>
                <span className="text-[10px] uppercase tracking-cinematic text-bone/80 hairline-light rounded-full px-3 py-1">
                  Group {t.group}
                </span>
              </div>
              <div className="relative">
                <h2 className="heading text-2xl text-bone group-hover:text-goldlt transition-colors">
                  {t.name}
                </h2>
                <p className="text-[10px] uppercase tracking-cinematic text-bone/65 mt-2">
                  {GROUP_NAMES[t.group]}
                </p>
              </div>
              <span className="relative text-[10px] uppercase tracking-cinematic text-bone/55 group-hover:text-bone/90 mt-auto">
                View profile →
              </span>
            </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
