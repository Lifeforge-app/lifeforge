# Server DSL Guide

The server DSL is how every module declares its HTTP endpoints. A route is a
**config object** plus a **typed callback**. Everything else - input parsing,
validation, existence checks, auth, encryption, contract generation and response
encoding - is derived from that config.

Routes live in `modules/<module-id>/server/routes/*.ts`; each named export is an
endpoint.

```typescript
export const list = forge
  .query({ ...config })
  .callback(async ({ ...context }) => { ... })
```

`forge.query` is for reads (HTTP `GET`), `forge.mutation` for writes
(`POST`). Both take the same options and both end in `.callback`.

---

## 1. Config reference

| Option           | Type                                  | Default | Notes                                                |
| ---------------- | ------------------------------------- | ------- | ---------------------------------------------------- |
| `description`    | `string`                              | —       | Required. Shown in the generated contract.           |
| `input`          | `{ query?: ZodType, body?: ZodType }` | —       | Validated before the callback.                       |
| `output`         | `OutputDefinition \| 'custom'`        | —       | Required. Success-only status map (see §4).          |
| `media`          | `Record<string, MediaField>`          | `null`  | Multipart file fields (see §6).                      |
| `noAuth`         | `boolean`                             | `false` | Skip authentication.                                 |
| `encrypted`      | `boolean`                             | `true`  | AES-encrypt request/response bodies.                 |
| `isDownloadable` | `boolean`                             | `false` | Adds the `X-LifeForge-Downloadable` header.          |
| `rateLimit`      | `boolean`                             | `true`  | Disable only for high-frequency internal endpoints.  |
| `middlewares`    | `RequestHandler[]`                    | `[]`    | Express handlers that run before the route callback. |

Rules of thumb:

- Leave `noAuth` / `encrypted` alone unless the route is public or must be
  plain-text (file/image streaming, webhooks, third-party callbacks).
- `rateLimit: false` is for machine-to-machine or polling endpoints only.

---

## 2. Callback context

```typescript
.callback(async ({ db, query, body, media, existing, core, response }) => { ... })
```

| Field       | Contents                                                               |
| ----------- | ---------------------------------------------------------------------- |
| `query`     | Parsed `input.query`, typed from its Zod schema.                       |
| `body`      | Parsed `input.body`, typed from its Zod schema.                        |
| `media`     | Parsed multipart fields, typed from `media` config.                    |
| `existing`  | Rows kept by `existsIn(..., { select: true })` (see §5).               |
| `db`        | Module-scoped Drizzle instance.                                        |
| `response`  | Success helpers derived from `output` + universal error helpers (§3).  |
| `core`      | Framework services (storage, AI, tasks, crypto, logging, ...).         |
| `req`/`res` | Raw Express objects (needed only for `output: 'custom'` or downloads). |
| `io`        | Socket.IO server, for progress events.                                 |

`core` exposes:

| Service                                    | Purpose                                       |
| ------------------------------------------ | --------------------------------------------- |
| `core.storage`                             | Save/delete files (`save`, `delete`)          |
| `core.api.fetchAI`                         | AI completion, optionally structured with Zod |
| `core.api.getAPIKey`                       | Read a configured API key                     |
| `core.api.searchLocations`                 | Geocoding search                              |
| `core.media.convertPDFToImage`             | PDF → image                                   |
| `core.media.parseOCR`                      | OCR an image                                  |
| `core.tasks.add` / `core.tasks.update`     | Long-running task pool                        |
| `core.crypto.encrypt` / `decrypt`          | AES helpers                                   |
| `core.validation.checkModulesAvailability` | Is another module installed?                  |
| `core.tempFile`                            | Temp file manager                             |
| `core.logging`                             | Module logger                                 |

---

## 3. Responses

### Success helpers

The helper names come from the keys declared in `output`. You cannot call a
helper you did not declare.

| `output` key | Helper                      | HTTP |
| ------------ | --------------------------- | ---- |
| `OK`         | `response.ok(payload)`      | 200  |
| `CREATED`    | `response.created(payload)` | 201  |
| `ACCEPTED`   | `response.accepted()`       | 202  |
| `NO_CONTENT` | `response.noContent()`      | 204  |

### Error helpers

Available on **every** route, whether or not they appear in `output`:

