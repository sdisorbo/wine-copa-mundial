"use client";

import { useMemo, useState } from "react";
import {
  useGroupScores,
  setGroupScores,
  type GroupScores,
} from "@/lib/storage";
import { GROUPS, GROUP_NAMES, teamsInGroup, type Group } from "@/config/teams";

export default function ScoreEntry() {
  const { value: scores } = useGroupScores();
  const [group, setGroup] = useState<Group>("A");
  const [guest, setGuest] = useState("");
  // position map: slug -> position string ("1".."4") or ""
  const [ranks, setRanks] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const teams = useMemo(() => teamsInGroup(group), [group]);
  const ballots = scores[group] ?? {};
  const ballotNames = Object.keys(ballots);

  function resetForm() {
    setGuest("");
    setRanks({});
    setError("");
  }

  function addBallot() {
    setError("");
    const name = guest.trim();
    if (!name) {
      setError("Enter a guest name.");
      return;
    }
    if (ballots[name]) {
      setError("A ballot already exists for that guest in this group.");
      return;
    }
    const positions = teams.map((t) => ranks[t.slug]);
    if (positions.some((p) => !p)) {
      setError("Assign a rank to every nation.");
      return;
    }
    const unique = new Set(positions);
    if (unique.size !== teams.length) {
      setError("Each rank (1–4) must be used exactly once.");
      return;
    }
    // Build ordered ranking, best (1) first.
    const ordered = [...teams]
      .sort((a, b) => Number(ranks[a.slug]) - Number(ranks[b.slug]))
      .map((t) => t.slug);

    const next: GroupScores = {
      ...scores,
      [group]: { ...ballots, [name]: ordered },
    };
    setGroupScores(next);
    resetForm();
  }

  function removeBallot(name: string) {
    const groupBallots = { ...(scores[group] ?? {}) };
    delete groupBallots[name];
    const next: GroupScores = { ...scores, [group]: groupBallots };
    setGroupScores(next);
  }

  return (
    <div className="hairline">
      <div className="px-6 py-5 hairline-b flex items-center justify-between">
        <span className="heading text-bone">Score Entry</span>
        <span className="text-[10px] uppercase tracking-cinematic text-wine">
          Admin
        </span>
      </div>

      {/* Group tabs */}
      <div className="flex hairline-b">
        {GROUPS.map((g) => (
          <button
            key={g}
            onClick={() => {
              setGroup(g);
              resetForm();
            }}
            className={`flex-1 py-3 text-xs uppercase tracking-cinematic transition-colors ${
              g === group
                ? "text-gold bg-inkdeep"
                : "text-bone/40 hover:text-bone"
            }`}
          >
            Group {g}
          </button>
        ))}
      </div>

      <div className="p-6 space-y-8">
        <p className="text-[11px] uppercase tracking-cinematic text-bone/40">
          {GROUP_NAMES[group]}
        </p>

        {/* New ballot form */}
        <div className="space-y-5">
          <div>
            <label className="block text-[10px] uppercase tracking-cinematic text-bone/50 mb-2">
              Guest name
            </label>
            <input
              value={guest}
              onChange={(e) => setGuest(e.target.value)}
              placeholder="e.g. Table 4 — Dana"
              className="w-full bg-transparent hairline px-4 py-3 text-sm text-bone placeholder:text-bone/25 focus:outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-2">
            <span className="block text-[10px] uppercase tracking-cinematic text-bone/50">
              Rank the wines (1 = favorite)
            </span>
            {teams.map((t) => (
              <div
                key={t.slug}
                className="flex items-center justify-between hairline px-4 py-3"
              >
                <span className="flex items-center gap-3 text-sm text-bone">
                  <span className="text-xl">{t.flag}</span>
                  {t.name}
                </span>
                <select
                  value={ranks[t.slug] ?? ""}
                  onChange={(e) =>
                    setRanks((r) => ({ ...r, [t.slug]: e.target.value }))
                  }
                  className="bg-ink hairline px-3 py-2 text-sm text-bone focus:outline-none focus:border-gold"
                >
                  <option value="">—</option>
                  {teams.map((_, i) => (
                    <option key={i} value={String(i + 1)}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {error && (
            <p className="text-xs text-eliminate tracking-wide">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={addBallot}
              className="text-xs uppercase tracking-cinematic px-6 py-3 hairline hover:border-gold hover:text-gold transition-colors"
            >
              Add Ballot
            </button>
            <button
              onClick={resetForm}
              className="text-xs uppercase tracking-cinematic px-6 py-3 text-bone/40 hover:text-bone transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Existing ballots */}
        <div>
          <span className="block text-[10px] uppercase tracking-cinematic text-bone/50 mb-3">
            Ballots in Group {group} · {ballotNames.length}
          </span>
          {ballotNames.length === 0 ? (
            <p className="text-xs text-bone/30">No ballots recorded yet.</p>
          ) : (
            <ul className="space-y-px">
              {ballotNames.map((name) => (
                <li
                  key={name}
                  className="flex items-center justify-between hairline px-4 py-3"
                >
                  <span className="text-sm text-bone min-w-0 truncate">
                    {name}
                    <span className="text-bone/40 ml-3">
                      {ballots[name]
                        .map((slug) => teams.find((t) => t.slug === slug)?.flag)
                        .join(" ")}
                    </span>
                  </span>
                  <button
                    onClick={() => removeBallot(name)}
                    className="text-[10px] uppercase tracking-cinematic text-eliminate/70 hover:text-eliminate shrink-0"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
