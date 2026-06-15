"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  useSession,
  useWines,
  useGroupScores,
  setWines,
  emptyWineSet,
  type Wine,
  type WineSet,
} from "@/lib/storage";
import { getTeam, GROUP_NAMES } from "@/config/teams";
import { countryColor } from "@/config/colors";
import { teamImage } from "@/config/images";
import { groupStandings, hasGroupData } from "@/lib/scoring";

const BUDGET = 100;

export default function TeamProfile({ slug }: { slug: string }) {
  const team = getTeam(slug);
  const { session, mounted } = useSession();
  const { value: wines } = useWines(slug);
  const { value: scores } = useGroupScores();

  if (!team) {
    return (
      <div className="px-6 py-40 text-center">
        <p className="text-ink/55 uppercase tracking-cinematic text-sm">
          Unknown nation.
        </p>
        <Link
          href="/teams"
          className="text-wine text-xs uppercase tracking-cinematic mt-6 inline-block"
        >
          ← Back to teams
        </Link>
      </div>
    );
  }

  const accent = countryColor(slug);
  const backdrop = teamImage(slug);
  const isAdmin = session?.role === "admin";
  const isOwner = session?.role === "team" && session.team === slug;
  const canSee = mounted && (isAdmin || isOwner);

  const spent = wines.reduce((sum, w) => sum + (Number(w.price) || 0), 0);
  const pct = Math.min(100, Math.round((spent / BUDGET) * 100));
  const over = spent > BUDGET;

  const standings = groupStandings(scores, team.group);
  const myStanding = standings.find((s) => s.slug === slug);
  const groupHasData = mounted && hasGroupData(scores, team.group);

  return (
    <div style={{ borderTop: `2px solid ${accent}` }}>
      {/* HERO */}
      <section className="relative px-6 pt-28 pb-16 overflow-hidden">
        {backdrop && (
          <>
            <div className="absolute inset-0">
              <Image
                src={backdrop}
                alt={`${team.name} wine country`}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-shade/65" />
          </>
        )}
        <div className="relative max-w-page mx-auto">
          <span className="text-7xl md:text-8xl leading-none block">
            {team.flag}
          </span>
          <h1 className="heading text-4xl md:text-6xl text-bone mt-8">
            {team.name}
          </h1>
          <div className="flex items-center gap-4 mt-6">
            <span
              className="text-[10px] uppercase tracking-cinematic rounded-full px-4 py-1.5"
              style={{ border: `1px solid ${accent}`, color: accent }}
            >
              Group {team.group}
            </span>
            <span className="text-[10px] uppercase tracking-cinematic text-bone/65">
              {GROUP_NAMES[team.group]}
            </span>
          </div>
          <div className="h-px w-24 mt-10" style={{ background: accent }} />
        </div>
      </section>

      {/* CONTENT GRID */}
      <section className="px-6 pb-24">
        <div className="max-w-page mx-auto grid lg:grid-cols-[1fr_320px] gap-12">
          {/* LEFT — wines */}
          <div>
            <p className="text-xs uppercase tracking-wide2 text-wine mb-8">
              Wine Lineup
            </p>

            {!canSee ? (
              <div className="hairline bg-white px-8 py-16 text-center">
                <p className="text-3xl mb-4">🔒</p>
                <p className="text-ink/55 uppercase tracking-cinematic text-sm">
                  Wines hidden until tasting
                </p>
                {mounted && !session && (
                  <Link
                    href="/login"
                    className="text-wine text-xs uppercase tracking-cinematic mt-6 inline-block hover:text-ink"
                  >
                    Team login →
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-px bg-[rgba(55,32,52,0.16)] hairline">
                {wines.map((w, i) => (
                  <div
                    key={i}
                    className="bg-white px-6 py-6 flex items-start justify-between gap-6"
                  >
                    <div className="flex items-start gap-5 min-w-0">
                      <span className="heading text-3xl text-ink/20 leading-none">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-ink text-lg">
                          {w.name || (
                            <span className="text-ink/35">Unnamed wine</span>
                          )}
                        </p>
                        <p className="text-ink/55 text-sm mt-1">
                          {[w.producer, w.vintage]
                            .filter(Boolean)
                            .join(" · ") || "Producer · Vintage"}
                        </p>
                      </div>
                    </div>
                    <span className="text-wine tabular-nums shrink-0">
                      {w.price ? `$${w.price}` : "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Edit form for owner */}
            {isOwner && <WineEditor slug={slug} initial={wines} />}
          </div>

          {/* RIGHT — budget + results */}
          <aside className="space-y-12">
            {/* Budget */}
            <div>
              <p className="text-xs uppercase tracking-wide2 text-wine mb-6">
                Budget
              </p>
              {canSee ? (
                <>
                  <div className="flex items-baseline justify-between mb-3">
                    <span
                      className={`text-2xl tabular-nums ${
                        over ? "text-eliminate" : "text-ink"
                      }`}
                    >
                      ${spent}
                    </span>
                    <span className="text-ink/50 text-sm">/ ${BUDGET}</span>
                  </div>
                  <div className="h-1 bg-ink/10 w-full">
                    <div
                      className={`h-full ${
                        over ? "bg-eliminate" : "bg-gold"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {over && (
                    <p className="text-eliminate text-[10px] uppercase tracking-cinematic mt-3">
                      Over budget
                    </p>
                  )}
                </>
              ) : (
                <p className="text-ink/45 text-sm">Hidden until tasting.</p>
              )}
            </div>

            {/* Group results */}
            <div>
              <p className="text-xs uppercase tracking-wide2 text-wine mb-6">
                Group Stage
              </p>
              {groupHasData && myStanding ? (
                <dl className="space-y-px bg-[rgba(55,32,52,0.16)] hairline">
                  {[
                    { k: "Position", v: `${myStanding.position} of 4` },
                    { k: "Points", v: myStanding.points },
                    { k: "1st-place votes", v: myStanding.firstVotes },
                    { k: "2nd-place votes", v: myStanding.secondVotes },
                    { k: "3rd-place votes", v: myStanding.thirdVotes },
                  ].map((row) => (
                    <div
                      key={row.k}
                      className="bg-white px-5 py-3 flex justify-between"
                    >
                      <dt className="text-[11px] uppercase tracking-cinematic text-ink/55">
                        {row.k}
                      </dt>
                      <dd className="text-ink tabular-nums">{row.v}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-ink/45 text-sm">
                  No group results recorded yet.
                </p>
              )}
              <Link
                href="/groups"
                className="text-wine text-[10px] uppercase tracking-cinematic mt-6 inline-block hover:text-ink"
              >
                View Group {team.group} →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Editable wine form (owner only)                                     */
/* ------------------------------------------------------------------ */

function WineEditor({ slug, initial }: { slug: string; initial: WineSet }) {
  const [draft, setDraft] = useState<WineSet>(initial);
  const [saved, setSaved] = useState(false);

  // Keep draft in sync if storage changes elsewhere.
  useEffect(() => {
    setDraft(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initial)]);

  function update(i: number, field: keyof Wine, raw: string) {
    setSaved(false);
    setDraft((prev) => {
      const next = [...prev] as WineSet;
      const wine = { ...next[i] };
      if (field === "price") {
        wine.price = raw === "" ? 0 : Math.max(0, Number(raw) || 0);
      } else {
        wine[field] = raw;
      }
      next[i] = wine;
      return next;
    });
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    setWines(slug, draft);
    setSaved(true);
  }

  function reset() {
    setDraft(emptyWineSet());
    setSaved(false);
  }

  const total = draft.reduce((s, w) => s + (Number(w.price) || 0), 0);

  return (
    <form onSubmit={save} className="mt-12 hairline bg-white p-6 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <span className="heading text-ink">Edit Wines</span>
        <span
          className={`text-xs tabular-nums ${
            total > 100 ? "text-eliminate" : "text-ink/55"
          }`}
        >
          ${total} / $100
        </span>
      </div>

      {draft.map((w, i) => (
        <div key={i} className="space-y-3">
          <p className="text-[10px] uppercase tracking-cinematic text-wine">
            Wine {i + 1}
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              value={w.name}
              onChange={(e) => update(i, "name", e.target.value)}
              placeholder="Wine name"
              className="bg-transparent hairline px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-wine"
            />
            <input
              value={w.producer}
              onChange={(e) => update(i, "producer", e.target.value)}
              placeholder="Producer"
              className="bg-transparent hairline px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-wine"
            />
            <input
              value={w.vintage}
              onChange={(e) => update(i, "vintage", e.target.value)}
              placeholder="Vintage"
              className="bg-transparent hairline px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-wine"
            />
            <input
              type="number"
              min={0}
              value={w.price === 0 ? "" : w.price}
              onChange={(e) => update(i, "price", e.target.value)}
              placeholder="Price ($)"
              className="bg-transparent hairline px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:border-wine"
            />
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="text-xs uppercase tracking-cinematic px-6 py-3 hairline hover:border-wine hover:text-wine transition-colors"
        >
          Save Lineup
        </button>
        <button
          type="button"
          onClick={reset}
          className="text-xs uppercase tracking-cinematic px-6 py-3 text-ink/45 hover:text-ink transition-colors"
        >
          Clear
        </button>
        {saved && (
          <span className="text-advance text-[10px] uppercase tracking-cinematic">
            Saved
          </span>
        )}
      </div>
    </form>
  );
}
