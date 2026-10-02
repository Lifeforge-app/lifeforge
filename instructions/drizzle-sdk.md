# Drizzle SDK Guide

**Status**: Implemented

How to define database schemas, relations, and queries on the Lifeforge server
using the Drizzle ORM (v1, `drizzle-orm@1.0.0-rc.4`) with the `postgres-js`
driver. This guide reflects the current state of the core server
(`apps/api/src`) and the reference module `modules/lifeforge--achievements`.
Other modules still on PocketBase are migration targets and are intentionally
out of scope.

For file uploads, `core.storage` uses the Drizzle table/column types. See
[`file-storage-sdk.md`](./file-storage-sdk.md) for the storage side.

---

## Overview

Drizzle replaces PocketBase as the data layer. Instead of declaring collections
with a `raw` PocketBase definition and a parallel Zod schema, a module declares
plain TypeScript tables and relations:

```
PostgreSQL
   ^
   |  postgres-js client (one pool)
   |
apps/api/src/core/drizzle.ts  ──  single `db` instance with ALL relations merged
   |
   |  req.db middleware (core/app.ts)
   v
registerController ──> callback({ db, core, body, query, media, response, ... })
   |
   |  `db` is typed PostgresJsDatabase<TSchema>
   v
module route file: db.query.<table>.findFirst(...), db.select()..., etc.
```

Key ideas:

- **One `db` instance for the whole server**, built in
  `apps/api/src/core/drizzle.ts`. It is attached to every request as `req.db`
  by the middleware in `apps/api/src/core/app.ts:16`, then handed to route
  callbacks by `registerController`.
- **Schemas live per module** in `server/schema.drizzle.ts` as
  `pgTable(...)` definitions plus a raw `relations` callback.
- **Modules register by passing their schema to the forge builder** in
  `server/forge.ts`: `createForgeContractBuilder({ schema })`. That records the
  schema in a shared `DrizzleSchemaRegistry`. Core registers its own merged
  schema once in `core/drizzle.ts` and no longer imports module schemas by name.
  After the module loader finishes discovering and importing modules,
  `initDrizzle()` composes every registered part into the single `db`.
- **The forge builder is generic over the relations type**
  (`createForgeContractBuilder<TSchema>`), which is what gives each callback a
  fully typed `db`.

---

## Dependencies and Scripts

| Package              | Version      | Role                                          |
| -------------------- | ------------ | --------------------------------------------- |
| `drizzle-orm`        | `1.0.0-rc.4` | Schema, relations, query builder, zod         |
| `drizzle-kit`        | `1.0.0-rc.4` | Migration generation / push (dev only)        |
| `postgres`           | `^3.4.x`     | `postgres-js` driver used by core             |
| `@lifeforge/drizzle` | `0.0.1`      | Registry + `defineModuleSchema` + composition |

`drizzle-orm` is declared **once**, in the repo root `package.json`
(`dependencies`), and is imported directly for context-free helpers
(`pgTable`, `eq`, `sql`, `defineRelations`, `createSelectSchema`, ...).
Context-aware glue (the schema registry, `defineModuleSchema`,
`composeRelations`, and the `AnyRelations` / `PostgresJsDatabase` /
`RelationsBuilder` types) is re-exported from `@lifeforge/drizzle` so the rest
of the codebase never imports `drizzle-orm` for those.

Migrations are run from the repo root; the root scripts delegate to the
`@lifeforge/server` workspace:

```bash
pnpm db:push      # push schema straight to the DB (development)
pnpm db:generate  # generate SQL migration files into apps/api/drizzle
pnpm db:migrate   # apply generated migrations
```

which map to `drizzle-kit push | generate | migrate` inside `apps/api`.

---

## Where Things Live

