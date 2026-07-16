# Module Structure Guide

How a typical Lifeforge module is laid out when it has both a **client** (React
frontend) and a **server** (Bun/PocketBase backend). Reference implementations:
`modules/lifeforge--books-library` (single-page) and `modules/lifeforge--wallet`
(multi-page with subsections and widgets).

## Top-Level Layout

```
modules/<publisher>--<module-name>/
├── package.json          # Module metadata, deps, build scripts
├── .gitignore
├── client/               # Frontend (React + Vite, module federation)
├── server/               # Backend (forge router + PocketBase schema)
├── locales/              # i18n translation files (en, ms, zh-CN, zh-TW)
└── docs/                 # Optional module-specific notes (e.g. todo.md)
```

Module folder names are prefixed with the publisher handle and a `--` separator
(e.g. `lifeforge--wallet`, `melvinchia3636--modrinth`). Each module is its own
workspace package and is developed/built independently.

## `package.json`

```jsonc
{
  "name": "@lifeforge/lifeforge--books-library",
  "displayName": "Books Library",          // Human-readable name shown in the UI
  "version": "0.0.5",
  "description": "Your personal library, no overdue fees.",
  "repository": { "type": "git", "url": "..." },
  "scripts": {
    "types": "cd client && tsgo",
    "build:client": "cd client && pnpm run vite build",
    "build:server": "pnpm build ./server/index.ts --outdir ./server/dist --target pnpm --external @lifeforge/server-utils --external zod"
  },
  "dependencies": { /* runtime deps used by the SERVER */ },
  "devDependencies": { /* @types/* etc. */ },
  "author": "...",
  "lifeforge": {
    "icon": "tabler:books",                 // Iconify icon for the module
    "category": "Storage",                  // Category used for grouping
    "APIKeyAccess": {                        // API keys the module wants access to
      "deepseek": {
        "usage": "Create transactions from natural language and images using llm",
        "required": false
      },
      "gcloud": {
        "usage": "To fetch location from google map api",
        "required": false
      }
    }
  },
  "peerDependencies": {
    "@lifeforge/api": "workspace:*",
    "@lifeforge/server-utils": "workspace:*",
    "@lifeforge/localization": "workspace:*",
    "@lifeforge/ui": "workspace:*",
    "@lifeforge/federation": "workspace:*",
    "@lifeforge/configs": "workspace:*"
  }
}
```

Key points:
- The `lifeforge` block (`icon`, `category`) drives how the module appears in
  the host shell.
- `lifeforge.APIKeyAccess` declares which entries from the central API-key vault
  the module needs. Each key is the vault entry id (e.g. `deepseek`, `openai`,
  `gcloud`, `tmdb`) mapped to:
  - `usage` - human-readable reason shown to the user when granting access.
  - `required` - whether the module is unusable without the key (`true`) or the
    key only enables optional features (`false`).
  Declared keys are surfaced to the user for consent and are read at runtime on
  the server via `core.api.getAPIKey('<id>', pb)` inside a route callback. Omit
  the block entirely when the module needs no external API keys (most modules).
  **Every API key the module uses must be declared here - whether it is consumed
  indirectly through an AI chat-completion call or read directly via
  `getAPIKey`. Accessing an undeclared API key results in an error at runtime.**
- Shared framework packages are declared as `peerDependencies` with
  `workspace:*`; module-specific runtime libraries go into `dependencies`.
- Three build scripts: `types` (typecheck client), `build:client` (Vite
  federation bundle), `build:server` (Pnpm bundle of the server entry).

## Client Side (`client/`)

```
client/
├── manifest.ts           # Module federation manifest (routes, subsections, widgets)
├── contract.ts           # AUTO-GENERATED API contract (do not edit by hand)
├── index.html            # Empty entry HTML for Vite
├── vite.config.ts        # defineModuleConfig({ dirname: __dirname })
├── tsconfig.json         # extends @lifeforge/configs/tsconfig/module.json
└── src/
    ├── index.tsx         # Default-exported root component (route "/")
    ├── vite-env.d.ts
    ├── components/       # Shared components for this module
    ├── pages/            # One folder per route (multi-page modules)
    ├── views/            # Alternate renderings of the same data (grid/list)
    ├── modals/           # Modal dialogs (also nested under pages/)
    ├── hooks/            # Module-local hooks (e.g. useFilter)
    ├── providers/        # React context providers
    ├── stores/           # Zustand stores
    ├── utils/            # Pure helpers
    └── widgets/          # Dashboard widget entry points
```

