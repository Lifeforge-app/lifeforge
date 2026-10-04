# Drizzle SDK Guide

How to define tables, relations, and queries on the LifeForge server with
Drizzle ORM (`drizzle-orm@1.0.0-rc.4`) and the `postgres-js` driver. This is a
**usage** guide for module/core authors; implementation lives in the source of
`@lifeforge/drizzle` and `@lifeforge/server-utils`.

For file uploads see [`file-storage-sdk.md`](./file-storage-sdk.md); for the
route DSL see [`server-dsl-migration.md`](./server-dsl-migration.md).

---

## Overview

- Each module declares its tables in `server/schema.drizzle.ts` and registers
  them by passing the schema to the forge builder in `server/forge.ts`
  (`createForgeContractBuilder({ schema })`).
- Route callbacks receive a fully-typed `db` (and `core`) scoped to the module's
  schema. You never build your own `drizzle()`/`postgres()` client — use the
  injected `db`.
- Use the **relational API** (`db.query.*`) for CRUD, and the **SQL builder**
  (`db.select/insert/update/delete`) for joins and aggregates.

```typescript
const entries = await db.query.entries.findMany({
  where: { difficulty: 'hard' },
  orderBy: { created: 'desc' }
})
```

### Packages and scripts

| Package              | Role                                                                  |
| -------------------- | --------------------------------------------------------------------- |
| `drizzle-orm`        | schema, relations, query builder, zod                                 |
| `drizzle-kit`        | push / generate / migrate (dev)                                       |
| `postgres`           | `postgres-js` driver                                                  |
| `@lifeforge/drizzle` | LifeForge glue (table namespacing, schema composition, query scoping) |

`drizzle-orm` is imported directly (`pgTable`, `eq`, `sql`, `defineRelations`,
`RelationsBuilder`, `PostgresJsDatabase`, ...); zod-derived schemas come from
`drizzle-orm/zod` (`createSelectSchema`, `createInsertSchema`).
`@lifeforge/drizzle` only exports LifeForge-owned helpers — `createModuleTable`,
`defineModuleSchema`, `composeRelations`, `scopeDbForModule`, `ModuleSchema`,
`BuiltModuleSchema`.

```bash
pnpm db:push      # push schema straight to the DB (development)
pnpm db:generate  # generate SQL migration files into apps/api/drizzle
pnpm db:migrate   # apply generated migrations
```

---

## Defining Tables (`schema.drizzle.ts`)

Import table builders from `drizzle-orm/pg-core`. A schema file exports the
tables and a `relations` callback.

```typescript
// modules/lifeforge--achievements/server/schema.drizzle.ts
import { pgEnum, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

import { createModuleTable } from '@lifeforge/drizzle'

// Auto-prefixes DB table names with the calling module's namespace
// (`achievements__categories`), so declare bare names below.
const pgTable = createModuleTable()

export const difficultyEnum = pgEnum('difficulty', [
  'easy',
  'medium',
  'hard',
  'impossible'
])

export const achievementsCategories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  color: varchar('color', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 255 }).notNull()
})

export const achievementsEntries = pgTable('entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  thoughts: text('thoughts').notNull(),
  difficulty: difficultyEnum('difficulty').notNull(),
  category_id: uuid('category_id').references(() => achievementsCategories.id),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull(),
  updated: timestamp('updated', { mode: 'date' }).defaultNow().notNull()
})

export const tables = {
  categories: achievementsCategories,
  entries: achievementsEntries
}
```

### Conventions

- **Table names are auto-namespaced.** Use `const pgTable = createModuleTable()`
  and declare **bare** names (`pgTable('entries', ...)`) - the helper prefixes
  them with the calling module's namespace (`achievements__entries`). Keep the
  `tables` keys bare too (`entries`, not `achievementsEntries`) so
  `db.query.entries` resolves.
- **JS property names use snake_case, matching the DB column.** Pass the column
  name explicitly: `category_id: uuid('category_id')`. (camelCase JS keys were
  the previous convention; snake_case is now the default.)