```
packages/drizzle/                     # @lifeforge/drizzle
└── src/
    ├── registry/DrizzleSchemaRegistry.ts   # shared schema registry
    ├── defineModuleSchema.ts               # register + build local relations
    └── composeRelations.ts                 # merge all registered parts

apps/api/
├── drizzle.config.ts                 # drizzle-kit config (schema globs, out dir)
├── drizzle/                          # generated migrations (output)
└── src/
    ├── core/
    │   ├── drizzle.ts                # client + core-only db + initDrizzle()
    │   ├── app.ts                    # req.db = db middleware
    │   └── functions/routes/
    │       ├── functions/controllerLogic.ts   # injects db into callbacks
    │       └── utils/coreContext.ts           # builds core.storage etc.
    └── lib/
        ├── user/schema.drizzle.ts
        ├── auth/schema.drizzle.ts
        └── apiKeys/schema.drizzle.ts

modules/<module>/server/
├── schema.drizzle.ts                 # pure declaration: tables + relations callback
├── forge.ts                          # createForgeContractBuilder({ schema }) - registers
└── routes/*.ts                       # queries against `db`
```

`core/drizzle.ts` only imports the **core** schemas. Module schemas register
themselves as a side effect of being imported by
`loadAndRegisterModuleRoutes()`. `core/routes/index.ts` then calls
`initDrizzle()` to rebuild `db` from the full registry:

```typescript
// apps/api/src/core/routes/index.ts
const appRoutes = await loadAndRegisterModuleRoutes()
initDrizzle()
```

`drizzle.config.ts` discovers schemas automatically:

```typescript
// apps/api/drizzle.config.ts
export default defineConfig({
  schema: [
    './src/lib/**/schema.drizzle.ts',
    '../../modules/**/schema.drizzle.ts'
  ],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! }
})
```

It reads env from `env/.env.local` (loaded via `dotenv`). `DATABASE_URL` is
required by both `drizzle.config.ts` and `core/drizzle.ts`.

---

## Defining Tables (`schema.drizzle.ts`)

Import table builders from `drizzle-orm/pg-core`. A module schema exports the
tables plus a `defineRelations(...)` result used for typing.

```typescript
// modules/lifeforge--achievements/server/schema.drizzle.ts
import { defineRelations } from 'drizzle-orm'
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core'

export const difficultyEnum = pgEnum('difficulty', [
  'easy',
  'medium',
  'hard',
  'impossible'
])

export const achievementsCategories = pgTable('achievements__categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  color: varchar('color', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 255 }).notNull()
})

export const achievementsEntries = pgTable('achievements__entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  thoughts: text('thoughts').notNull(),
  difficulty: difficultyEnum('difficulty').notNull(),
  categoryId: uuid('category_id').references(() => achievementsCategories.id),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull(),
  updated: timestamp('updated', { mode: 'date' }).defaultNow().notNull()
})
```

### Conventions

- **DB table names are namespaced with the module prefix** using `__` as the
  separator, e.g. `achievements__categories`, `achievements__entries`. Core
  tables use their own prefixes: `users`, `user__font_family_upload`,
  `auth__refresh_tokens`, `auth__oauth_providers`, `api_keys__entries`.
- **JS property is camelCase; the DB column is snake_case.** Pass the column
  name explicitly as the first argument to the builder:
  `categoryId: uuid('category_id')`, `emailVisibility: boolean('email_visibility')`.
  This matches `apps/api/src/lib/user/schema.drizzle.ts`. (Note:
  `auth/schema.drizzle.ts` uses snake_case property names directly - this is
  legacy and should not be replicated.)