### `manifest.ts`

The manifest wires the client into the host via module federation. It calls
`createForgeModuleClient` with the generated `contract` and returns both the
`manifest` (default export) and a typed `forgeAPI` client (named export).

```typescript
import { lazy } from 'react'
import { createForgeModuleClient } from '@lifeforge/federation'
import contract from './contract'

const { forgeAPI, ...manifest } = createForgeModuleClient({
  // Optional: sidebar sub-navigation for multi-page modules
  subsection: [
    { label: 'Dashboard', icon: 'tabler:dashboard', path: '' },
    { label: 'Transactions', icon: 'tabler:arrows-exchange', path: 'transactions' }
  ],
  // Route -> lazily-loaded page component. "@" resolves to src/index
  routes: {
    '/': lazy(() => import('@')),
    '/transactions': lazy(() => import('@/pages/Transactions'))
  },
  // Optional: dashboard widgets exposed by the module
  widgets: [() => import('@/widgets/AssetsBalance')],
  contract
})

export default manifest
export { forgeAPI }
```

- A single-page module only needs `routes: { '/': lazy(() => import('@')) }`.
- A multi-page module adds `subsection` entries (sidebar nav) that map 1:1 to
  `routes`.
- `widgets` lists dashboard widget modules the host can mount.

### `contract.ts` (generated)

A large `as const` object describing every endpoint: HTTP `method`,
`description`, `noAuth`, `encrypted`, `media`, and JSON-schema `input`/`output`.
It is generated from the server routes by `writeContractFileToClient` (called in
`server/index.ts`) - **never edit it manually**. No command is required to regenerate 
it as it will be automatically regenerated on every single mutation to the server code
whenever the server is running. It serves as the single source of truththat gives 
`forgeAPI` full end-to-end type safety.

### `vite.config.ts` & `tsconfig.json`

Both are thin wrappers around shared configs:

```typescript
// vite.config.ts
import { defineModuleConfig } from '@lifeforge/configs/vite'
export default defineModuleConfig({ dirname: __dirname })
```

```jsonc
// tsconfig.json
{
  "extends": "@lifeforge/configs/tsconfig/module.json",
  "compilerOptions": {
    "paths": {
      "@/manifest": ["./manifest.ts"],
      "@": ["./src/index"],
      "@/*": ["./src/*"]
    }
  },
  "include": ["./src/**/*", "./manifest.ts", "./vite.config.ts", "./contract.ts"]
}
```

The `@` alias points at `client/src` (and `@` alone resolves to `src/index`).
Prefer `@/...` over long relative paths.

### `src/index.tsx`

The default-exported root component rendered at route `/`. It composes UI from
`@lifeforge/ui` (`ModuleHeader`, `Button`, `SearchInput`, `WithQuery`, ...),
reads/writes data through `forgeAPI`, and delegates to `components/`, `views/`,
`hooks/`, and `modals/`.

### Data fetching & mutations (client)

All server communication goes through the typed `forgeAPI` from `@/manifest`,
combined with TanStack Query:

```typescript
// Queries
const dataQuery = useQuery(
  forgeAPI.entries.list.input({ page: page.toString() }).queryOptions()
)

// One-off calls
await forgeAPI.entries.getEpubMetadata.mutate({ document: file })
```

### Query invalidation (MANDATORY: use the `forgeAPI.*.key` pattern)

You **must** use the contract-derived `forgeAPI.*.key` for all query keys and
invalidation (see `modules/lifeforge--wallet`). **Never hardcode query-key
string arrays.** Every endpoint namespace exposes a `.key` derived from the
contract, which is used both as the query key and for invalidation:

- `forgeAPI.<namespace>.key` - invalidates everything under that namespace
  (e.g. `forgeAPI.assets.key`, `forgeAPI.transactions.key`).
- `forgeAPI.key` - invalidates the entire module's cache.

