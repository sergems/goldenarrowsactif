# Lamontville Golden Arrows FC

A world-class, fully responsive football club website for Lamontville Golden Arrows FC (Durban, KwaZulu-Natal, South Africa) competing in the PSL.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/golden-arrows run dev` — run the frontend (port 5173)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Framer Motion animations, Tailwind CSS v4, shadcn/ui
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Routing: Wouter

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks
- `lib/db/src/schema/` — Drizzle ORM DB schema (news, players, staff, fixtures, results, gallery, sponsors, league_table)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/golden-arrows/src/pages/` — React pages
- `artifacts/golden-arrows/src/components/` — UI components (layout + shadcn/ui)

## Club Colors & Theme

- **Golden Yellow**: `#FFD700` — CSS: `hsl(51 100% 50%)`
- **Forest Green**: `#1B5E20` — CSS: `hsl(125 55% 24%)`
- Dark background: `hsl(140 10% 4%)`
- Font: font-display used for headings throughout

## Pages

**Public:** `/` Home, `/squad` Squad, `/squad/:id` Player Profile, `/fixtures` Fixtures, `/results` Results, `/results/:id` Match Report, `/league-table` PSL Table, `/news` News, `/news/:id` Article, `/gallery` Gallery, `/technical-team` Coaching Staff, `/tickets` Tickets, `/shop` Club Shop, `/community` Community, `/contact` Contact, `/club` About

**Admin:** `/admin` Dashboard, `/admin/news` News CRUD, `/admin/squad` Squad CRUD, `/admin/gallery` Gallery CRUD

## Architecture decisions

- Contract-first API via OpenAPI spec — Orval generates React Query hooks and Zod schemas; never write manual fetch calls
- `useGetNextFixture` for the homepage countdown — server computes "next fixture" efficiently
- Admin section has no auth for now (intentional — can add Replit Auth later)
- Port 5173 used for frontend (Replit workflow health checker supports this port; 23253 was not detected)

## Product

A complete PSL club website: hero + countdown, live news/results/fixtures/league table from DB, player/staff profiles, gallery with lightbox, tickets/shop pages, community section, contact form, and an admin panel for content management.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Frontend must use port 5173 (not the originally assigned 23253 — Replit's workflow health checker can't detect arbitrary ports like 23253)
- API runs on port 8080, proxied at `/api` by Replit's reverse proxy
- `pnpm --filter @workspace/api-spec run codegen` must be run after changing `openapi.yaml`
- DB push (`pnpm --filter @workspace/db run push`) required after schema changes

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
