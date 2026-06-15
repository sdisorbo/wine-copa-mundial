import Link from "next/link";

export default function Footer() {
  return (
    <footer className="hairline-t mt-24">
      <div className="max-w-page mx-auto px-6 py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="heading text-ink tracking-[0.3em]">
            WINE COPA MUNDIAL
          </div>
          <p className="text-xs text-ink/50 mt-2 tracking-wide">
            12 Nations. One Champion.
          </p>
        </div>
        <nav className="flex flex-wrap gap-6">
          {[
            { href: "/groups", label: "Groups" },
            { href: "/bracket", label: "Bracket" },
            { href: "/teams", label: "Teams" },
            { href: "/about", label: "About" },
            { href: "/login", label: "Login" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs uppercase tracking-cinematic text-ink/55 hover:text-wine transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="max-w-page mx-auto px-6 pb-8">
        <p className="text-[10px] uppercase tracking-cinematic text-ink/40">
          A blind tasting tournament · Est. 2026
        </p>
      </div>
    </footer>
  );
}