The preferred way to mutate is `useForgeMutation` from `@lifeforge/api`, which
takes the endpoint and a config `{ action, queryKey }`. It auto-invalidates
`queryKey` on success and shows standard toasts based on `action`
(`'create' | 'update' | 'delete'`):

```typescript
import { useForgeMutation } from '@lifeforge/api'

const createMutation = useForgeMutation(
  forgeAPI.assets.create,
  { action: 'create', queryKey: forgeAPI.assets.key }
)

const updateMutation = useForgeMutation(
  forgeAPI.assets.update.input({ id: initialData?.id || '' }),
  { action: 'update', queryKey: forgeAPI.assets.key }
)

const deleteMutation = useForgeMutation(
  forgeAPI.assets.remove.input({ id: asset.id }),
  { action: 'delete', queryKey: forgeAPI.assets.key }
)

await createMutation.mutateAsync(data)
```

For manual refreshes, invalidate the same key directly:

```typescript
const queryClient = useQueryClient()

queryClient.invalidateQueries({ queryKey: forgeAPI.transactions.key })
```

> Older modules (e.g. `books-library`) still use `useMutation(...mutationOptions())`
> with hardcoded keys like `['booksLibrary']` - this is legacy and must not be
> replicated. They will be refactored soon. Always use the `forgeAPI.*.key` pattern above.

Types are inferred from the contract with helpers from `@lifeforge/api`:

```typescript
import type { InferInput, InferOutput } from '@lifeforge/api'

type Entry = InferOutput<typeof forgeAPI.entries.list>['items'][number]
type CreateBody = InferInput<typeof forgeAPI.collections.create>['body']
```

> **NEVER hardcode/redeclare a server response (or request) type on the client.**
> Always derive it from the contract via `InferOutput` / `InferInput` so it stays
> in sync with the server. Manually writing `interface`/`type` shapes that mirror
> an endpoint's payload is forbidden.

### Other client conventions

- **Forms**: use the composition pattern - `useForm()` (react-hook-form) +
  `zodResolver(schema)` + `<FormModal form={form} uiConfig={...} submissionConfig={...}>`
  with field components (`<TextField>`, `<NumberField>`, ...) as children. The old
  `defineForm(...).typesMap(...).setupFields(...).build()` builder is obsolete.
  For detailed information on the form system, refer to
  [`form-system-migration.md`](./form-system-migration.md).
- **Modals**: components receive `onClose` (and optional `data`) props and are
  opened via `useModalStore().open(ModalComponent, props)`.
- **URL state / filters**: `nuqs` (`useQueryState`, `useQueryStates`) keeps
  filter/search/pagination state in the URL (see `hooks/useFilter.ts`).
- **Providers**: context providers (e.g. socket-driven progress state) wrap the
  module via `<Outlet />` and export a `useXContext()` accessor.
- **Stores**: transient UI state uses small `zustand` stores under `stores/`.
- **Localization**: `useModuleTranslation()` + `t()`. Many `@lifeforge/ui`
  components (`Button`, `ModuleHeader`, form fields, `ContextMenuItem` with
  `label`) auto-resolve i18n internally - only use `t()` where they don't.

## Server Side (`server/`)

```
server/
├── index.ts              # Router assembly + contract generation
├── forge.ts              # createForge(schema) instance
├── schema.ts             # PocketBase collections (zod + raw definitions)
├── routes/               # One file per resource group (endpoints)
├── utils/                # Server-only helpers
└── constants/            # Static data (e.g. prompt templates)
```

### `index.ts`

Assembles all route groups into a single `forgeRouter` and triggers generation
of the client `contract.ts`:

```typescript
import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'
import * as entriesRoutes from './routes/entries'
import * as collectionsRoutes from './routes/collection'

const routes = forgeRouter({
  entries: entriesRoutes,
  collections: collectionsRoutes
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
```

Each key of `forgeRouter` becomes a namespace on `forgeAPI` (e.g.
`forgeAPI.entries.list`). Each imported module exports named endpoints.

### `forge.ts`

Creates the module's `forge` builder bound to the schema:

```typescript
import { createForge } from '@lifeforge/server-utils'
import schema from './schema'

const forge = createForge(schema)
export default forge
```

