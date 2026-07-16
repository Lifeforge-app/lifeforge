# PocketBase Extraction

**Status**: Planned (not yet implemented)

## Overview

Extract all PocketBase-related types, utilities, and the `PBService` implementation from
`@lifeforge/server-utils` and `apps/api` into a new standalone package:
`@lifeforge/pocketbase`.

## Motivation

The upcoming `@lifeforge/file-storage` package needs `CollectionKey`, `FieldKey`, and `CleanedSchemas`
to provide type-safe autocomplete and runtime validation on collection/field names. Currently
these types live in `@lifeforge/server-utils`. Since `server-utils` would also depend on
`file-storage` (for `FileStorage` in `CoreContext`), importing PB types from `server-utils`
creates a circular dependency:

```
server-utils → file-storage → server-utils   (CYCLE)
```

Extracting PB types (and the implementation for cohesion) into a lower-level package
breaks the cycle:

```
file-storage → pocketbase ← server-utils
server-utils → file-storage
```

---

## New Package: `packages/pocketbase/`

```
packages/pocketbase/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── index.ts                       # Barrel: re-exports everything
    │
    ├── types/
    │   ├── pb_service.types.ts        # CollectionKey, FieldKey, FilterType,
    │   │                               # ExpandConfig, FieldSelection, SchemaWithPB,
    │   │                               # MultiItemsReturnType, SingleItemReturnType, etc.
    │   └── service.interface.ts       # IPBService, ICreate, IUpdate, IDelete,
    │                                   # IGetOne, IGetList, IGetFullList, IGetFirstListItem,
    │                                   # IPBServiceConstructor, and their factory types
    │
    ├── utils/
    │   ├── schemaUtils.ts             # CleanedSchemas, RawSchemas, cleanSchemas(), schemaWithPB()
    │   └── parseCollectionName.ts     # Parse PB collection name into components
    │
    ├── PBService/
    │   ├── index.ts                   # PBService<T> class
    │   ├── services/
    │   │   ├── create.ts
    │   │   ├── update.ts
    │   │   ├── delete.ts
    │   │   ├── getOne.ts
    │   │   ├── getList.ts
    │   │   ├── getFullList.ts
    │   │   └── getFirstListItem.ts
    │   └── utils/
    │       ├── recursivelyConstructFilter.ts
    │       └── getFinalCollectionName.ts
    │
    ├── dbUtils.ts                     # toPocketBaseCollectionName(),
    │                                   # validateEnvironmentVariables(),
    │                                   # connectToPocketBase(), checkDB()
    └── validation.ts                  # checkExistence()
```

### Dependencies

```json
{
  "dependencies": {
    "pocketbase": "^0.26.2",
    "@lifeforge/log": "workspace:*",
    "lodash": "^4.17.21",
    "chalk": "^5.x",
    "node-cache": "^5.x"
  }
}
```

### `ClientError` Handling

There is a subtle `instanceof` issue: `delete.ts` needs a `ClientError` to throw
(409 on relation constraint failure), but `@lifeforge/pocketbase` must not depend on
`@lifeforge/server-utils` where `ClientError` currently lives. Exporting `ClientError`
from `pocketbase` and having `server-utils` import it would also be a dependency
inversion.

**Solution**: define `ClientError` inline in `delete.ts` (8 lines, used exactly once,
not exported from the barrel). To make `instanceof` checks work across package
boundaries, the only catch site (`controllerLogic.ts`) switches from `instanceof`
to a duck-type check:

```typescript
// delete.ts — inline, NOT exported from barrel (internal only)
class ClientError extends Error {
  code: number
  constructor(message: string, code: number) {
    super(message)
    this.name = 'ClientError'
    this.code = code
  }
}
```

```typescript
// controllerLogic.ts — duck-type check (replaces instanceof)
function isClientError(err: unknown): err is Error & { code: number } {
  return err instanceof Error && err.name === 'ClientError' && 'code' in err
}

// Usage (line ~136):
if (isClientError(err)) { ... }
```

This means:
- `ClientError` stays in `@lifeforge/server-utils` for all other throwers (parseQuery,
  parsePayload, checkRecordExistence, decryptPayload, ai/index.ts, modrinth)
- `delete.ts` gets its own inline definition, not exported from the barrel
- `controllerLogic.ts` no longer imports `ClientError` — it uses the duck-type helper
- No `instanceof` mismatch across package boundaries

---

## Files to Move

### From `packages/server-utils/` → `packages/pocketbase/`

