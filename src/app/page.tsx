import Link from "next/link";
import Image from "next/image";
import FlagStrip from "@/components/FlagStrip";
import { HERO_IMAGE, BREAK_IMAGE } from "@/config/images";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="San Fermín — the wine-soaked crowd of Pamplona"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {/* Darken layer (flat wine tint, no gradient) */}
        <div className="absolute inset-0 bg-ink/75" />

        <div className="relative z-10 text-center px-6">
          <p className="text-xs md:text-sm uppercase tracking-wide2 text-gold mb-8">
            Blind Tasting · World Cup
          </p>
          <h1 className="heading text-5xl sm:text-7xl md:text-8xl text-bone leading-[0.95]">
            Wine Copa
            <br />
            Mundial
          </h1>
          <div className="gold-rule w-40 mx-auto my-10" />
          <p className="text-base md:text-xl tracking-cinematic uppercase text-bone/70">
            12 Nations. One Champion.
          </p>
          <div className="mt-12">
            <Link
              href="/groups"
              className="inline-block text-xs uppercase tracking-wide2 px-10 py-4 hairline hover:border-gold hover:text-gold transition-colors"
            >
              Enter the Tournament
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-cinematic text-bone/30">
          Scroll
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="hairline-t">
        <div className="max-w-page mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 md:gap-20">
          <div>
            <p className="text-xs uppercase tracking-wide2 text-gold/80 mb-6">
              The Tournament
            </p>
            <h2 className="heading text-3xl md:text-5xl text-bone leading-tight">
              Twelve nations.
              <br />
              Thirty-six bottles.
              <br />
              One blind verdict.
            </h2>
          </div>
          <div className="flex flex-col justify-center gap-6 text-bone/70 text-lg font-light">
            <p>
              Two-person teams represent the great wine nations of the world.
              Each fields three bottles under a strict hundred-dollar budget,
              poured blind before an unsuspecting room.
            </p>
            <p>
              Guests rank what they taste — not what they read. Points crown the
              group winners, wildcards rescue the unlucky, and eight survivors
              advance to a single-elimination bracket decided two new wines at a
              time.
            </p>
            <Link
              href="/about"
              className="text-xs uppercase tracking-cinematic text-gold hover:text-bone transition-colors w-fit"
            >
              Read the format →
            </Link>
          </div>
        </div>
      </section>

      {/* FULL-WIDTH IMAGE BREAK */}
      <section className="px-0">
        <div className="relative w-full aspect-[21/9]">
          <Image
            src={BREAK_IMAGE}
            alt="Vineyard rows at the edge of the world"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/40" />
        </div>
      </section>

      {/* FLAG STRIP */}
      <FlagStrip />

      {/* CLOSING CTA */}
      <section className="px-6 py-28 text-center">
        <h2 className="heading text-3xl md:text-5xl text-bone">
          The cellar is set.
        </h2>
        <p className="mt-6 text-bone/60 max-w-xl mx-auto">
          Follow the group stage, track the bracket, and find out which nation
          pours the champion.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            href="/groups"
            className="text-xs uppercase tracking-wide2 px-8 py-4 hairline hover:border-gold hover:text-gold transition-colors"
          >
            View Groups
          </Link>
          <Link
            href="/bracket"
            className="text-xs uppercase tracking-wide2 px-8 py-4 hairline hover:border-gold hover:text-gold transition-colors"
          >
            View Bracket
          </Link>
        </div>
      </section>
    </>
  );
}