### `schema.ts`

Defines the module's PocketBase collections. Each entry pairs a **zod `schema`**
(runtime + type validation) with a **`raw`** PocketBase collection definition
(access rules, fields, indexes, and - for `type: 'view'` - a `viewQuery`).
Collection names are namespaced with the module prefix (e.g.
`books_library__entries`). Aggregated read-only views (e.g.
`books_library__collections_aggregated`) compute counts via SQL. The file is
wrapped in `cleanSchemas(schemas)` on export and imported by both `forge.ts` and
the routes.

```typescript
import z from 'zod'
import { cleanSchemas } from '@lifeforge/server-utils'

export const schemas = {
  collections: {
    schema: z.object({ name: z.string(), icon: z.string() }),
    raw: { name: 'books_library__collections', type: 'base', fields: [ /* ... */ ] }
  }
}

export default cleanSchemas(schemas)
```

### `routes/*.ts` - endpoints (Server DSL)

Each file exports named endpoints built with the `forge` DSL. Endpoints are
`forge.query(...)` (reads) or `forge.mutation(...)` (writes), followed by
`.callback(...)`. The config object declares `description`, `input` (zod
`query`/`body`), `existenceCheck`, `media`, and `output` (a status→schema map;
`true` means an empty-body status like `NOT_FOUND` / `NO_CONTENT`).

```typescript
import z from 'zod'
import forge from '../forge'
import schema from '../schema'

export const list = forge
  .query({
    description: 'Get all book collections',
    output: { OK: z.array(schema.collections_aggregated) }
  })
  .callback(async ({ pb, response }) =>
    response.ok(await pb.getFullList.collection('collections_aggregated').sort(['name']).execute())
  )

export const create = forge
  .mutation({
    description: 'Create a new book collection',
    input: { body: schema.collections },
    output: { CREATED: schema.collections }
  })
  .callback(async ({ pb, body, response }) =>
    response.created(await pb.create.collection('collections').data(body).execute())
  )
```

The callback receives a context object, commonly destructuring:
- `pb` - typed PocketBase query builder (`getFullList`, `getOne`, `create`,
  `update`, `delete`, each chained with `.collection(...)`, `.id(...)`,
  `.data(...)`, `.filter([...])`, `.execute()`).
- `query` / `body` / `media` - validated request inputs.
- `response` - status helpers: `response.ok(...)`, `response.created(...)`,
  `response.noContent()`, `response.badRequest(...)`, etc.
- `core` - framework services, e.g. `core.media.retrieveMedia` /
  `convertPDFToImage`, `core.api.getAPIKey`, `core.tasks`.
- `io` - Socket.IO server for pushing progress updates.

`existenceCheck` validates that referenced records exist before running the
callback: `{ query: { id: 'entries' }, body: { collection: '[collections]' } }`
(brackets indicate relation/array fields).

The full DSL and migration notes live in
[`server-dsl-migration.md`](./server-dsl-migration.md).

### `utils/` and `constants/`

- `utils/` - server-only helpers (thumbnail generation, downloads, date ranges,
  external API scraping) imported by routes.
- `constants/` - static data such as AI prompt templates.

## `locales/`

One JSON file per supported language (`en.json`, `ms.json`, `zh-CN.json`,
`zh-TW.json`). Keys are nested by feature area (`sidebar`, `modals`, `inputs`,
`buttons`, `items`, `empty`, ...) and resolved on the client through
`useModuleTranslation()` under the `apps.<moduleName>` namespace.

## End-to-End Flow (summary)

1. `server/schema.ts` defines PocketBase collections (zod + raw).
2. `server/routes/*.ts` define typed endpoints against that schema using the
   `forge` DSL.
3. `server/index.ts` assembles them with `forgeRouter` and generates
   `client/contract.ts`.
4. `client/manifest.ts` feeds the contract into `createForgeModuleClient`,
   producing the typed `forgeAPI` and the federation `manifest`.
5. Client components import `forgeAPI` from `@/manifest` and call it via
   TanStack Query, with `InferInput`/`InferOutput` giving full type safety.
6. `locales/` supplies translations; the host shell mounts the module using the
   `manifest` and the `lifeforge` metadata in `package.json`.
