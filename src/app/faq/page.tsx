import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "FAQ · Wine Copa Mundial",
};

const FAQS = [
  {
    q: "Do I need to be present for the whole event?",
    a: "Yes — otherwise please give up your position in the cup.",
  },
  {
    q: "How much to enter?",
    a: "$20 entry fee, plus the $50 max per person toward your wine budget.",
  },
  {
    q: "What to wear?",
    a: "Either country-specific garb, or vineyard attire.",
  },
  {
    q: "Spend limit?",
    a: "$100 per team.",
  },
  {
    q: "Date?",
    a: "TBD.",
  },
  {
    q: "Country and site login?",
    a: "This will be privately messaged to you and your teammate.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader title="FAQ" kicker="Before You Pour" />

      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto hairline bg-white">
          {FAQS.map((item, i) => (
            <div
              key={i}
              className="px-6 md:px-10 py-8 hairline-b last:border-b-0 grid md:grid-cols-[2.5rem_1fr] gap-4 md:gap-8"
            >
              <div className="heading text-2xl text-wine/30 leading-none">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <h2 className="heading text-lg md:text-xl text-ink">
                  {item.q}
                </h2>
                <p className="text-ink/70 text-base mt-3">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