| Helper                     | HTTP |
| -------------------------- | ---- |
| `response.badRequest(msg)` | 400  |
| `response.unauthorized()`  | 401  |
| `response.forbidden()`     | 403  |
| `response.notFound()`      | 404  |
| `response.conflict()`      | 409  |

Never declare error statuses in `output`; the framework rejects them at the type
level.

### Errors from helpers

`ClientError` (from `@lifeforge/server-utils`) is the escape hatch for code that
has no access to `response` (shared utils, decryption, parsing):

```typescript
throw new ClientError('Unsupported file type', 400)
```

Postgres errors are mapped automatically:

- `23505` unique violation → `409` with the offending column name.
- `23503` foreign-key violation → `404`.

So do not hand-check uniqueness or FK targets just to return a nicer error -
declare `existsIn` for referential integrity (§5) and let the constraint handle
races.

---

## 4. Output contracts

`output` declares **success statuses only**, each mapped to a Zod schema (for
payload statuses) or `true` (for `ACCEPTED` / `NO_CONTENT`).

```typescript
output: {
  OK: noteDto
} // 200 with noteDto
output: {
  CREATED: noteDto
} // 201 with noteDto
output: {
  NO_CONTENT: true
} // 204, no payload
```

### Derive schemas from tables

```typescript
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod'

const noteDto = createSelectSchema(notes)
const noteInputDto = createInsertSchema(notes).pick({
  title: true,
  body: true
})
```

`createSelectSchema` describes a full row; `.pick()`, `.omit()` and `.extend()`
narrow it. Use `createSelectSchema(table).shape.<column>` to reuse a column's
schema (enums, timestamps) without redeclaring it.

### Rules

- **Success only.** Do not list `BAD_REQUEST`, `NOT_FOUND`, etc.
- **JSON-Schema serializable.** No `z.any()`, `z.unknown()`, `z.void()`,
  `z.custom()`, `.passthrough()`, `.transform()`, or `z.function()`.
- **Describe every returned field.** Build the schema explicitly for joins,
  aggregates and external API responses; do not fall back to `z.any()`.
- **Dates stay `z.date()`.** Contract generation renders them as `date-time`
  strings and the framework serializes the `Date` on the wire. Never
  `.toISOString()` in the route or re-declare the column as `z.string()`.
- **Map what you return.** Do not leak sensitive columns (`*_hash`, tokens,
  internal flags).

### Runtime values must be JSON-safe

Zod validates shape, not encodability. `NaN` and `Infinity` serialize to `null`,
so computed numbers (geo coordinates, analytics) can violate the declared
`z.number()` on the client. Guard before responding:

```typescript
if (![lat, lng, altitude].every(Number.isFinite)) {
  return response.ok(EMPTY_RESULT)
}
```

### `output: 'custom'`

Use it when the route writes to the response itself (images, streams, redirects).
`response` helpers are unavailable; set status and body on `res` yourself.

```typescript
export const image = forge
  .query({
    description: 'Render a strip image',
    encrypted: false,
    isDownloadable: true,
    noAuth: true,
    output: 'custom'
  })
  .callback(async ({ res }) => {
    res.type('image/png').send(buffer)
  })
```

---

## 5. Existence checks

Annotate every field that references another record with `forge.existsIn`. The
framework checks them **before** the callback, batched into one `IN (...)` query
per table, and returns a `404` naming the offending field path.

```typescript
input: {
  query: z.object({
    id: forge.existsIn(z.string(), notes)
  })
}
```

- The second argument is the **table object** from `schema.drizzle`, never a
  string.
- Records are matched on the table's primary key, which **must be a single
  `id` column**. Composite or differently-named primary keys throw
  `existsIn requires a single "id" primary key`.
- Optional fields are skipped when absent:
  `forge.existsIn(z.string().optional(), folders)`.
- Array fields check every value:
  `forge.existsIn(z.array(z.string()), tags)`.
- Query and body fields can all be guarded; only one query per table is issued.

### Reading the guarded row

By default the guard only proves existence. Add `{ select: true }` when the
callback needs the row:

```typescript
input: {
  query: z.object({
    id: forge.existsIn(z.string(), notes, { select: true })
  })
}
.callback(async ({ db, query: { id }, existing, response }) => {
  const note = existing.one(notes, id) // typed Note; throws 404 if absent
  ...
})
```

- `existing.one(table, value)` → `InferSelectModel<typeof table>`. `all(table)`
  returns every fetched row for array/`IN` guards.
