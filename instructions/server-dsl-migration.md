# Server DSL Migration Guide

Migrate routes from the old chaining API to the new object-based DSL.

## Overview

### Old API (chaining)

```typescript
forge
  .query()
  .description('...')
  .noAuth()
  .noEncryption()
  .input({ query: z.object({ ... }) })
  .existenceCheck('query', { id: 'collection' })
  .media({ file: { optional: false } })
  .isDownloadable()
  .statusCode(201)
  .callback(async ({ pb, body, query }) => {
    return result
  })
```

### New API (object)

```typescript
import z from 'zod'

import forge from '../forge'
import { entries } from '../schema.drizzle'

forge
  .query({
    description: '...',
    noAuth: true,
    encrypted: false,
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), entries)
      })
    },
    media: {
      file: { optional: false }
    },
    isDownloadable: true,
    output: {
      OK: z.string(),
      CREATED: z.object({ ... })
    }
  })
  .callback(async ({ db, body, query, response }) => {
    return response.ok(result)
  })
```

## Migration Steps

### 1. Move metadata into the first argument object

All configuration moves inside `query({...})` / `mutation({...})`:

| Old method                        | New property                                   |
| --------------------------------- | ---------------------------------------------- |
| `.description('...')`             | `description: '...'`                           |
| `.noAuth()`                       | `noAuth: true`                                 |
| `.noEncryption()`                 | `encrypted: false`                             |
| `.input({...})`                   | `input: {...}`                                 |
| `.media({...})`                   | `media: {...}`                                 |
| `.isDownloadable()`               | `isDownloadable: true`                         |
| `.statusCode(N)`                  | ❌ Removed - success status comes from the key |
| `.existenceCheck('query', {...})` | Inline `forge.existsIn(...)` in the input (9.) |

### 2. Output is success-only

Every route **must** declare an `output` object with at least one **success**
status key. The status table lives in
`packages/server-utils/src/response/status.ts`:

| Success key  | Code | Payload         |
| ------------ | ---- | --------------- |
| `OK`         | 200  | ✅ `z.schema()` |
| `CREATED`    | 201  | ✅ `z.schema()` |
| `ACCEPTED`   | 202  | ❌ `true`       |
| `NO_CONTENT` | 204  | ❌ `true`       |

**Rules:**

- A payload status → value must be a `z.ZodTypeAny` schema (NEVER `z.any()` or `.passthrough()`)
- A no-payload status → value must be `true`

