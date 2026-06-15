"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { TEAMS, ADMIN_PIN, getTeam } from "@/config/teams";
import { countryColor } from "@/config/colors";
import Flag from "@/components/Flag";
import { setSession } from "@/lib/storage";

const ADMIN_VALUE = "__admin__";

export default function LoginPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const team = useMemo(
    () => (selected && selected !== ADMIN_VALUE ? getTeam(selected) : undefined),
    [selected]
  );
  const accent = team ? countryColor(team.slug) : "#e9c46a";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!selected) {
      setError("Choose a team or admin.");
      return;
    }

    if (selected === ADMIN_VALUE) {
      if (pin !== ADMIN_PIN) {
        setError("Incorrect admin PIN.");
        return;
      }
      setSession({ team: "", role: "admin" });
      router.push("/groups");
      return;
    }

    const t = getTeam(selected);
    if (!t) {
      setError("Unknown team.");
      return;
    }
    if (pin !== t.pin) {
      setError("Incorrect PIN.");
      return;
    }
    setSession({ team: t.slug, role: "team" });
    router.push(`/teams/${t.slug}`);
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div
        className="w-full max-w-md hairline bg-white p-8 md:p-12"
        style={{ borderTop: `2px solid ${accent}` }}
      >
        <p className="text-xs uppercase tracking-wide2 text-wine mb-4 flex items-center gap-2">
          {team ? (
            <>
              <Flag slug={team.slug} className="w-5" />
              {team.name}
            </>
          ) : (
            "Restricted Access"
          )}
        </p>
        <h1 className="heading text-3xl md:text-4xl text-ink">Team Login</h1>
        <div className="h-px w-16 mt-6 mb-10" style={{ background: accent }} />

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-cinematic text-ink/55 mb-2">
              Identity
            </label>
            <select
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value);
                setError("");
              }}
              className="w-full bg-white hairline px-4 py-3 text-sm text-ink focus:outline-none focus:border-wine"
            >
              <option value="">Select team…</option>
              {TEAMS.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name} — Group {t.group}
                </option>
              ))}
              <option value={ADMIN_VALUE}>★ Tournament Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-cinematic text-ink/55 mb-2">
              PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              autoComplete="off"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError("");
              }}
              placeholder="••••"
              className="w-full bg-transparent hairline px-4 py-3 text-sm text-ink tracking-[0.4em] placeholder:tracking-normal placeholder:text-ink/30 focus:outline-none focus:border-wine"
            />
          </div>

          {error && (
            <p className="text-xs text-eliminate tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            className="w-full text-xs uppercase tracking-wide2 py-4 hairline hover:border-wine hover:text-wine transition-colors"
          >
            Enter
          </button>
        </form>

        <p className="text-[10px] uppercase tracking-cinematic text-ink/45 mt-8 leading-relaxed">
          Teams see only their own lineup. Admin manages scores and the bracket.
        </p>
      </div>
    </section>
  );
}