- The type system only accepts tables the route guarded with
  `{ select: true }`; anything else is a compile error.
- The row was fetched during the guard, so `one()` costs **zero** extra queries.
- `one()` still throws `ClientError(404)` defensively, so it is safe to call
  without an `if (!note)` branch.

### Do not re-check what the guard already proved

```typescript
// ✅ Guard owns existence; the update's returning row is guaranteed.
.callback(async ({ db, query: { id }, body, response }) => {
  const [updated] = await db
    .update(notes)
    .set(body)
    .where(eq(notes.id, id))
    .returning()

  return response.ok(updated!)
})

// ❌ Redundant second lookup + notFound branch after existsIn.
const note = await db.query.notes.findFirst({ where: { id } })

if (!note) {
  return response.notFound()
}
```

Use `!` for rows guaranteed by `existsIn`. Use `response.notFound()` only when
there is **no** guard (e.g. a singleton settings row, an aggregate that may be
empty).

---

## 6. Media and files

Declare multipart fields under `media`:

```typescript
media: {
  cover: { optional: false },
  gallery: { optional: true, multiple: true }
}
```

The callback receives:

| Config                | Type                                |
| --------------------- | ----------------------------------- |
| `{ optional: false }` | `StagedFile \| string`              |
| `{ optional: true }`  | `StagedFile \| string \| undefined` |
| `{ multiple: true }`  | `StagedFile[]`                      |

A `string` means the client sent an **existing file key** (keep it); a
`StagedFile` is a new upload. Branch on `typeof value === 'string'` when the two
must be handled differently.

`StagedFile` gives `originalName`, `mimeType`, `size`, `read()` → `Buffer`,
`stream()` → `Readable`, and `path`.

Commit uploads with `core.storage`:

```typescript
.callback(async ({ media: { cover }, core, db, response }) => {
  if (typeof cover === 'string') {
    return response.badRequest('A new cover is required')
  }

  const ref = await core.storage.save({
    file: cover,
    currentKey: record.cover ?? undefined, // replaces the old file
    thumbs: ['256x0']
  })

  await db.update(notes).set({ cover: ref?.key ?? '' }).where(...)

  return response.ok(ref!)
})
```

`save` also accepts `'keep'`, `'removed'`, `null` and `undefined` as the `file`
value; `'removed'` deletes `currentKey`. Persist `ref.key` - the client fetches
by key. Use `core.storage.delete(key)` to remove a file.

Validate uploads in the callback (extension, size, MIME) before saving.

---

## 7. Input schemas

### Keep them plain

No `.transform()`, `.pipe()` or `.superRefine()`-driven coercion - they are not
JSON-Schema serializable and the contract would lie. Parse in the callback:

```typescript
// ✅ schema
input: {
  query: z.object({ year: z.string(), month: z.string() })
}

// ✅ callback
const year = parseInt(query.year, 10)
const month = parseInt(query.month, 10)
```

Query values always arrive as strings; numbers, booleans and arrays must be
parsed explicitly.

### Reuse DTOs for mutation bodies

```typescript
const noteInputDto = createInsertSchema(notes).pick({
  title: true,
  body: true
})

input: {
  body: noteInputDto.partial()
} // update
input: {
  body: noteInputDto
} // create
```

`.pick()` the exposed fields so clients cannot write ids, timestamps or
server-managed relations.

### Inline single-use schemas

Inline small one-off schemas; extract into a named const only when shared by
several routes or too large to read inline.

---

## 8. Wiring a module

`server/forge.ts` binds the builder to the module schema:

```typescript
import { createForgeContractBuilder } from '@lifeforge/server-utils'

import * as schema from './schema.drizzle'

export type NotesSchema = typeof schema

const forge = createForgeContractBuilder({ schema })

export default forge
```

`server/index.ts` assembles the route groups and generates the client contract:

```typescript
import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import * as noteRoutes from './routes/notes'
import * as tagRoutes from './routes/tags'

const routes = forgeRouter({
  notes: noteRoutes,
  tags: tagRoutes
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
```

Each `forgeRouter` key becomes a namespace on the client: `forgeAPI.notes.list`.

---

## 9. Best practices

**Contracts**

- Treat `output` as a public API: every added field ships to the client.
- Prefer table-derived DTOs; they cannot drift from the schema.
- Deletes return `NO_CONTENT`; creates return `CREATED`; everything else `OK`.

