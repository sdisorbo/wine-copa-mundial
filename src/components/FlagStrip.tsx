import Link from "next/link";
import { TEAMS } from "@/config/teams";
import Flag from "@/components/Flag";

export default function FlagStrip() {
  return (
    <section className="hairline-t hairline-b py-10">
      <div className="max-w-page mx-auto px-6">
        <p className="text-[10px] uppercase tracking-wide2 text-ink/50 mb-6">
          The Field · 12 Nations
        </p>
        <div className="flex gap-10 overflow-x-auto no-scrollbar pb-2">
          {TEAMS.map((t) => (
            <Link
              key={t.slug}
              href={`/teams/${t.slug}`}
              className="flex flex-col items-center gap-3 shrink-0 group"
            >
              <Flag
                slug={t.slug}
                title={t.name}
                className="w-12 md:w-14 shadow-sm transition-transform group-hover:-translate-y-1"
              />
              <span className="text-[10px] uppercase tracking-cinematic text-ink/55 group-hover:text-wine whitespace-nowrap">
                {t.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