- **Timestamps use `{ mode: 'date' }`** and `.defaultNow().notNull()`:
  `created` / `updated`. Because they deserialize to `Date`, they must be
  converted with `.toISOString()` before being returned from a route (see
  [Zod integration](#zod-integration--dtos)).
- **IDs are `uuid('id').defaultRandom().primaryKey()`**.
- **Foreign keys use `.references(() => target.id)`**. This creates the actual
  DB constraint. It does **not** power the relational query API - that needs a
  `defineRelations` entry (see below).
- **Enums use `pgEnum(...)`** and are referenced by column name.
- **JSON columns use `json('col').$type<T>()`**, e.g.
  `dashboardLayout: json('dashboard_layout').$type<Record<string, unknown>>()`.
- Nullable columns simply omit `.notNull()`. Unique columns add `.unique()`.

---

## Defining Relations

Relations are declared **once**, in the schema file, and **registered in
`forge.ts`** when the module's `createForgeContractBuilder` is created. A schema
file is a pure declaration - it never registers and never imports the registry
at runtime.

```typescript
// modules/lifeforge--achievements/server/schema.drizzle.ts
import { pgTable, ... } from 'drizzle-orm/pg-core'
import { type RelationsBuilder } from '@lifeforge/drizzle'

export const achievementsCategories = pgTable('achievements__categories', { ... })
export const achievementsEntries = pgTable('achievements__entries', { ... })

export const tables = { achievementsCategories, achievementsEntries }

export const relations = (r: RelationsBuilder<typeof tables>) => ({
  achievementsCategories: {
    entries: r.many.achievementsEntries()
  },
  achievementsEntries: {
    category: r.one.achievementsCategories({
      from: r.achievementsEntries.categoryId,
      to: r.achievementsCategories.id
    })
  }
})
```

```typescript
// modules/lifeforge--achievements/server/forge.ts
import { createForgeContractBuilder } from '@lifeforge/server-utils'

import * as schema from './schema.drizzle'

const forge = createForgeContractBuilder({ schema })
export default forge
```

`createForgeContractBuilder` (aliased as `createForge`) takes a single config
object - never positional arguments:

```typescript
interface ForgeContractOptions<TSchema extends ModuleSchema = ModuleSchema> {
  schema?: TSchema // the schema.drizzle namespace
  moduleId?: string // caller module id (core libs); app modules are stack-detected
  modulePathAlias?: string // e.g. 'codeTime'
}
```

Stateless modules (no Drizzle schema) simply pass `createForge({})`. When a
`schema` is given, the builder:

1. Registers `{ tables, relations }` in the shared `DrizzleSchemaRegistry`
   (internally via `defineModuleSchema`).
2. Builds the relations and infers the module's `db` type from them, so
   callbacks get typed `db.query.<moduleTable>`.
3. Attaches the tables to the contract (`getValue().schemas`), reserved for
   `core.storage` field/collection validation.

Without a `schema`, the `db` type comes from an explicit generic (core libs use
`createForgeContractBuilder<CoreRelations>({ moduleId: 'user' })`) or defaults
to `any`.

`r.one.targetTable({ from, to })` and `r.many.targetTable()` are the v1
`defineRelations` builders. `from` is the column on the source table, `to` is
the column on the target table.

> The `RelationsBuilder` import is **type-only**, so it is erased at runtime and
> `drizzle-kit` never loads `@lifeforge/drizzle` through a schema file.

### How the registry becomes the `db`

Core is one owner, so it registers its merged schema **once** in
`apps/api/src/core/drizzle.ts` (via `defineModuleSchema`) and builds a core-only
`db` immediately so direct importers and tests have a working instance:

```typescript
// apps/api/src/core/drizzle.ts
import { drizzle } from 'drizzle-orm/postgres-js'
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { composeRelations, defineModuleSchema } from '@lifeforge/drizzle'

import * as apiKeysSchema from '../lib/apiKeys/schema.drizzle'
import * as authSchema from '../lib/auth/schema.drizzle'
import * as userSchema from '../lib/user/schema.drizzle'

const client = postgres(process.env.DATABASE_URL!, { max: 1 })

const coreTables = {
  ...userSchema.tables,
  ...authSchema.tables,
  ...apiKeysSchema.tables
}

const coreRelations = defineModuleSchema(coreTables, r =>
  Object.assign(
    {},
    userSchema.relations(r),
    authSchema.relations(r),
    apiKeysSchema.relations(r)
  )
)

export type CoreRelations = typeof coreRelations

let db: PostgresJsDatabase<CoreRelations> = drizzle({
  client,
  relations: coreRelations
})
export { db }

export function initDrizzle(): void {
  db = drizzle({
    client,
    relations: composeRelations()
  }) as unknown as PostgresJsDatabase<CoreRelations>
}
```

After module discovery, `core/routes/index.ts` calls `initDrizzle()`, which
reads every registered part (core + modules) and rebuilds `db`:

```typescript
// composeRelations() (inside @lifeforge/drizzle)
const parts = DrizzleSchemaRegistry.parts
const tables = Object.assign({}, ...parts.map(p => p.tables))
return defineRelations(tables as any, (r: any) =>
  Object.assign({}, ...parts.map(p => p.relations(r)))
)
```

**Key naming.** The keys in a schema's `tables` object are the names used to
address the table in `db.query.<key>`. They must be **module-namespaced**
(`achievementsEntries`, never `entries`) because all modules share one registry
and therefore one namespace.

> **Deployment note.** `@lifeforge/drizzle` must stay **external** in the core
> API build (`apps/api/vite.config.ts`) and in module builds (handled
> automatically by `serverAliasResolver`). Bundling it into either side would
> create two separate `DrizzleSchemaRegistry` instances and schemas would not be
> discovered.

### Typing the builder

- **Core libs** type against `CoreRelations`:

  ```typescript
  // apps/api/src/lib/user/forge.ts
  import type { CoreRelations } from '@/core/drizzle'

  const forge = createForgeContractBuilder<CoreRelations>({ moduleId: 'user' })
  ```

- **Modules** pass their schema and the type is inferred:

  ```typescript
  // modules/lifeforge--achievements/server/forge.ts
  import * as schema from './schema.drizzle'

  const forge = createForgeContractBuilder({ schema })
  ```

The generic parameter flows into `ForgeContext.db` and `ForgeContext.core`,
both typed `PostgresJsDatabase<TSchema>` / `CoreContext<TSchema>`.

At runtime the injected `db` knows every registered table, but the **types** of
a module's `db` are limited to that module's own relations. A module cannot
type-reference another module's table (this enforces module isolation). The
runtime composition supports cross-module relations; a typed collaboration
mechanism is deferred.

### Many-to-many and optional relations

The v1 builder also supports junction (`through`) relations and optional `one`
relations:

```typescript
// many-to-many via a junction table
r.many.posts({
  from: r.users.id.through(r.usersToPosts.userId),
  to: r.posts.id.through(r.usersToPosts.postId)
})

// one relation that may be null
r.one.profiles({ from: r.users.id, to: r.profiles.userId })
```

`r.one` is treated as nullable in query results unless configured otherwise
(`RelationResultKind` returns `TResult | null` for optional `one`). Foreign
keys declared nullable with `.references()` should always get a matching
optional `r.one`.

---

## Querying: Relational Query API (`db.query`)

The relational API is the default for CRUD. It is fully typed from the
registered relations and supports `where`, `columns`, `orderBy`, `limit`,
`offset`, `with`, and `extras`.

```typescript
// find one
const user = await db.query.users.findFirst({
  where: { id: userId }
})

// find many, ordered
const entries = await db.query.apiKeysEntries.findMany({
  orderBy: { name: 'asc' }
})
```

### `where` object syntax

The `where` object accepts equality by default and nested operators:

```typescript
// equality
where: {
  id: category
}

// operators on a column
where: {
  id: {
    ne: currentId
  }
}

// case-insensitive search
where: {
  title: {
    ilike: `%${query}%`
  }
}

// combine with AND / OR (arrays)
where: {
  OR: [
    { title: { ilike: `%${query}%` } },
    { thoughts: { ilike: `%${query}%` } }
  ]
}
where: {
  AND: [{ difficulty }, { categoryId: category }]
}

// empty => no filter
where: filters.length > 0 ? { AND: filters } : undefined
```

### Building filters incrementally with `TableFilter`

For dynamic filters, type an array with `TableFilter<typeof table>` and spread
predicates conditionally, then pass as `AND`:

```typescript
// modules/lifeforge--achievements/server/routes/entries.ts
import { type TableFilter } from 'drizzle-orm'

const filters: TableFilter<typeof achievementsEntries>[] = [
  ...(difficulty ? [{ difficulty }] : []),
  ...(category ? [{ categoryId: category }] : []),
  ...(query
    ? [
        {
          OR: [
            { title: { ilike: `%${query}%` } },
            { thoughts: { ilike: `%${query}%` } }
          ]
        }
      ]
    : [])
]

const result = await db.query.achievementsEntries.findMany({
  where: filters.length > 0 ? { AND: filters } : undefined,
  orderBy: { created: 'desc' }
})
```

### Selecting a subset of columns / eager loading

```typescript
const rows = await db.query.achievementsEntries.findMany({
  columns: { id: true, title: true, difficulty: true },
  with: {
    category: true // loads the related `one` relation
  },
  orderBy: { created: 'desc' },
  limit: 20,
  offset: 0
})
```

`with` is only available for relations registered in the central
`defineRelations` map. Tables with no relations still support `db.query`, but
`with` will be empty.

### Operator reference

Available operators (imported from `drizzle-orm`, or used inside the `where`
object): `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `notLike`,
`notIlike`, `inArray`, `notInArray`, `isNull`, `isNotNull`, `between`,
`notBetween`, `exists`, `notExists`, `and`, `or`, `not`, plus array helpers
(`arrayContains`, `arrayContained`, `arrayOverlaps`) and `sql`. `AND`, `OR`,
`NOT` are built into the object filter syntax.

---

## Querying: SQL-Style Query Builder

For joins, aggregations, and anything the relational API does not express, use
the classic builder: `db.select()`, `db.insert()`, `db.update()`,
`db.delete()`.

### `select` with joins and aggregates

```typescript
// modules/lifeforge--achievements/server/routes/categories.ts
import { eq, sql } from 'drizzle-orm'

import { achievementsCategories, achievementsEntries } from '../schema.drizzle'

const result = await db
  .select({
    id: achievementsCategories.id,
    name: achievementsCategories.name,
    icon: achievementsCategories.icon,
    color: achievementsCategories.color,
    amount:
      sql<number>`CAST(COUNT(${achievementsEntries.id}) AS INTEGER)`.mapWith(
        Number
      )
  })
  .from(achievementsCategories)
  .leftJoin(
    achievementsEntries,
    eq(achievementsCategories.id, achievementsEntries.categoryId)
  )
  .groupBy(achievementsCategories.id)
```

`sql<number>` templating interpolates columns safely; `CAST(... AS INTEGER)`
is required because Postgres `COUNT(*)` comes back as `bigint` (a string over
the wire), and `.mapWith(Number)` coerces it. Grouped counts follow the same
shape as `difficultiesCount` in
`modules/lifeforge--achievements/server/routes/entries.ts`.

### `insert` with `returning`

```typescript
const [entry] = await db
  .insert(apiKeysEntries)
  .values({ keyId, name, icon, exposable, key: encryptedKey })
  .returning() // returns all columns; pass { id: true } etc. to narrow
```

### `update` with `eq` and `returning`

```typescript
const [updated] = await db
  .update(achievementsEntries)
  .set({
    title: body.title,
    thoughts: body.thoughts ?? '',
    difficulty: body.difficulty,
    categoryId: body.category || null,
    updated: new Date()
  })
  .where(eq(achievementsEntries.id, id))
  .returning()

if (!updated) {
  return response.notFound()
}
```

`eq` (and friends) compare columns, not object filters. Always use them in
`where()` for the builder API. `updated` timestamps are set manually with
`new Date()` on update (there is no DB trigger).

### `delete` with `returning`

```typescript
const [deleted] = await db
  .delete(achievementsEntries)
  .where(eq(achievementsEntries.id, id))
  .returning()

if (!deleted) {
  return response.notFound()
}

return response.noContent()
```

Using `.returning()` is the idiomatic way to distinguish "row existed and was
affected" from "not found", returning `response.notFound()` when the array is
empty.

---

## Zod Integration (DTOs)

`drizzle-orm/zod` derives Zod schemas directly from tables, keeping DTOs in
sync with the DB. Use `createSelectSchema` (for reads) and `createInsertSchema`
(for writes), then `.pick()`, `.omit()`, and `.extend()` to shape the contract
input/output.

```typescript
// modules/lifeforge--achievements/server/routes/entries.ts
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import { achievementsEntries } from '../schema.drizzle'

const entryDifficultyDto =
  createSelectSchema(achievementsEntries).shape.difficulty

const entryDto = createSelectSchema(achievementsEntries)
  .omit({ categoryId: true })
  .extend({
    difficulty: entryDifficultyDto,
    category: z.string().optional().nullable(),
    created: z.string(),
    updated: z.string()
  })

const entryInputDto = createInsertSchema(achievementsEntries)
  .pick({ title: true, thoughts: true, difficulty: true })
  .extend({
    category: z.string().optional().nullable()
  })
```

Then use them in the DSL:

```typescript
output: { OK: z.array(entryDto), NOT_FOUND: true }
input: { body: entryInputDto }
```

### Rules and gotchas

- **Timestamps must be re-declared as `z.string()`** in output schemas
  (`created: z.string(), updated: z.string()`) because `createSelectSchema`
  yields `z.date()` for `mode: 'date'` columns. Serialize with
  `.toISOString()` when mapping the row.
- **Select the exposed fields explicitly with `.pick()`** for mutation bodies
  rather than accepting the whole insert schema - this prevents clients from
  setting server-managed columns (ids, timestamps, relation keys).
- **Reuse schemas for both input and output** where the shape matches, but keep
  output contracts per the [server DSL rules](./server-dsl-migration.md):
  no `z.any()`, `.passthrough()`, `z.custom()`, `z.void()`, or `z.unknown()`.
- **Enums**: pull the enum schema from `createSelectSchema(table).shape.<enumCol>`
  and reuse it (see `entryDifficultyDto`) instead of re-declaring the union.
- **`$inferSelect` / `$inferInsert`** (from `drizzle-orm`) give the plain
  TypeScript row types when a Zod schema is overkill:
  `type Entry = typeof achievementsEntries.$inferSelect`.

---

## Output Serialization

The relational and builder APIs return `Date` objects for timestamp columns.
Route outputs are JSON-serialized, so convert manually:

```typescript
return response.ok(
  result.map(entry => ({
    id: entry.id,
    title: entry.title,
    thoughts: entry.thoughts,
    difficulty: entry.difficulty,
    category: entry.categoryId ?? null,
    created: entry.created.toISOString(),
    updated: entry.updated.toISOString()
  }))
)
```

`json`-typed columns return parsed objects as-is. Never leak sensitive columns
(e.g. `users.auth_password_hash`, `authRefreshTokens.token_hash`) into outputs -
select or map only the fields the contract declares.

---

## Migrations

1. Edit/create `schema.drizzle.ts` files.
2. During development, sync the DB directly:

   ```bash
   pnpm db:push
   ```

3. For versioned migrations (production), generate then apply:

   ```bash
   pnpm db:generate   # writes SQL into apps/api/drizzle
   pnpm db:migrate    # applies pending migrations
   ```

The config globs `apps/api/src/lib/**/schema.drizzle.ts` and
`modules/**/schema.drizzle.ts`, so a new module schema is picked up
automatically once it is named `schema.drizzle.ts` and lives under
`server/`. `dotenv` loads `env/.env.local`, which must define
`DATABASE_URL`.

---

## Adding a New Module Table - Checklist

1. Create `modules/<module>/server/schema.drizzle.ts` with `pgTable(...)`
   definition(s). Prefix table names with the module namespace (`module__table`).
2. Export the schema declaration: `tables` (module-namespaced keys) and a
   `relations` callback typed by `RelationsBuilder`:

   ```typescript
   import { type RelationsBuilder } from '@lifeforge/drizzle'

   export const tables = { myModuleEntries }
   export const relations = (_r: RelationsBuilder<typeof tables>) => ({})
   ```

   Use `() => ({})` when the module has no relations.

3. Pass the schema object to the forge builder in `server/forge.ts` - this
   registers it and infers the `db` type:

   ```typescript
   import * as schema from './schema.drizzle'

   const forge = createForgeContractBuilder({ schema })
   ```

4. Write routes using `db.query.*` (CRUD) or `db.select/insert/update/delete`
   (joins/aggregates), deriving input/output with `drizzle-orm/zod`.
5. Add `@lifeforge/drizzle` to the module's `peerDependencies`.
6. Run `pnpm db:push` (dev) or `pnpm db:generate` + `pnpm db:migrate`.
7. Restart the dev server. `initDrizzle()` runs after module discovery; there is
   **no core file to edit**. If `db.query.<table>` is missing, the schema file
   was not imported (or the module failed to load).

---

## File Storage Integration

`core.storage` is typed by the same Drizzle table types. From
`packages/file-storage/src/types.ts`:

```typescript
export type TableKey<TSchema> = Extract<keyof TSchema, string>
export type FieldKey<TSchema, TTable extends TableKey<TSchema>> = /* columns of TTable */

export interface SaveOptions<TSchema, TTable> {
  file: Express.Multer.File | Buffer | 'keep' | 'removed' | null | undefined
  currentKey?: string | null
  table: TTable
  field: FieldKey<TSchema, TTable>
  thumbs?: string[]
}
```

`TableKey` is the key of the table in the relations map, and `FieldKey` is one
of its `$inferSelect` column names. This is why the `forge` builder must be
typed with the relations object - the same `TSchema` flows into
`core.storage.save({ table, field })`, giving compile-time validation that the
table/field pair exists. Example:

```typescript
const bgImageKey = await core.storage.save({
  file,
  currentKey: user.bgImage || undefined,
  table: 'users',
  field: 'bgImage'
})
```

See [`file-storage-sdk.md`](./file-storage-sdk.md) for the full storage API
(providers, key ownership, thumbnails, and runtime validation).

---

## Pitfalls and Rules

- **Registration lives in `forge.ts`.** Pass the schema object to
  `createForgeContractBuilder({ schema })`; `db.query.*` only sees tables
  registered when the module was loaded. Schema files stay pure declarations,
  and there is no central file to keep in sync. (Core registers once in
  `core/drizzle.ts`.)
- **Namespace registry keys.** `db.query.<key>` uses the `tables` object keys,
  which are shared across all modules. Always prefix them with the module name
  (`achievementsEntries`, not `entries`).
- **Use `eq(column, value)` in `select`/`update`/`delete` `.where()`.** The
  object filter syntax (`{ OR: [...] }`, `{ field: { ilike } }`) is for
  `db.query.*` and `TableFilter`, not for builder `.where()`.
- **Convert `Date` to ISO strings** before returning; output schemas declare
  `z.string()` for timestamps.
- **Set `updated` manually** (`updated: new Date()`) on every update - there is
  no automatic trigger.
- **Never expose** password/token/secret columns in route outputs.
- **Do not hand-write migration SQL** unless generated migrations need manual
  adjustment; use `drizzle-kit`.
- **One connection pool**: `postgres(connectionString, { max: 1 })`. Do not
  create additional `drizzle()`/`postgres()` instances in modules - import and
  use the injected `db`.
- **Naming**: namespaced snake_case DB tables, camelCase JS properties,
  explicit snake_case column names, `__` module separator.
- **Keep output schemas JSON-Schema-serializable** (no `z.any()` /
  `.passthrough()`), per
  [`server-dsl-migration.md`](./server-dsl-migration.md).
