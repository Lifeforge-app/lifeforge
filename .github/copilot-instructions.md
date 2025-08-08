## Lifeforge – AI contributor guide

This monorepo uses Bun workspaces with a type-safe API pattern shared between server and client. Follow these rules to be productive and avoid breaking conventions.

### Big picture

- Monorepo packages: `server/` (Express API), `client/` (React + Vite), `shared/` (typed API client + hooks/providers), `packages/lifeforge-ui/` (component library), plus `apps/*` (standalone playgrounds/tools).
- Data layer: PocketBase (see `database/pb_migrations/` and runtime DB in `database/pocketbase/pb_data/`). Server accesses PB through a typed `PBService` wrapper and enforces auth in middleware.
- API architecture: server routes are declared via a fluent, type-safe DSL built on Zod and Express:
  - `forgeController` builds endpoints with `.input({ body?, query? })`, `.existenceCheck()`, `.media()` (for uploads), `.isDownloadable()`, `.callback(...)`.
  - `forgeRouter({...})` composes nested routers. The main router in `server/src/core/routes/routes.ts` lazy-imports “apps” and mounts them.
  - Client imports the server’s route tree type (`AppRoutes`) to generate a fully typed client (`shared` → `createForgeAPIClient`). This ensures client endpoints mirror server definitions.
- Realtime: Socket.IO is initialized in `server/src/index.ts`. The task pool middleware (`taskPoolMiddleware.ts`) and helpers (`addToTaskPool`, `updateTaskInPool`) emit `taskPoolUpdate` events; the client subscribes via `SocketProvider` and authenticates with the PocketBase session cookie.

### Dev and build workflows (Bun)

- Install once at repo root: `bun install`.
- Orchestrated scripts (see `scripts/forge.ts`):
  - Run dev for multiple projects concurrently, e.g.: `bun run forge dev client server shared ui`
  - Typecheck: `bun run forge types server client shared ui`
  - Lint/format where available: `bun run forge lint server`
- Individual packages:
  - Server: `bun run dev` (env from `server/env/.env.local`), `bun run build`, `bun run start`
  - Client: `bun run dev`, `bun run build` (builds `shared` and `lifeforge-ui` first), `bun run preview`
  - Shared: `bun run build`
  - UI: `bun run dev` (tsup watch) or `bun run build`
- Tests: server uses Jest (run `bun run test` in `server/`).

### Server conventions (Express + PocketBase)

- Define endpoints with `forgeController` in app routers. Always specify Zod schemas via `.input({ body, query })`—handlers receive fully typed `body`, `query`, `pb`, `io`, and `media` (if used).
- Use `.existenceCheck('body'|'query', { field: 'collection' | '[collection]' })` to assert PocketBase IDs exist before running logic. Brackets mark optional fields; arrays are supported.
- For uploads, declare `.media({ field: { optional?: boolean } })`. Upload middlewares are auto-attached; `.callback` receives `media` with files.
- Set `.isDownloadable()` for file responses (adds headers) and `.noDefaultResponse()` when manually writing responses; otherwise responses are wrapped by `successWithBaseResponse` with `statusCode()`.
- Central router: `server/src/core/routes/routes.ts` exposes common utilities:
  - `media` proxies PocketBase file URLs; `corsAnywhere` fetches external URLs to bypass CORS; `status` and `_listRoutes` aid health/discovery.
- PocketBase access/auth:
  - `pocketbaseMiddleware.ts` enforces auth on non-whitelisted routes and injects `req.pb = new PBService(...)`.
  - Socket.IO handshake validates `auth.token` against PB (`PB_HOST`).
- Keep environment in `server/env/.env.local` (required: `PORT`, `PB_HOST`, `PB_EMAIL`, `PB_PASSWORD`).

### Client conventions (React + Vite + TanStack Query)

- API client: `client/src/core/utils/forgeAPI.tsx` creates `forgeAPI` with `createForgeAPIClient<AppRoutes>(import.meta.env.VITE_API_HOST)`. Use it for all XHR:
  - GET: `forgeAPI.module.endpoint.input({ ... }).query()` or `.queryOptions()` for React Query.
  - POST: `forgeAPI.module.endpoint.mutate(data)` or `.mutationOptions()`.
- Routing and modules:
  - `core/routes/routes.json` defines category → module entries. `Routes.tsx` resolves each item’s `config.tsx` via `import.meta.glob` (Vite) and renders in `MainRoutesRenderer`.
  - Module visibility is user-driven: `userData.enabledModules` (kebab-cased names) controls which routes render.
- Realtime: wrap UI in `SocketProvider`; the server emits `taskPoolUpdate` events for long-running tasks.

### Shared package patterns

- `shared/src/api/core/forgeAPIClient.ts` is the single source for creating typed clients from the server’s route type. Don’t hand-roll fetchers.
- Providers and hooks (e.g., API endpoint/online status, personalization, sidebar, toast) live in `shared/src/providers/*`—reuse them in `client` and `lifeforge-ui`.

### Adding features — concrete examples

- New server endpoint: create under `server/src/apps/<feature>/routes/*.ts` using `forgeController`. Register it in that feature’s `index.ts` via `forgeRouter({ ... })`; it will be mounted automatically in the main `routes.ts`.
- New client call: use `forgeAPI.<feature>.<endpoint>...` with `.input()` and `.query()`/`.mutate()`; don’t hardcode URLs.
- New client module/page: add `config.tsx` under `client/src/apps/<Module>/` or `client/src/core/pages/<Page>/` and reference it in `core/routes/routes.json`.

### External dependencies and integration points

- PocketBase (primary DB/storage), Socket.IO (server push), Zod (validation), React Query (data fetching), Tailwind v4, Day.js, lodash. The server also includes media tooling (Sharp/FFmpeg/PDF utilities) and various 3rd-party integrations—follow existing patterns in `server/src/core/lib/*`.

Questions or gaps? If an endpoint or config is unclear, point to the exact file and propose the smallest diff aligned with the patterns above, and ask for environment values when required.
