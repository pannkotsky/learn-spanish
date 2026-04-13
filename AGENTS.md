# learn-spanish — agent context

## Scaffold command (authoritative)

The project was created with **TanStack CLI** (`@tanstack/cli@0.63.1` at scaffold time). The user-requested flag `--agent` is **not supported** in this CLI version (unknown option). Non-interactive scaffolding used:

```bash
npx @tanstack/cli@latest create learn-spanish \
  -y --non-interactive \
  --package-manager pnpm \
  --no-examples \
  --add-ons tanstack-query,better-auth,drizzle \
  --git
```

**Blank template:** Passing `--template blank` failed with: *no template registry is configured* (`CTA_REGISTRY` / template URL not set). The scaffold therefore used the CLI default with **`includeExamples: false`** (see `.cta.json`). This is the closest equivalent to a “blank” app for this CLI version without wiring a template registry.

**Target directory:** Files live in this repo root (`learn-spanish`), not a nested folder.

## Stack and integrations

| Area | Choice |
|------|--------|
| Framework | **TanStack Start** + **React** 19 |
| Routing | TanStack Router (file-based, generated route tree) |
| Styling | **Tailwind CSS** v4 (`@tailwindcss/vite`) + **daisyUI** v5 (`@plugin "daisyui"` in `src/styles.css`; themes `light` / `dark` + system) |
| Data fetching | **Apollo Client** (`@apollo/client`) for GraphQL UI; **`@apollo/client-integration-tanstack-start`** for router SSR integration (`src/router.tsx`, `src/routes/__root.tsx`) |
| API | **GraphQL** — schema `src/graphql/schema.graphql`, handler `src/routes/api/graphql.ts`, documents `src/graphql/documents/`, codegen `pnpm codegen` → `src/graphql/__generated__/graphql.ts` |
| Database | **Local PostgreSQL** via `DATABASE_URL` + Drizzle (`drizzle-orm/node-postgres`) |
| ORM | **Drizzle** + `drizzle-kit` (`db:*` scripts in `package.json`) |
| Auth | **Better Auth** (`src/lib/auth.ts`, `src/lib/auth-client.ts`, API route under `src/routes/api/auth/`) |
| Build | **Vite** 8, **TypeScript** |

## Package manager

Use **pnpm** (`packageManager` / lockfile). If `pnpm` is missing locally: `corepack enable && corepack prepare pnpm@latest --activate`.

## TanStack Intent

Installed workflow: run from repo root when adding or changing TanStack architecture:

```bash
npx @tanstack/intent@latest install   # prints setup guidance (re-run if needed)
npx @tanstack/intent@latest list      # lists skills and resolved paths (pnpm-aware)
```

Before changing router/Start/server-fn patterns, **load the relevant skill** from `list` output instead of guessing.

<!-- intent-skills:start -->
# Skill mappings — when working in these areas, load the linked skill into context first.

skills:
  - task: "TanStack Start + React (createStart, useServerFn, isomorphic vs server-only)"
    load: "node_modules/@tanstack/react-start/skills/react-start/SKILL.md"
  - task: "TanStack Router Vite plugin, route generation, code splitting, plugin order"
    load: "node_modules/@tanstack/router-plugin/skills/router-plugin/SKILL.md"
  - task: "@tanstack/devtools-vite (must stay first in Vite plugins; Tailwind + Start ordering)"
    load: "node_modules/@tanstack/devtools-vite/skills/devtools-vite-plugin/SKILL.md"
  - task: "Environment variables and .env handling"
    load: "node_modules/dotenv/skills/dotenv/SKILL.md"
  # To load start-core: npx @tanstack/intent@latest list | grep start-core
  - task: "TanStack Start core — Vite tanstackStart plugin, server functions, middleware, execution model, deployment"
  # To load router-core: npx @tanstack/intent@latest list | grep router-core
  - task: "TanStack Router — route tree, loaders, auth guards, navigation, SSR, search params"
  # To load start-server-core: npx @tanstack/intent@latest list | grep start-server-core
  - task: "TanStack Start server runtime (handlers, cookies, request context)"
  # To load devtools-app-setup: npx @tanstack/intent@latest list | grep devtools-app-setup
  - task: "TanStack Devtools shell and plugins in the React app"