**Callback**

- Callbacks that `await` must be `async` (including one-line arrow functions).
- Destructure only what you use; keep the context signature readable.
- Use `existsIn` + `!` instead of duplicating existence checks.
- Use `.returning()` on updates/deletes when you need the row or want to know it
  existed.
- Return `Date` objects untouched; the framework serializes them.
- Keep database work in the route or a `utils/` helper; keep response shaping in
  the route.

**Queries**

- List endpoints accept `page` / `perPage` as optional strings, clamp them in the
  callback, and return a stable envelope:

  ```typescript
  {
    ;(items, page, perPage, totalItems, totalPages)
  }
  ```

- Search with `ilike(table.name, `%${q}%`)` and guard empty strings.
- Scope every query through the module-scoped `db`; never touch another module's
  tables directly - use `core.validation.checkModulesAvailability` and the other
  module's API instead.

**Errors**

- Expected failures → `response.*` helpers.
- Shared helpers without `response` → `throw new ClientError(message, code)`.
- Never invent status codes; the helper set is closed.

---

## 10. Complete example

```typescript
import { count, desc, eq, ilike } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import forge from '../forge'
import { notes } from '../schema.drizzle'

const noteDto = createSelectSchema(notes)
const noteInputDto = createInsertSchema(notes).pick({
  title: true,
  body: true
})

export const list = forge
  .query({
    description: 'List notes with pagination and search',
    input: {
      query: z.object({
        page: z.string().optional(),
        q: z.string().optional()
      })
    },
    output: {
      OK: z.object({
        items: z.array(noteDto),
        page: z.number(),
        perPage: z.number(),
        totalItems: z.number(),
        totalPages: z.number()
      })
    }
  })
  .callback(async ({ db, query: { page, q }, response }) => {
    const parsedPage = Math.max(1, parseInt(page ?? '1', 10) || 1)
    const perPage = 20
    const where = q ? ilike(notes.title, `%${q}%`) : undefined

    const items = await db
      .select()
      .from(notes)
      .where(where)
      .orderBy(desc(notes.created))
      .limit(perPage)
      .offset((parsedPage - 1) * perPage)

    const [totalRow] = await db
      .select({ value: count() })
      .from(notes)
      .where(where)

    const totalItems = totalRow?.value ?? 0

    return response.ok({
      items,
      page: parsedPage,
      perPage,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage)
    })
  })

export const getById = forge
  .query({
    description: 'Get a note by id',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), notes, { select: true })
      })
    },
    output: { OK: noteDto }
  })
  .callback(async ({ query: { id }, existing, response }) =>
    response.ok(existing.one(notes, id))
  )

export const create = forge
  .mutation({
    description: 'Create a note',
    input: { body: noteInputDto },
    output: { CREATED: noteDto }
  })
  .callback(async ({ db, body, response }) => {
    const [created] = await db.insert(notes).values(body).returning()

    return response.created(created!)
  })

export const update = forge
  .mutation({
    description: 'Update a note',
    input: {
      query: z.object({ id: forge.existsIn(z.string(), notes) }),
      body: noteInputDto.partial()
    },
    output: { OK: noteDto }
  })
  .callback(async ({ db, query: { id }, body, response }) => {
    const [updated] = await db
      .update(notes)
      .set(body)
      .where(eq(notes.id, id))
      .returning()

    return response.ok(updated!)
  })

export const remove = forge
  .mutation({
    description: 'Delete a note',
    input: {
      query: z.object({ id: forge.existsIn(z.string(), notes) })
    },
    output: { NO_CONTENT: true }
  })
  .callback(async ({ db, query: { id }, response }) => {
    await db.delete(notes).where(eq(notes.id, id))

    return response.noContent()
  })
```

---

## 11. Checklist

- [ ] `description` and `output` present; `output` has no error keys.
- [ ] Every payload schema is JSON-Schema serializable; no `z.any()`.
- [ ] Every referenced id/FK uses `forge.existsIn`.
- [ ] `{ select: true }` only on tables the callback actually reads.
- [ ] No `findFirst` + `notFound` immediately after a guard.
- [ ] Deletes return `NO_CONTENT`.
- [ ] Timestamps stay `z.date()`.
- [ ] Mutation bodies `.pick()` only writable fields.
- [ ] Computed numbers are `Number.isFinite` before responding.
- [ ] Async callbacks are `async`.

```

```
