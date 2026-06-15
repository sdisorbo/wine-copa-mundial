import Link from "next/link";
import { TEAMS } from "@/config/teams";

export default function FlagStrip() {
  return (
    <section className="hairline-t hairline-b py-10">
      <div className="max-w-page mx-auto px-6">
        <p className="text-[10px] uppercase tracking-wide2 text-bone/40 mb-6">
          The Field · 12 Nations
        </p>
        <div className="flex gap-10 overflow-x-auto no-scrollbar pb-2">
          {TEAMS.map((t) => (
            <Link
              key={t.slug}
              href={`/teams/${t.slug}`}
              className="flex flex-col items-center gap-3 shrink-0 group"
            >
              <span className="text-4xl md:text-5xl leading-none grayscale-0 transition-transform group-hover:-translate-y-1">
                {t.flag}
              </span>
              <span className="text-[10px] uppercase tracking-cinematic text-bone/50 group-hover:text-gold whitespace-nowrap">
                {t.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
