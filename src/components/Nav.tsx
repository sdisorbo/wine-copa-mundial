"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, clearSession } from "@/lib/storage";
import { getTeam } from "@/config/teams";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/groups", label: "Groups" },
  { href: "/bracket", label: "Bracket" },
  { href: "/teams", label: "Teams" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { session, mounted } = useSession();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const team = session?.role === "team" ? getTeam(session.team) : undefined;
  const loggedIn = mounted && !!session;

  function handleLogout() {
    clearSession();
    router.push("/");
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-ink hairline-light-b">

      <div className="max-w-page mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="heading text-bone text-lg tracking-[0.3em] font-normal"
        >
          WCM
        </Link>

        {/* Center links — desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-xs uppercase tracking-cinematic transition-colors ${
                  active ? "text-goldlt" : "text-bone/70 hover:text-bone"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right — auth */}
        <div className="hidden md:flex items-center gap-4">
          {loggedIn ? (
            <>
              <span className="text-xs uppercase tracking-cinematic text-goldlt">
                {session?.role === "admin"
                  ? "Admin"
                  : team
                  ? `${team.flag} ${team.name}`
                  : "Team"}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs uppercase tracking-cinematic text-bone/70 hover:text-bone border-0"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-xs uppercase tracking-cinematic px-5 py-2 text-bone/85 hairline-light hover:border-goldlt hover:text-goldlt transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen((o) => !o)}
        >
          <span
            className={`block h-px w-6 bg-bone transition-transform ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-bone transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-bone transition-transform ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden bg-ink hairline-light-t px-6 py-6 flex flex-col gap-5">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm uppercase tracking-cinematic text-bone/80"
            >
              {l.label}
            </Link>
          ))}
          <div className="gold-rule-bright my-2" />
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="text-left text-sm uppercase tracking-cinematic text-goldlt"
            >
              Logout
              {session?.role === "admin"
                ? " (Admin)"
                : team
                ? ` (${team.name})`
                : ""}
            </button>
          ) : (
            <Link
              href="/login"
              className="text-sm uppercase tracking-cinematic text-goldlt"
            >
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