<!-- intent-skills:end -->

## Environment variables

See `.env.example` and `.env.local` (local only; never commit secrets).

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Local (or any) Postgres URL for Drizzle and optional Better Auth persistence |

**Better Auth:** README instructs generating `BETTER_AUTH_SECRET` (e.g. `pnpm dlx @better-auth/cli secret`) and setting it in `.env.local`.

## Deployment notes

- Default scaffold uses **Vite** / TanStack Start; pick an explicit deployment adapter when moving to production (see Start docs and `start-core` **deployment** sub-skill via `intent list`).
- Configure production `DATABASE_URL` and auth secrets before shipping.

## Architectural decisions (from scaffold)

- **Router context** is typed for **Apollo** (`ApolloClientIntegration.RouterContext` in `src/routes/__root.tsx`).
- **Vite plugin order** (current): `devtools()` → `tailwindcss()` → `tanstackStart()` → `viteReact()`. Devtools skill requires devtools **first**; `tanstackStart()` wraps Start + router codegen — keep ordering aligned with shipped skills when editing.
- Auth API catch-all: `src/routes/api/auth/$.ts`.

## Verbs and quiz (app-specific)

- **`/verbs`** (`src/routes/verbs.tsx`): paginated verb list + conjugation matrix; URL search validated by `validateVerbsUrlSearch` in `src/lib/verbs-url-search.ts` (`search`, `ordering`, `page`, `paradigms`). Default tense subset: `DEFAULT_VERBS_URL_PARADIGMS` in `src/lib/verb-matrix.ts`. Spanish UI labels: `VERB_PARADIGM_LABELS_ES` / `formatParadigmTitle`.
- **`/verbs/quiz`** (`src/routes/verbs.quiz.tsx`): child route; parent **`VerbsShell`** in `verbs.tsx` renders `<Outlet />` when path is under `/verbs/quiz`. Quiz uses the same search validation and **`VerbParadigmsSelector`** (`src/components/VerbParadigmsSelector.tsx`). “Take a quiz” links with `search={url}` so **`paradigms`** (and other search fields) carry over.
- **GraphQL `WordsOrdering`:** includes **`RANDOM`** (see `src/graphql/verbs-query.ts` — `ORDER BY random()`). Quiz document **`VerbQuizRandomVerb`** (`src/graphql/documents/verb-quiz-random.graphql`) loads one random verb with **`forms(paradigms: [$paradigm])`** so only one tense column is fetched per request; person is chosen client-side (`src/lib/verb-quiz.ts`).
- **Verb matrix / enums:** `ALL_PARADIGMS` order and DB enum alignment are tested in `src/lib/verb-matrix.test.ts` / `verbs-url-search` tests.

## Known gotchas

1. **`--template blank` / `CTA_REGISTRY`:** Without a template registry URL, built-in template id `blank` cannot resolve; use `intent list` + docs or set registry if your org provides one.
2. **`@tanstack/devtools-vite` skill** documents Vite **^6 \|\| ^7** compatibility; project uses **Vite 8** — validate devtools behavior after Vite changes.
3. **pnpm skill paths:** Some skills only appear under `node_modules/.pnpm/...`; use `npx @tanstack/intent@latest list` for the exact path on disk.

## Next steps (human or agent)

1. Run Postgres locally, create a database, set `DATABASE_URL` in `.env.local`.
2. Run **`pnpm db:push`** (or migrations), then **`pnpm db:seed`** so verbs and `verb_forms` exist for `/verbs` and `/verbs/quiz`.
3. Set `BETTER_AUTH_SECRET` when you wire Better Auth to the database.
4. After edits to **`src/graphql/schema.graphql`** or **`src/graphql/documents/*.graphql`**, run **`pnpm codegen`**.
5. Extend auth (e.g. email verification, OAuth) and vocabulary routes as needed.
6. Re-run `npx @tanstack/intent@latest list` after dependency upgrades to refresh skill locations.