| Source | Destination |
|---|---|
| `src/typescript/pb/pb_service.types.ts` | `src/types/pb_service.types.ts` |
| `src/typescript/pb/PBService.interface.ts` | `src/types/service.interface.ts` |
| `src/utils/schemaUtils.ts` | `src/utils/schemaUtils.ts` |
| `src/utils/parseCollectionName.ts` | `src/utils/parseCollectionName.ts` |

### From `apps/api/` → `packages/pocketbase/`

| Source | Destination |
|---|---|
| `src/core/functions/database/PBService/index.ts` | `src/PBService/index.ts` |
| `src/core/functions/database/PBService/services/create.ts` | `src/PBService/services/create.ts` |
| `src/core/functions/database/PBService/services/update.ts` | `src/PBService/services/update.ts` |
| `src/core/functions/database/PBService/services/delete.ts` | `src/PBService/services/delete.ts` |
| `src/core/functions/database/PBService/services/getOne.ts` | `src/PBService/services/getOne.ts` |
| `src/core/functions/database/PBService/services/getList.ts` | `src/PBService/services/getList.ts` |
| `src/core/functions/database/PBService/services/getFullList.ts` | `src/PBService/services/getFullList.ts` |
| `src/core/functions/database/PBService/services/getFirstListItem.ts` | `src/PBService/services/getFirstListItem.ts` |
| `src/core/functions/database/PBService/utils/recursivelyConstructFilter.ts` | `src/PBService/utils/recursivelyConstructFilter.ts` |
| `src/core/functions/database/PBService/utils/getFinalCollectionName.ts` | `src/PBService/utils/getFinalCollectionName.ts` |
| `src/core/functions/database/dbUtils.ts` | `src/dbUtils.ts` |
| `src/core/functions/database/validation.ts` | `src/validation.ts` |

**Total: 16 files moved.**

---

## Package.json & Build Config Changes

### `packages/server-utils/package.json`

Add `@lifeforge/pocketbase` as a dependency (imports PB types for forge contracts and core context):

```json
{
  "dependencies": {
    "@lifeforge/pocketbase": "workspace:*",
    ...
  }
}
```

The raw `pocketbase` peer dependency is removed — `server-utils` no longer imports it
directly (PB types come from `@lifeforge/pocketbase`).

### `apps/api/package.json`

Add `@lifeforge/pocketbase` as a dependency (consumes PBService and PB types):

```json
{
  "dependencies": {
    "@lifeforge/pocketbase": "workspace:*",
    ...
  }
}
```

### `apps/api/vite.config.ts` — Externalize workspace packages

Since module server code runs inside the core API server's process, both
`@lifeforge/server-utils` and `@lifeforge/pocketbase` are already available in
`node_modules` at runtime. Externalizing prevents duplicate bundling:

```typescript
// Before
external: ['pocketbase']

// After
external: ['pocketbase', '@lifeforge/pocketbase', '@lifeforge/server-utils']
```

### Module `build:server` scripts (~22 modules)

Since modules import from `@lifeforge/pocketbase` directly (no re-exports), their
server build scripts need it added to the externals list:

```json
// Before
"build:server": "bun build ./server/index.ts --outdir ./server/dist --target bun --external @lifeforge/server-utils --external zod"

// After
"build:server": "bun build ./server/index.ts --outdir ./server/dist --target bun --external @lifeforge/server-utils --external @lifeforge/pocketbase --external zod"
```



---

## Import Updates

### `packages/server-utils/` (internal — relative imports become package imports)

| File | Old Import | New Import |
|---|---|---|
| `src/routes/forgeContract.ts` | `'../typescript/pb/pb_service.types'` | `'@lifeforge/pocketbase'` |
| `src/routes/forgeContract.ts` | `'../typescript/pb/PBService.interface'` | `'@lifeforge/pocketbase'` |
| `src/routes/forgeContract.ts` | `'../utils/schemaUtils'` | `'@lifeforge/pocketbase'` |
| `src/typescript/core/forge_contract.types.ts` | `'./core_context.types'` | *(indirect, via CoreContext)* |
| `src/typescript/core/core_context.types.ts` | `'../pb/PBService.interface'` | `'@lifeforge/pocketbase'` |
| `src/typescript/core/core_context.types.ts` | `'../pb/pb_service.types'` | `'@lifeforge/pocketbase'` |
| `src/typescript/core/core_context.types.ts` | `'../../utils/schemaUtils'` | `'@lifeforge/pocketbase'` |

### `packages/server-utils/src/index.ts` — removed exports

The following exports are **removed** (they now live in `@lifeforge/pocketbase`):

