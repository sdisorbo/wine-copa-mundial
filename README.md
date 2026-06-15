# Wine Copa Mundial 🍷🏆

**12 Nations. One Champion.** A blind-tasting world cup of wine — a single static
Next.js app with no backend. All tournament state (logins, wine lineups, group
scores, bracket results) lives in the browser's `localStorage`.

Built to feel like a fusion of SpaceX's cinematic minimalism and the FIFA World
Cup's tournament-structure clarity: full-bleed black, razor-thin hairlines,
uppercase Inter headings, and bold status colors (teal = advancing, gold =
runner-up, purple = wildcard, red = eliminated).

---

## Tech stack

- **Next.js 14** (App Router) · **TypeScript** (strict) · **Tailwind CSS**
- No database, no API routes, no server state — pure static + client-side
- Deploys cleanly to **Vercel**

## Pages

| Route             | Purpose                                                        |
| ----------------- | ------------------------------------------------------------- |
| `/`               | Cinematic home — hero, format teaser, flag strip              |
| `/about`          | The Format · The Rules · The Scoring                          |
| `/groups`         | Three group tables (admin can enter ballots here)             |
| `/bracket`        | QF → SF → Final ladder (admin advances winners)               |
| `/teams`          | Directory of all 12 nations                                   |
| `/teams/[slug]`   | Team profile — wine lineup, budget, group results, edit form  |
| `/login`          | Team / admin PIN login                                        |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (must pass with zero errors)
```

> Requires Node 18.17+ (Next.js 14). This project is developed against Node 20.

## How it works

### Logins & PINs

Teams and the admin authenticate with 4-digit PINs hardcoded in
[`src/config/teams.ts`](src/config/teams.ts). **Change every PIN (and
`ADMIN_PIN`) before the event.** A login writes `wcm_session` to `localStorage`.

- **Team login** → redirected to its profile; can edit its own 3 wines and sees
  its own lineup.
- **Admin login** → redirected to `/groups`; can record guest ballots and
  advance bracket winners.

### Scoring

Each guest ranks the wines in a group. A 1st-place vote = 3 pts, 2nd = 2 pts,
3rd = 1 pt. Top two per group advance automatically; the two best third-place
finishers across all groups take the wildcard berths, forming the 8-team
bracket. Seeding: **A1 v WC2 · B1 v A2 · C1 v B2 · WC1 v C2**.

### Data (localStorage keys)

- `wcm_session` — `{ team, role }`
- `wcm_wines_<slug>` — that team's three wines
- `wcm_scores_group` — guest ballots per group
- `wcm_bracket` — recorded round winners

Clearing browser storage resets the tournament.

## Images

Image slots render as `#111` placeholders. Drop real files into
[`public/images/`](public/images/) and swap the `src` in the relevant page /
the `Placeholder` component (see comments in
[`src/components/Placeholder.tsx`](src/components/Placeholder.tsx)).

## Deploy (Vercel)

Push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new).
`vercel.json` already pins the Next.js framework preset — no extra config needed.

---

_A blind tasting tournament · Est. 2026_
