# Learn Spanish

TanStack Start app for browsing Spanish **verb lemmas** with conjugation tables and a **conjugation quiz** (`/verbs`, `/verbs/quiz`). Data comes from **PostgreSQL** via **Drizzle** and a small **GraphQL** API (`/api/graphql`).

## Getting started

```bash
pnpm install
pnpm dev
```

Dev server: **http://localhost:3000** (see `package.json`).

## Build and checks

```bash
pnpm build      # production build
pnpm ts         # TypeScript (no emit)
pnpm test       # Vitest
pnpm format     # Biome (write)
pnpm format:check
```

## Environment and database

- Copy **`.env.example`** → **`.env.local`** (never commit secrets).
- Set **`DATABASE_URL`** for Postgres (Drizzle + optional Better Auth persistence).

```bash
pnpm db:push              # apply schema from src/db/schema.ts (dev)
# or
pnpm db:generate && pnpm db:migrate
```

Seed verb lemmas and conjugation rows (after DB is up):

```bash
pnpm db:seed
```

## GraphQL

- **Schema:** `src/graphql/schema.graphql`
- **Operations:** `src/graphql/documents/*.graphql`
- **Codegen:** after changing schema or documents, run:

```bash
pnpm codegen
```

Generated types and document nodes: `src/graphql/__generated__/graphql.ts`.

## App routes (high level)

| Path | Purpose |
|------|---------|
| `/` | Home |
| `/verbs` | Search and paginate verbs; configurable **tenses** (paradigms) in URL search |
| `/verbs/quiz` | Random-verb conjugation quiz; reuses tense selection; preserves `/verbs` search when linked |
| `/login`, `/signup` | Auth screens |
| `/api/graphql` | GraphQL POST endpoint |
| `/api/auth/*` | Better Auth |

## Styling

**Tailwind CSS** v4 and **daisyUI** v5 (`src/styles.css`).

## Better Auth

1. Generate **`BETTER_AUTH_SECRET`** and add it to `.env.local`:

   ```bash
   pnpm dlx @better-auth/cli secret
   ```

2. See [Better Auth docs](https://www.better-auth.com) for providers, database-backed sessions, etc.

Optional DB wiring example is in the scaffold comments; this README keeps only the secret step here.

## TanStack stack

This repo uses **TanStack Start**, **TanStack Router** (file-based routes, generated `src/routeTree.gen.ts`), and **TanStack Query** in router context. For router/Start/plugin details, use **`AGENTS.md`** (Intent skill paths) and the [TanStack Start](https://tanstack.com/start) docs.