```typescript
// Removed lines:
export { cleanSchemas, schemaWithPB, type RawSchemas, type CleanedSchemas } from './utils/schemaUtils'
export { default as parseCollectionName } from './utils/parseCollectionName'
export type { default as IPBService, ICreate, ... } from './typescript/pb/PBService.interface'
export type { SchemaWithPB, CollectionKey, ... } from './typescript/pb/pb_service.types'
```

The `ClientError` export (line 1) stays — it remains in `@lifeforge/server-utils`.

Files in `typescript/pb/` and `utils/schemaUtils.ts` and `utils/parseCollectionName.ts` are **deleted**
from `server-utils` (they've been moved, not copied).

### `apps/api/` — consumers of `@functions/database`

| File | Old Import | New Import |
|---|---|---|
| `src/lib/auth/constants/pb.ts` | `@functions/database` | `@lifeforge/pocketbase` |
| `src/core/functions/routes/utils/validateAuthToken.ts` | `@functions/database` | `@lifeforge/pocketbase` |
| `src/core/functions/routes/utils/checkRecordExistence.ts` | `@functions/database` | `@lifeforge/pocketbase` |
| `src/core/functions/routes/utils/coreContext.ts` | `@functions/database` (for `IPBService`) | `@lifeforge/pocketbase` |
| `src/core/functions/external/ai/index.ts` | `@functions/database` (for `IPBService`) | `@lifeforge/pocketbase` |
| `src/express.d.ts` | `@functions/database` (for `PBService`) | `@lifeforge/pocketbase` |
| `src/lib/auth/...` (any other consumer) | `@functions/database` | `@lifeforge/pocketbase` |

The `@functions/database` barrel is removed (or shrunk to re-export nothing, since
all files moved to `@lifeforge/pocketbase`).

### Modules — consumers of PB exports

Approximately **37 files** need import updates. These break down into:

| Pattern | Count | Old Import | New Import |
|---|---|---|---|
| `createForge(schema)` (in `forge.ts`) | ~22 | N/A — `createForge` stays in `server-utils` | No change |
| `cleanSchemas(schemas)` (in `schema.ts`) | ~15 | `'@lifeforge/server-utils'` | `'@lifeforge/pocketbase'` |
| `import type { IPBService }` (in routes/utils) | ~7 | `'@lifeforge/server-utils'` | `'@lifeforge/pocketbase'` |
| `schemaWithPB` (in routes) | ~2 | `'@lifeforge/server-utils'` | `'@lifeforge/pocketbase'` |
| `forgeRouter`, `writeContractFileToClient` | ~20 | `'@lifeforge/server-utils'` (same import line as PB) | Split import: these from `server-utils`, PB types from `pocketbase` |

Example of a split import in modules:

```typescript
// Before (single import)
import { cleanSchemas, forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

// After (split)
import { cleanSchemas } from '@lifeforge/pocketbase'
import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'
```

### `packages/server-utils/src/routes/ClientError.ts`

**Stays in `server-utils` unchanged.** All existing throwers (parseQuery, parsePayload,
checkRecordExistence, decryptPayload, ai/index.ts, modrinth API) continue to import
`ClientError` from `@lifeforge/server-utils`.

The inline `ClientError` in `delete.ts` (within `@lifeforge/pocketbase`) is a separate
definition, NOT exported. `controllerLogic.ts` uses a duck-type check instead of
`instanceof` to handle both definitions uniformly — see [ClientError Handling](#clienterror-handling).

---

## PBService Internal Import Updates

After moving to `packages/pocketbase/`, the PBService files' internal imports change:

```typescript
// Before (in apps/api)
import { CleanedSchemas, CollectionKey, IPBService, ... } from '@lifeforge/server-utils'
import { ClientError } from '@lifeforge/server-utils'
import { toPocketBaseCollectionName } from '@functions/database/dbUtils'
import { createServiceLogger } from '@functions/logging'

// After (in packages/pocketbase/)
import { CleanedSchemas, CollectionKey, IPBService, ... } from '../types/pb_service.types'
// ClientError defined inline in this file (not imported from any package)
import { toPocketBaseCollectionName } from '../dbUtils'
import { createServiceLogger } from '@lifeforge/log'
```

The `createServiceLogger` import from `@functions/logging` changes to `@lifeforge/log`.
The logging function itself may need to move to `@lifeforge/log` or be reimplemented
in `pocketbase`.

---

## `@functions/database` Barrel

The barrel file at `apps/api/src/core/functions/database/index.ts` is removed entirely
(all its contents moved to `@lifeforge/pocketbase`).

---

## What Stays in `apps/api`

| File | Reason |
|---|---|
| `src/core/functions/database/getAPIKey.ts` | Uses app-specific constants (`ROOT_DIR`, `decrypt2` from `@functions/auth`) |
| `src/core/functions/auth/encryption.ts` | Crypto utilities — not PB-related |
| `src/core/functions/cache/index.ts` | `createCache` helper — no PB dependency |
| `src/core/functions/logging/index.ts` | `createServiceLogger` — from `@lifeforge/log` |
| `src/lib/user/` | User management — not PB infrastructure |

---

## Dependency Graph

### Before

```
@lifeforge/server-utils
  (contains: PB types, schema utils, ClientError, forge contracts, core context, media types)
  └── consumption:
        apps/api (PBService import, PB types)
        modules (cleanSchemas, IPBService, createForge)
```

### After

```
@lifeforge/pocketbase                     (bottom layer)
  deps: pocketbase, lodash, chalk
  contains: PB types, schema utils, parseCollectionName,
            PBService class, dbUtils, validation
    ↑
    ├── @lifeforge/server-utils            (middle layer)
    │     contains: forge contracts, core context, media types, encryption types
    │     deps: @lifeforge/pocketbase
    │       ↑
    │       ├── apps/api (forge callbacks, core routes)
    │       └── modules (createForge, forgeRouter)
    │
    ├── @lifeforge/file-storage            (middle layer, NEW)
    │     deps: @lifeforge/pocketbase (for CollectionKey, FieldKey, CleanedSchemas)
    │       ↑
    │       └── @lifeforge/server-utils (for FileStorage in CoreContext)
    │
    └── apps/api (PBService, dbUtils, validation)
          deps: @lifeforge/pocketbase
```

### Cycle check

| Path | Cycle? |
|---|---|
| `server-utils` → `file-storage` → `pocketbase` ← `server-utils` | No (diamond, not cycle) |
| `pocketbase` → anything | No zero internal deps (no `@lifeforge/*` deps besides itself) |

---

## Implementation Order

### Step 1: Create `packages/pocketbase/`

1. Create `packages/pocketbase/package.json` with dependencies
2. Create `tsconfig.json`, `vite.config.ts`
3. Move all 16 files from `server-utils` and `apps/api`
4. Add inline `ClientError` class to `delete.ts` (see [ClientError Handling](#clienterror-handling))
5. Update all internal imports within PBService files (relative paths, `@lifeforge/server-utils` → local)
6. Handle `createServiceLogger` — either move to `@lifeforge/log` or reimplement in `pocketbase`
7. Build barrel `src/index.ts` (do NOT export the inline `ClientError` from `delete.ts`)

### Step 2: Update `packages/server-utils/`

1. Edit `package.json` — add `"@lifeforge/pocketbase": "workspace:*"` to dependencies, remove `pocketbase` peerDep
2. Remove PB type exports from `src/index.ts` (lines 9-14, 22-57)
3. Remove `parseCollectionName` export from `src/index.ts` (line 18)
4. `ClientError` export (line 1) stays — still used by other throwers
5. Delete moved files: `typescript/pb/`, `utils/schemaUtils.ts`, `utils/parseCollectionName.ts`
6. `routes/ClientError.ts` stays (NOT deleted)
7. Update `forgeContract.ts` imports to `@lifeforge/pocketbase`
8. Update `core_context.types.ts` imports to `@lifeforge/pocketbase`
9. Delete `src/typescript/pb/` directory

### Step 3: Update `apps/api/`

1. Edit `package.json` — add `"@lifeforge/pocketbase": "workspace:*"` to dependencies
2. Edit `vite.config.ts` — externalize `@lifeforge/pocketbase` and `@lifeforge/server-utils`
3. Remove `@functions/database` barrel (all files moved)
4. Update ~6 consumer imports to `@lifeforge/pocketbase`
5. Update `getAPIKey.ts` — it imports `PBService` locally; update to `@lifeforge/pocketbase`
6. Update `controllerLogic.ts` — replace `ClientError.isClientError(err)` with duck-type check (see [ClientError Handling](#clienterror-handling))
7. Remove `src/core/functions/database/PBService/` directory (files moved)
8. Remove `src/core/functions/database/dbUtils.ts` and `validation.ts` (files moved)

### Step 4: Update modules (~37 files)

1. Edit each module's `package.json` — add `--external @lifeforge/pocketbase` to `build:server`
2. `schema.ts` files (~15): change `cleanSchemas` import to `@lifeforge/pocketbase`
3. Route/utils files (~7): change `IPBService` import to `@lifeforge/pocketbase`
4. Route files (~2): change `schemaWithPB` import to `@lifeforge/pocketbase`
5. Files importing both PB and server-utils from same package (~15): split into two imports

### Step 5: Verify

1. Run `pnpm install` to resolve workspace dependencies
2. Run TypeScript build across all packages
3. Smoke test `apps/api` startup
4. Test a few module endpoints

---

## `createServiceLogger` — Resolution

The PBService implementation uses `createServiceLogger` for logging, imported from
`@functions/logging` which wraps `@lifeforge/log`. After extraction, this import
can't reference `@functions/` (that's an `apps/api` alias).

Three options:

1. **Import from `@lifeforge/log` directly** — `createLogger` instead of `createServiceLogger`
2. **Reimplement in `pocketbase`** — thin wrapper around `createLogger` from `@lifeforge/log`
3. **Make it a dependency injection** — pass logger into PBService constructor

Recommended: **Option 2** (reimplement the thin wrapper). `createServiceLogger` is just:

```typescript
import { createLogger, Logger } from '@lifeforge/log'

export function createServiceLogger(name: string): Logger {
  return createLogger({ name, type: 'service' })
}
```

This can live in `packages/pocketbase/src/utils/logger.ts`.

---

## File Changes Summary

| File | Action | Description |
|---|---|---|
| `packages/pocketbase/` | **Create** | New package with 16 source files |
| `packages/pocketbase/package.json` | **Create** | Deps: pocketbase, @lifeforge/log, lodash, chalk, node-cache |
| `packages/server-utils/package.json` | **Edit** | Add `"@lifeforge/pocketbase": "workspace:*"`; remove `pocketbase` peerDep |
| `apps/api/package.json` | **Edit** | Add `"@lifeforge/pocketbase": "workspace:*"` |
| `apps/api/vite.config.ts` | **Edit** | Externalize `@lifeforge/pocketbase` and `@lifeforge/server-utils` |
| ~22 modules `package.json` | **Edit** | Add `--external @lifeforge/pocketbase` to `build:server` scripts |
| `packages/server-utils/src/typescript/pb/` | **Delete** | 2 files moved to pocketbase |
| `packages/server-utils/src/utils/schemaUtils.ts` | **Delete** | Moved to pocketbase |
| `packages/server-utils/src/utils/parseCollectionName.ts` | **Delete** | Moved to pocketbase |
| `packages/server-utils/src/routes/ClientError.ts` | **Keep** | Stays — used by other throwers |
| `packages/server-utils/src/index.ts` | **Edit** | Remove PB exports (lines 9-14, 18, 22-57); keep ClientError (line 1) |
| `packages/server-utils/src/routes/forgeContract.ts` | **Edit** | Update 3 imports to `@lifeforge/pocketbase` |
| `packages/server-utils/src/typescript/core/core_context.types.ts` | **Edit** | Update 3 imports to `@lifeforge/pocketbase` |
| `apps/api/src/core/functions/database/` | **Delete** | PBService, dbUtils, validation, barrel (all moved) |
| `apps/api/src/core/functions/routes/functions/controllerLogic.ts` | **Edit** | Duck-type `isClientError` instead of `instanceof` |
| `apps/api/src/lib/auth/constants/pb.ts` | **Edit** | `@functions/database` → `@lifeforge/pocketbase` |
| `apps/api/src/core/functions/routes/utils/validateAuthToken.ts` | **Edit** | `@functions/database` → `@lifeforge/pocketbase` |
| `apps/api/src/core/functions/routes/utils/checkRecordExistence.ts` | **Edit** | `@functions/database` → `@lifeforge/pocketbase` |
| `apps/api/src/core/functions/routes/utils/coreContext.ts` | **Edit** | `@functions/database` → `@lifeforge/pocketbase` |
| `apps/api/src/core/functions/external/ai/index.ts` | **Edit** | `@functions/database` → `@lifeforge/pocketbase` |
| `apps/api/src/express.d.ts` | **Edit** | `@functions/database` → `@lifeforge/pocketbase` |
| `apps/api/src/core/functions/database/getAPIKey.ts` | **Edit** | Update internal PBService import |
| ~15 modules `schema.ts` files | **Edit** | `cleanSchemas` → `@lifeforge/pocketbase` |
| ~7 modules route/util files | **Edit** | `IPBService` → `@lifeforge/pocketbase` |
| ~2 modules route files | **Edit** | `schemaWithPB` → `@lifeforge/pocketbase` |
| ~15 modules with split imports | **Edit** | Split PB + server-utils imports into two lines |