Error statuses (`BAD_REQUEST`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`,
`CONFLICT`) are **not** declared in `output`. They are provided by the universal
error helpers (see step 6) and will be rejected by the type if you try to list
them.

When the return shape comes from an external API or complex join, define the zod schema explicitly inline or at the top of the file - do NOT fall back to `z.any()`.

### 3. Output data types must be serializable to JSON Schema

Do NOT use `z.custom()`, `z.void()`, `z.undefined()`, `z.unknown()`, `z.any()`, or `z.object({}).passthrough()` - these are not serializable to JSON Schema.

> [!NOTE]
> `z.date()` is the exception: contract generation renders it as a
> `{ type: 'string', format: 'date-time' }` schema, and the framework serializes
> `Date` values to ISO strings on the wire (the client sees `string`). Use
> `z.date()` - not `z.string()` - for timestamp columns in output schemas.

**`z.any()` and `.passthrough()` are ABSOLUTELY PROHIBITED in output schemas.** Every payload status must have an explicitly defined zod schema that accurately describes the return shape.

```typescript
// ❌ Bad - not serializable
output: {
  OK: z.custom<SomeType>(),
  CREATED: z.void()
}

// ✅ Good - use actual zod schema or the schema from the table
output: {
  OK: createSelectSchema(transactionTemplates),
  CREATED: z.object({ id: z.string(), name: z.string() })
}
```

When the output shape matches a database table, derive the schema from it with `createSelectSchema`:

```typescript
output: {
  OK: createSelectSchema(transactionTemplates),
  CREATED: createSelectSchema(transactionTemplates)
}
```

For complex grouped/transformed responses, build the zod schema explicitly:

```typescript
output: {
  OK: z.record(
    z.enum(['income', 'expenses']),
    z.array(createSelectSchema(transactionTemplates))
  )
}
```

For nested external API responses, write the full zod schema matching every field:

````typescript
// ✅ Good - full explicit schema for external API response
const ProjectDetailsSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  downloads: z.number(),
  followers: z.number(),
  icon_url: z.string(),
  // ... every field explicitly typed
})

output: {
  OK: ProjectDetailsSchema
}

// ❌ Bad - z.any() is NOT allowed
output: {
  OK: z.any()  // PROHIBITED
}

> [!WARNING]
> **Runtime values must be JSON-serializable, not just schema-valid.** Zod only
> describes the shape; `NaN`/`Infinity` are not representable in JSON and are
> serialized as `null`. A computed numeric field (e.g. a coordinate returned by
> `satellite.js`) can therefore arrive on the client as `null` even though the
> output says `z.number()`. Guard computed numbers before responding:
>
> ```typescript
> if (![lat, lng, altitude, velocity].every(Number.isFinite)) {
>   return response.ok(EMPTY_RESULT)
> }
> ```
>
> Filter array items the same way, and keep the client defensive
> (`Number.isFinite(value) ? value.toFixed(4) : '—'`).

### 4. Input schemas must be plain - no `.transform()` in zod

`.transform()` is not serializable to JSON Schema. Move all parsing/transformation logic into the business logic:

```typescript
// ❌ Bad - transform in zod
input: {
  query: z.object({
    year: z.string().transform(val => parseInt(val)),
    month: z.string().transform(val => parseInt(val))
  })
}

// ✅ Good - plain string, parse in callback
input: {
  query: z.object({
    year: z.string(),
    month: z.string()
  })
}
// callback
;async ({ query: { year, month } }) => {
  const parsedYear = parseInt(year)
  const parsedMonth = parseInt(month)
  // ...
}
````

For optional fields:

```typescript
input: {
  query: z.object({
    year: z.string().optional(),
    month: z.string().optional()
  })
}
// callback
const parsedYear = year ? parseInt(year) : undefined
```

For complex transforms (like splitting a comma-separated string into an array):

```typescript
input: {
  query: z.object({
    viewFilter: z.string().optional()
  })
}
// callback
const parsedViewFilter: ('income' | 'expenses' | 'transfer')[] =
  viewFilter?.split(',').map(v => v.trim()).filter(t => ['income', 'expenses', 'transfer'].includes(t)) as ...
```

For short single-use input schemas, inline them directly rather than extracting into a named variable:

```typescript
// ✅ Good - inline for single use
input: {
  query: z.object({
    year: z.string(),
    month: z.string()
  })
}
```

Only extract into a named variable when the schema is used by multiple routes (e.g., `ModifyBudgetSchema` used by both `create` and `update`), or when the schema definition is too large. Place it directly above the first call site if used by one route, or at the top of the file if shared by multiple routes.

### 5. Deletion endpoints must use `NO_CONTENT`

For routes that delete a resource, the output must be `NO_CONTENT` (204), not `OK` (200):

```typescript
// ❌ Bad
output: {
  OK: z.void()
}

// ✅ Correct
output: {
  NO_CONTENT: true
}
```

The callback returns `response.noContent()` with no arguments.

### 6. Errors use the universal `response` helpers

Error responses are **not** tied to `output`. The framework exposes five error
helpers on every route, regardless of what `output` declares:

| Response method            | HTTP code |
| -------------------------- | --------- |
| `response.badRequest(msg)` | 400       |
| `response.unauthorized()`  | 401       |
| `response.forbidden()`     | 403       |
| `response.notFound()`      | 404       |
| `response.conflict()`      | 409       |

Return them directly from the callback — do **not** declare the matching status in `output`:

```typescript
// ❌ Old
if (!record) {
  throw new ClientError('Not found', 404)
}
throw new Error('Something went wrong')

// ✅ New
if (!record) {
  return response.notFound()
}
if (taken) {
  return response.conflict()
}
return response.badRequest('Something went wrong')
```

`throw new ClientError(message, code)` is still supported for errors raised inside
helper functions; the framework turns it into the same error response. Use it for
helpers that don't have access to `response` (e.g. `decryptPayload`, `parseQuery`).

Foreign-key violations (`23503`) are automatically surfaced as `404` and unique
violations (`23505`) as `409`, so you don't need to pre-check uniqueness manually.

### 7. Success helpers must match the declared output keys

The success helpers are generated from the keys you declare in `output`. The
method name determines the HTTP status code:

| Output key   | Response method             | HTTP code |
| ------------ | --------------------------- | --------- |
| `OK`         | `response.ok(payload)`      | 200       |
| `CREATED`    | `response.created(payload)` | 201       |
| `ACCEPTED`   | `response.accepted()`       | 202       |
| `NO_CONTENT` | `response.noContent()`      | 204       |

```typescript
// ✅ Correct - NO_CONTENT in output, response.noContent() in callback
output: {
  NO_CONTENT: true
}
// ...
return response.noContent()

// ❌ Wrong - output has NO_CONTENT but callback uses response.ok()
output: {
  NO_CONTENT: true
}
// ...
return response.ok(someValue) // Error!
```

For statuses with a payload (`OK`, `CREATED`), pass the payload as an argument.
For statuses without a payload (`NO_CONTENT`, `ACCEPTED`), call with no arguments.

### 8. Return values wrapped in `response.ok(...)` / `response.created(...)`

```typescript
// ❌ Old
return result

// ✅ New
return response.ok(result)
// or
return response.created(result)
```

### 9. Replace `.statusCode(N)` with the correct success output key

| Old `.statusCode(N)` | New output key |
| -------------------- | -------------- |
| `.statusCode(200)`   | `OK`           |
| `.statusCode(201)`   | `CREATED`      |
| `.statusCode(204)`   | `NO_CONTENT`   |

For `.statusCode(204)`:

- Output Config: `{ NO_CONTENT: true }`
- Return: `return response.noContent()`

### 10. Replace `.existenceCheck(...)` with `forge.existsIn(...)`

Existence checks are now declared **inside the input schema**, on the field that
holds the reference. `forge.existsIn` annotates the field with the target table
(and optionally a column other than the primary key). Before the callback runs,
the framework verifies that every referenced record exists and returns a `404`
with a field-targeted message if any is missing — so `NOT_FOUND` no longer needs
to be declared.

```typescript
// ❌ Old
.existenceCheck('query', { id: 'entries' })

// ✅ New
import { entries, categories, users } from '../schema.drizzle'

input: {
  query: z.object({
    id: forge.existsIn(z.string(), entries)
  })
}
```

Rules:

- The target is the **table object** from `schema.drizzle` — not a string name.
- The checked column defaults to the table's primary key. Pass a column key to
  reference another unique column: `forge.existsIn(z.string(), users, 'email')`.
- Optional fields are skipped when absent:
  `forge.existsIn(z.string().optional(), categories)`.
- Array fields check every value:
  `forge.existsIn(z.array(z.string()), categories)`.
- Multiple checks (query + body, or several fields) are all supported and batched.

```typescript
input: {
  query: z.object({
    id: forge.existsIn(z.string(), transactionTemplates)
  }),
  body: z.object({
    asset: forge.existsIn(z.string(), assets),
    category: forge.existsIn(z.string(), categories)
  })
}
```

### 11. Callbacks that use `await` must be `async`

If the callback body uses `await`, the callback itself must be declared `async`:

```typescript
// ❌ Bad - missing async/await
.callback(({ db, query: { id }, response }) =>
  response.ok(db.query.entries.findFirst({ where: { id } }))
)

// ✅ Good - async with await
.callback(async ({ db, query: { id }, response }) =>
  response.ok(await db.query.entries.findFirst({ where: { id } }))
)
```

This includes one-liner arrow functions that perform async operations - they must use `async`/`await` just like any other async function.

### 12. Get `response` from context destructuring

The `response` helpers object is available in the callback context:

```typescript
// ❌ Old callback
.callback(async ({ db, body }) => { ... })

// ✅ New callback
.callback(async ({ db, body, response }) => { ... })
```

### 13. Use `.pick()` for mutation input bodies

For `create` and `update` mutations, use `.pick()` on the derived insert schema to
explicitly select only the fields the user should provide:

```typescript
import { createInsertSchema } from 'drizzle-orm/zod'

const categoryInputDto = createInsertSchema(categories).pick({
  name: true,
  icon: true,
  color: true
})

input: {
  body: categoryInputDto
}
```

### 14. Remove the `ClientError` import when it becomes unused

After replacing expected `throw new ClientError(...)` with `response.<status>()`,
remove the import. Keep it only where a helper genuinely throws (e.g. payload
decryption or validation utilities).

## Full Example

### Before

```typescript
import { ClientError } from '@lifeforge/server-utils'

import forge from '../forge'

export const list = forge
  .query()
  .description('Get all items')
  .input({})
  .callback(async ({ pb }) => {
    return await pb.getFullList.collection('items').execute()
  })

export const create = forge
  .mutation()
  .description('Create an item')
  .input({
    body: z.object({ name: z.string() })
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => {
    const existing = await pb.getFirstListItem
      .collection('items')
      .filter([{ field: 'name', operator: '=', value: body.name }])
      .execute()
      .catch(() => null)

    if (existing) {
      throw new ClientError('Item already exists', 409)
    }

    return await pb.create.collection('items').data(body).execute()
  })

export const remove = forge
  .mutation()
  .description('Delete an item')
  .input({
    query: z.object({ id: z.string() })
  })
  .existenceCheck('query', { id: 'items' })
  .statusCode(204)
  .callback(async ({ pb, query: { id } }) => {
    await pb.delete.collection('items').id(id).execute()
  })
```

### After

```typescript
import { eq } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-orm/zod'
import z from 'zod'

import forge from '../forge'
import { items } from '../schema.drizzle'

const itemDto = createSelectSchema(items)
const itemInputDto = createInsertSchema(items).pick({ name: true })

export const list = forge
  .query({
    description: 'Get all items',
    output: {
      OK: z.array(itemDto)
    }
  })
  .callback(async ({ db, response }) =>
    response.ok(await db.select().from(items))
  )

export const create = forge
  .mutation({
    description: 'Create an item',
    input: {
      body: itemInputDto
    },
    output: {
      CREATED: itemDto
    }
  })
  .callback(async ({ db, body, response }) => {
    const existing = await db.query.items.findFirst({
      where: { name: body.name }
    })

    if (existing) {
      return response.conflict()
    }

    const [created] = await db.insert(items).values(body).returning()

    return response.created(created)
  })

export const remove = forge
  .mutation({
    description: 'Delete an item',
    input: {
      query: z.object({
        id: forge.existsIn(z.string(), items)
      })
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ db, query: { id }, response }) => {
    await db.delete(items).where(eq(items.id, id))

    return response.noContent()
  })
```