- **IDs**: `uuid('id').defaultRandom().primaryKey()`.
- **Timestamps**: `timestamp('created', { mode: 'date' }).defaultNow().notNull()`.
  They deserialize to `Date`. Return them as-is from routes — output schemas
  declare `z.date()`, and the framework serializes them to ISO strings on the
  wire (see [Output Serialization](#output-serialization)).
- **Foreign keys**: `.references(() => target.id)` creates the DB constraint.
  It does not power `db.query` relations — those need an entry in the
  `relations` callback (below).
- **Enums** use `pgEnum(...)`; **JSON** uses `json('col').$type<T>()`.
- Nullable columns omit `.notNull()`; unique columns add `.unique()`.

---

## Defining Relations

Relations are declared once, in the schema file, and registered when the module
passes its schema to the forge builder.

```typescript
// modules/lifeforge--achievements/server/schema.drizzle.ts
import { type RelationsBuilder } from 'drizzle-orm'
import { ... } from 'drizzle-orm/pg-core'

import { createModuleTable } from '@lifeforge/drizzle'

const pgTable = createModuleTable()

export const achievementsCategories = pgTable('categories', { ... })
export const achievementsEntries = pgTable('entries', { ... })

export const tables = {
  categories: achievementsCategories,
  entries: achievementsEntries
}

export const relations = (r: RelationsBuilder<typeof tables>) => ({
  categories: {
    entries: r.many.entries()
  },
  entries: {
    category: r.one.categories({
      from: r.entries.category_id,
      to: r.categories.id
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

`createForgeContractBuilder` (aliased `createForge`) takes a single config
object: `{ schema?, moduleId?, modulePathAlias? }`. Passing `schema` registers
the tables/relations and infers the module's `db` type, so callbacks get
`db.query.<moduleTable>` typed. Modules without a schema use `createForge({})`;
core libs pass an explicit generic
(`createForgeContractBuilder<CoreRelations>({ moduleId: 'user' })`).

`r.one.targetTable({ from, to })` / `r.many.targetTable()` are the relation
builders: `from` is the column on the source table, `to` is the column on the
target.

### Many-to-many and optional relations

```typescript
// many-to-many via a junction table
r.many.posts({
  from: r.users.id.through(r.usersToPosts.userId),
  to: r.posts.id.through(r.usersToPosts.postId)
})

// one relation that may be null
r.one.profiles({ from: r.users.id, to: r.profiles.userId })
```

`r.one` is treated as nullable in results unless configured otherwise. A
nullable FK (`category_id: uuid('category_id').references(...)` without
`.notNull()`) should always get a matching optional `r.one`.

---

## Querying: Relational Query API (`db.query`)

The default for CRUD. Fully typed from the registered relations; supports
`where`, `columns`, `orderBy`, `limit`, `offset`, `with`, `extras`.

```typescript
const user = await db.query.users.findFirst({ where: { id: userId } })

const entries = await db.query.entries.findMany({
  orderBy: { created: 'desc' }
})
```

### `where` object syntax

The `where` object accepts equality by default and nested operators:

```typescript
where: {
  id: category
}
where: {
  id: {
    ne: currentId
  }
}
where: {
  title: {
    ilike: `%${query}%`
  }
}
where: {
  OR: [
    { title: { ilike: `%${query}%` } },
    { thoughts: { ilike: `%${query}%` } }
  ]
}
where: {
  AND: [{ difficulty }, { category_id: category }]
}
where: filters.length > 0 ? { AND: filters } : undefined // empty => no filter
```

### Building filters incrementally with `TableFilter`

```typescript
import { type TableFilter } from 'drizzle-orm'

const filters: TableFilter<typeof achievementsEntries>[] = [
  ...(difficulty ? [{ difficulty }] : []),
  ...(category ? [{ category_id: category }] : []),
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

const result = await db.query.entries.findMany({
  where: filters.length > 0 ? { AND: filters } : undefined,
  orderBy: { created: 'desc' }
})
```

### Selecting a subset of columns / eager loading

```typescript
const rows = await db.query.entries.findMany({
  columns: { id: true, title: true, difficulty: true },
  with: { category: true }, // loads the related `one` relation
  orderBy: { created: 'desc' },
  limit: 20,
  offset: 0
})
```

`with` is only available for relations declared in the `relations` callback.

### Operator reference

`eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `notLike`, `notIlike`,
`inArray`, `notInArray`, `isNull`, `isNotNull`, `between`, `notBetween`,
`exists`, `notExists`, `and`, `or`, `not`, array helpers
(`arrayContains`, `arrayContained`, `arrayOverlaps`) and `sql`. `AND`/`OR`/`NOT`
are built into the object filter syntax.

---

## Querying: SQL-Style Query Builder

For joins, aggregations, and anything the relational API does not express:
`db.select()`, `db.insert()`, `db.update()`, `db.delete()`.

### `select` with joins and aggregates

```typescript
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
    eq(achievementsCategories.id, achievementsEntries.category_id)
  )
  .groupBy(achievementsCategories.id)
```

`sql<number>` interpolates columns safely; `CAST(... AS INTEGER)` + `.mapWith(Number)`
is needed because Postgres `COUNT(*)` comes back as `bigint` (a string).

### `insert` with `returning`

```typescript
const [entry] = await db
  .insert(apiKeysEntries)
  .values({ keyId, name, icon, exposable, key: encryptedKey })
  .returning() // all columns; pass { id: true } etc. to narrow
```

### `update` with `eq` and `returning`

```typescript
const [updated] = await db
  .update(achievementsEntries)
  .set({ title: body.title, updated: new Date() })
  .where(eq(achievementsEntries.id, id))
  .returning()
```

Use `eq(column, value)` (and friends) in builder `.where()` — the object filter
syntax is for `db.query.*` / `TableFilter`, not the builder. Set `updated`
manually (`new Date()`); there is no DB trigger.

### `delete` with `returning`

```typescript
const [deleted] = await db
  .delete(achievementsEntries)
  .where(eq(achievementsEntries.id, id))
  .returning()
```

Prefer `forge.existsIn(...)` (below) over `.returning()`-based existence checks.

---

## Zod Integration (DTOs)

`drizzle-orm/zod` derives Zod schemas from tables, keeping DTOs in sync. Use
`createSelectSchema` (reads) and `createInsertSchema` (writes), then `.pick()`,
`.omit()`, `.extend()`.

```typescript
// modules/lifeforge--achievements/server/routes/entries.ts
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import { achievementsEntries } from '../schema.drizzle'

const entryDifficultyDto =
  createSelectSchema(achievementsEntries).shape.difficulty

const entryDto = createSelectSchema(achievementsEntries)
  .omit({ category_id: true })
  .extend({
    difficulty: entryDifficultyDto,
    category: z.string().optional().nullable()
  })

const entryInputDto = createInsertSchema(achievementsEntries)
  .pick({ title: true, thoughts: true, difficulty: true })
  .extend({ category: z.string().optional().nullable() })
```

Then use them in the DSL (output is **success-only**):

```typescript
output: {
  OK: z.array(entryDto)
}
input: {
  body: entryInputDto
}
```

### Rules and gotchas

- **Leave timestamp columns as `z.date()`** in output schemas. Don't override
  them to `z.string()`, and don't call `.toISOString()` in the route: contract
  generation renders `z.date()` as a `date-time` string and the framework
  serializes the value to ISO on the wire (client sees `string`).
- **`.pick()` the exposed fields** for mutation bodies so clients cannot set
  server-managed columns (ids, timestamps, relation keys).
- **Output contracts are success-only** and JSON-Schema-serializable: no
  `z.any()`, `.passthrough()`, `z.custom()`, `z.void()`, `z.unknown()`. See
  [`server-dsl-migration.md`](./server-dsl-migration.md).
- **Enums**: reuse `createSelectSchema(table).shape.<enumCol>` instead of
  re-declaring the union.
- **Plain row types**: `typeof table.$inferSelect` / `$inferInsert` when a Zod
  schema is overkill.

---

## Output Serialization

`db` returns `Date` objects for timestamp columns, and DTOs keep them as
`z.date()`. Return the values untouched — the framework JSON-serializes `Date`
to an ISO string on the wire, and the generated client contract types the field
as `string`. Don't hand-convert:

```typescript
return response.ok(
  result.map(entry => ({
    id: entry.id,
    title: entry.title,
    thoughts: entry.thoughts,
    difficulty: entry.difficulty,
    category: entry.category_id ?? null,
    created: entry.created,
    updated: entry.updated
  }))
)
```

Map only the fields the contract declares. Never leak sensitive columns
(`users.auth_password_hash`, token hashes).

---

## Existence Checks and Errors

- **Referenced records**: annotate the input field with `forge.existsIn`. The
  framework verifies it before the callback and returns a `404` if missing.

  ```typescript
  import { achievementsCategories } from '../schema.drizzle'

  input: {
    body: z.object({
      category: forge.existsIn(
        z.string().optional().nullable(),
        achievementsCategories
      )
    })
  }
  ```

- **Errors**: return the universal `response.*` helpers
  (`badRequest`/`unauthorized`/`forbidden`/`notFound`/`conflict`) — they are not
  declared in `output`. Unique violations (`23505`) map to `409` and FK
  violations (`23503`) to `404` automatically; don't pre-check uniqueness by hand.

---

## Migrations

1. Edit/create `schema.drizzle.ts` files.
2. During development, sync the DB directly: `pnpm db:push`.
3. For versioned migrations: `pnpm db:generate` then `pnpm db:migrate`.

The drizzle config globs every `schema.drizzle.ts` under `apps/api/src/lib/**`
and `modules/**/server`, plus the file-storage schema
(`packages/file-storage/src/server/metadata/schema.drizzle.ts`). `dotenv` loads
`env/.env.local`, which must define `DATABASE_URL`.

---

## Adding a New Module Table — Checklist

1. Create `modules/<module>/server/schema.drizzle.ts` with `pgTable(...)`
   definition(s), namespacing table names (`module__table`).
2. Export `tables` (module-namespaced keys) and a `relations` callback:

   ```typescript
   import { type RelationsBuilder } from 'drizzle-orm'

   export const tables = { myModuleEntries }
   export const relations = (_r: RelationsBuilder<typeof tables>) => ({})
   ```

   Use `() => ({})` when there are no relations.

3. Register it in `server/forge.ts`:

   ```typescript
   import * as schema from './schema.drizzle'

   const forge = createForgeContractBuilder({ schema })
   ```

4. Write routes with `db.query.*` (CRUD) or `db.select/insert/update/delete`
   (joins/aggregates), deriving DTOs with `drizzle-orm/zod`.
5. Run `pnpm db:push` (dev) or `pnpm db:generate` + `pnpm db:migrate`.
6. Restart the dev server — module schemas register automatically; there is no
   central file to edit. If `db.query.<table>` is missing, the schema file was
   not imported (or the module failed to load).

---

## File Storage Integration

`core.storage` handles uploads against the `media` fields declared on the route.
The callback receives each file as a `StagedFile`:

```typescript
import { fileReferenceSchema } from '@lifeforge/file-storage'

export const updateAvatar = forge
  .mutation({
    input: {},
    media: { file: { optional: false } },
    output: { OK: fileReferenceSchema }
  })
  .callback(async ({ media: { file }, core, db, response }) => {
    const record = await db.query.users.findFirst()

    const ref = await core.storage.save({
      file,
      currentKey: record?.avatar ?? undefined, // replace the previous file
      thumbs: ['256x0'] // regenerate thumbnails (optional)
    })

    await db.update(users).set({ avatar: ref?.key ?? null })

    return response.ok(ref)
  })
```

Other `core.storage` methods: `getReference(key)` (metadata),
`get(key, { thumb })` (server-side stream), `delete(key)`. The client fetches
via `forgeAPI.getMedia({ key, thumb })`, served at `/files/get?key=&thumb=`.

See [`file-storage-sdk.md`](./file-storage-sdk.md) for the full API.

---

## Pitfalls and Rules

- **Registration lives in `forge.ts`.** `db.query.*` only sees tables registered
  when the module was loaded. Pass the schema to `createForgeContractBuilder({ schema })`.
- **Keep `tables` keys bare** (`entries`); `createModuleTable()` handles the
  DB-name namespace prefix.
- **Use `eq(column, value)` in builder `.where()`**, not the object filter syntax.
- **Return `Date` objects as-is**; output schemas keep `z.date()` and the
  framework serializes them to ISO strings for the client. Never override
  timestamp columns to `z.string()` or call `.toISOString()` in a route.
- **Set `updated` manually** on every update — there is no trigger.
- **Never expose** password/token/secret columns in outputs.
- **One connection pool**: don't create additional `drizzle()`/`postgres()`
  instances in modules — use the injected `db`.
- **Keep output schemas success-only and JSON-Schema-serializable.**
