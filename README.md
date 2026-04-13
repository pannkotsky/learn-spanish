# Learn Spanish

App for browsing Spanish **verbs** with conjugation tables and a **conjugation quiz**.

## Tech stack

This repo uses:

- **TanStack Start** (file-based routes, generated `src/routeTree.gen.ts`)
- **Apollo Server** and **Apollo Client** (with `@apollo/client-integration-tanstack-start` for the router)
- **PostgreSQL** via **Drizzle ORM**
- **Better Auth** for authentication
- **Tailwind CSS** v4 and **daisyUI** v5 for styling (`src/styles.css`)

For router/Start/plugin details, use **`AGENTS.md`** (Intent skill paths) and the  docs.

## Running the app locally

- Install dependencies

```bash
pnpm install
```

- Set up a Postgres database

- Copy **`.env.example`** → **`.env.local`** (never commit secrets)

- Set **`DATABASE_URL`** for Postgres in `.env.local`

- Generate **`BETTER_AUTH_SECRET`** and add it to `.env.local`:

```bash
pnpm dlx @better-auth/cli secret
```

- Run database migrations

```bash
pnpm db:migrate
```

- Seed base database data

```bash
pnpm db:seed
```

- Run dev server

```bash
pnpm dev
```

The app is now available at **http://localhost:3000**

## Main scripts

```bash
pnpm build        # production build
pnpm ts           # TypeScript
pnpm test         # Vitest
pnpm format       # Biome
pnpm db:generate  # Generate database migrations after changing DB schema
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
