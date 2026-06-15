"use client";

import { useEffect, useState } from "react";
import type { Group } from "@/config/teams";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Role = "team" | "admin";

export interface Session {
  team: string; // slug, or "" for admin
  role: Role;
}

export interface Wine {
  name: string;
  producer: string;
  vintage: string;
  price: number;
}

export type WineSet = [Wine, Wine, Wine];

// Ordered ranking of team slugs given by a single guest, best first.
export type GuestRanking = string[];

export type GroupScores = {
  [G in Group]?: Record<string, GuestRanking>;
};

export interface BracketState {
  qf: (string | null)[]; // 4 winners
  sf: (string | null)[]; // 2 winners
  final: string | null;
}

/* ------------------------------------------------------------------ */
/* Keys                                                                */
/* ------------------------------------------------------------------ */

export const KEYS = {
  session: "wcm_session",
  scoresGroup: "wcm_scores_group",
  bracket: "wcm_bracket",
  wines: (slug: string) => `wcm_wines_${slug}`,
};

const CHANGE_EVENT = "wcm-storage";

/* ------------------------------------------------------------------ */
/* Low-level helpers                                                   */
/* ------------------------------------------------------------------ */

export function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key } }));
  } catch {
    /* quota or serialization error — ignore */
  }
}

export function removeKey(key: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { key } }));
}

export const emptyWine = (): Wine => ({
  name: "",
  producer: "",
  vintage: "",
  price: 0,
});

export const emptyWineSet = (): WineSet => [
  emptyWine(),
  emptyWine(),
  emptyWine(),
];

/* ------------------------------------------------------------------ */
/* React hooks                                                         */
/* ------------------------------------------------------------------ */

/**
 * Reactive read of a localStorage-backed JSON value. Re-reads when the value
 * changes in this tab (via writeJSON) or another tab (storage event).
 * Returns `mounted` so callers can avoid hydration mismatches.
 */
export function useStored<T>(key: string, fallback: T): {
  value: T;
  mounted: boolean;
} {
  const [value, setValue] = useState<T>(fallback);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setValue(readJSON<T>(key, fallback));
    setMounted(true);

    const reread = (e: Event) => {
      const detailKey = (e as CustomEvent)?.detail?.key as string | undefined;
      if (detailKey && detailKey !== key) return;
      setValue(readJSON<T>(key, fallback));
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === key) setValue(readJSON<T>(key, fallback));
    };

    window.addEventListener(CHANGE_EVENT, reread as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, reread as EventListener);
      window.removeEventListener("storage", onStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { value, mounted };
}

/* ------------------------------------------------------------------ */
/* Typed accessors                                                     */
/* ------------------------------------------------------------------ */

export function useSession() {
  const { value, mounted } = useStored<Session | null>(KEYS.session, null);
  return { session: value, mounted };
}

export function setSession(session: Session) {
  writeJSON(KEYS.session, session);
}

export function clearSession() {
  removeKey(KEYS.session);
}

export function useWines(slug: string) {
  return useStored<WineSet>(KEYS.wines(slug), emptyWineSet());
}

export function setWines(slug: string, wines: WineSet) {
  writeJSON(KEYS.wines(slug), wines);
}

export function getWines(slug: string): WineSet {
  return readJSON<WineSet>(KEYS.wines(slug), emptyWineSet());
}

export function useGroupScores() {
  return useStored<GroupScores>(KEYS.scoresGroup, {});
}

export function setGroupScores(scores: GroupScores) {
  writeJSON(KEYS.scoresGroup, scores);
}

const emptyBracket = (): BracketState => ({
  qf: [null, null, null, null],
  sf: [null, null],
  final: null,
});

export function useBracket() {
  return useStored<BracketState>(KEYS.bracket, emptyBracket());
}

export function setBracket(bracket: BracketState) {
  writeJSON(KEYS.bracket, bracket);
}
