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

- **Team login** → redirected to its profile; edits its own 3 wines and casts
  ballots/votes during the live phases.
- **Admin login** → redirected to `/groups`; opens and closes each voting phase,
  breaks bracket ties, and can reset a phase or the whole tournament.

### Live voting (Supabase)

Voting happens across everyone's phones in real time, backed by a small Supabase
database. The admin drives the flow with open/close controls:

1. **Group stage** — admin opens group voting. Every team casts **two ballots**
   (its two members) ranking the wines in each group **except its own**. The
   `/groups` leaderboard updates live. When the admin **closes** group voting,
   the standings lock and the 8-team bracket is set.
2. **Bracket rounds** — for each round (QF → SF → Final) the admin opens voting;
   every team casts **one vote per matchup it is not playing in**. Most votes
   advances; **the admin breaks ties** (or sets a winner if a round closes with
   no votes). Closing a round seeds the next.
3. **Reset** — the admin can reset a single phase or the entire tournament.

Scoring (group stage): a 1st-place rank = 3 pts, 2nd = 2, 3rd = 1. Top two per
group advance, plus the two best third-place wildcards. Bracket seeding:
**A1 v WC2 · B1 v A2 · C1 v B2 · WC1 v C2**.

#### Supabase setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In the project's **SQL Editor**, paste and run
   [`supabase/schema.sql`](supabase/schema.sql) (creates the tables + open RLS
   policies; safe to re-run).
3. Copy **Project Settings → API** → the Project URL and the `anon` public key.
4. Locally: `cp .env.local.example .env.local` and fill both values.
5. On Vercel: add the same two vars under **Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Without these the app still builds and runs — the voting UI just shows
"Voting backend not configured."

> The anon key is meant to be public (it ships in the browser bundle). RLS is
> left fully open because this is a private, PIN-gated party app; tighten the
> policies in `schema.sql` if you ever expose the URL widely.

### Data

- **Supabase** (shared, live): voting phases, group ballots, matchup votes, and
  admin tie-break overrides.
- **localStorage** (per device): `wcm_session` (`{ team, role }`) and
  `wcm_wines_<slug>` (a team's three wines). Clearing browser storage logs you
  out and clears locally-entered wines, but does not touch tournament results.

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
