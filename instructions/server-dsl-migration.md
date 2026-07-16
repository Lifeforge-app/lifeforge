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
forge
  .query({
    description: '...',
    noAuth: true,
    encrypted: false,
    input: {
      query: z.object({ ... })
    },
    existenceCheck: {
      query: { id: 'collection' }
    },
    media: {
      file: { optional: false }
    },
    isDownloadable: true,
    output: {
      OK: z.string(),
      CREATED: z.object({ ... }),
      BAD_REQUEST: z.string(),
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, body, query, response }) => {
    return response.ok(result)
  })
```

## Migration Steps

### 1. Move metadata into the first argument object

All configuration moves inside `query({...})` / `mutation({...})`:

| Old method                        | New property                              |
| --------------------------------- | ----------------------------------------- |
| `.description('...')`             | `description: '...'`                      |
| `.noAuth()`                       | `noAuth: true`                            |
| `.noEncryption()`                 | `encrypted: false`                        |
| `.input({...})`                   | `input: {...}`                            |
| `.media({...})`                   | `media: {...}`                            |
| `.isDownloadable()`               | `isDownloadable: true`                    |
| `.statusCode(N)`                  | ❌ Removed - status comes from output key |
| `.existenceCheck('query', {...})` | `existenceCheck: { query: {...} }`        |

When there were multiple `.existenceCheck()` calls in the old API (e.g. one for `query` and one for `body`), merge them into a single `existenceCheck` object:

```typescript
// ❌ Old
.existenceCheck('query', { id: 'transaction_templates' })
.existenceCheck('body', { asset: 'assets', category: 'categories' })

// ✅ New
existenceCheck: {
  query: { id: 'transaction_templates' },
  body: { asset: 'assets', category: 'categories' }
}
```

### 2. Add `output` configuration

Every route **must** declare an `output` object with at least one status key. The available status keys and their HTTP status codes are defined in `packages/lifeforge-server-utils/src/utils/outputStatus.ts`:

| Status         | Code | Has Payload     |
| -------------- | ---- | --------------- |
| `OK`           | 200  | ✅ `z.schema()` |
| `CREATED`      | 201  | ✅ `z.schema()` |
| `ACCEPTED`     | 202  | ❌ `true`       |
| `NO_CONTENT`   | 204  | ❌ `true`       |
| `BAD_REQUEST`  | 400  | ✅ `z.string()` |
| `UNAUTHORIZED` | 401  | ❌ `true`       |
| `FORBIDDEN`    | 403  | ❌ `true`       |
| `NOT_FOUND`    | 404  | ❌ `true`       |
| `CONFLICT`     | 409  | ❌ `true`       |

**Rules:**

- If `hasPayload: true` → value must be a `z.ZodTypeAny` schema (NEVER `z.any()` or `.passthrough()`)
- If `hasPayload` is absent → value must be `true`
- `BAD_REQUEST` payload is `z.string()` (error message)

When the return shape comes from an external API or complex join, define the zod schema explicitly inline or at the top of the file - do NOT fall back to `z.any()`.

### 3. Output data types must be serializable to JSON Schema

Do NOT use `z.custom()`, `z.void()`, `z.undefined()`, `z.unknown()`, `z.any()`, or `z.object({}).passthrough()` - these are not serializable to JSON Schema.

**`z.any()` and `.passthrough()` are ABSOLUTELY PROHIBITED in output schemas.** Every status key with a payload must have an explicitly defined zod schema that accurately describes the return shape.

```typescript
// ❌ Bad - not serializable
output: {
  OK: z.custom<SomeType>(),
  CREATED: z.void()
}

// ✅ Good - use actual zod schema or the schema from cleanSchemas
output: {
  OK: walletSchemas.transaction_templates,
  CREATED: z.object({ id: z.string(), name: z.string() })
}
```

When the output shape matches a database collection schema, use the schema directly from `cleanSchemas`:

```typescript
output: {
  OK: walletSchemas.transaction_templates,
  CREATED: walletSchemas.transaction_templates
}
```

For complex grouped/transformed responses, build the zod schema explicitly:

```typescript
output: {
  OK: z.record(
    z.enum(['income', 'expenses']),
    z.array(walletSchemas.transaction_templates)
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
  OK: z.void(),
  NOT_FOUND: true
}

// ✅ Correct
output: {
  NO_CONTENT: true,
  NOT_FOUND: true
}
```

The callback returns `response.noContent()` with no arguments.

### 6. Replace `throw new ClientError(...)` / `throw new Error(...)`

Instead of throwing errors, use `response.<status>()` and return it:

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
return response.badRequest('Something went wrong')
```

Each `response.<status>()` corresponds to an output key declared in the config. If the status has a payload, pass the payload as an argument; otherwise call it with no arguments.

### 7. The response helper must match an output key

Each `response.<method>()` call must correspond to a key declared in the `output` object. The method name determines which HTTP status code is returned:

| Output key     | Response method             | HTTP code |
| -------------- | --------------------------- | --------- |
| `OK`           | `response.ok(payload)`      | 200       |
| `CREATED`      | `response.created(payload)` | 201       |
| `ACCEPTED`     | `response.accepted()`       | 202       |
| `NO_CONTENT`   | `response.noContent()`      | 204       |
| `BAD_REQUEST`  | `response.badRequest(msg)`  | 400       |
| `UNAUTHORIZED` | `response.unauthorized()`   | 401       |
| `FORBIDDEN`    | `response.forbidden()`      | 403       |
| `NOT_FOUND`    | `response.notFound()`       | 404       |
| `CONFLICT`     | `response.conflict()`       | 409       |

```typescript
// ✅ Correct - NO_CONTENT in output, response.noContent() in callback
output: { NO_CONTENT: true, NOT_FOUND: true }
// ...
return response.noContent()

// ❌ Wrong - output has NO_CONTENT but callback uses response.ok()
// This will cause a runtime error because the response type doesn't match
output: { NO_CONTENT: true }
// ...
return response.ok(someValue)  // Error!
```

For statuses with a payload (OK, CREATED, BAD_REQUEST), pass the payload as an argument. For statuses without a payload (NO_CONTENT, NOT_FOUND, etc.), call with no arguments.

### 8. Wrap return values in `response.ok(...)` / `response.created(...)`

```typescript
// ❌ Old
return result

// ✅ New
return response.ok(result)
// or
return response.created(result)
```

### 8. Replace `.statusCode(N)` with the correct output key

| Old `.statusCode(N)` | New output key |
| -------------------- | -------------- |
| `.statusCode(200)`   | `OK`           |
| `.statusCode(201)`   | `CREATED`      |
| `.statusCode(204)`   | `NO_CONTENT`   |

For `.statusCode(204)`:

- Output Config: `{ NO_CONTENT: true }`
- Return: `return response.noContent()`

### 9. Use `existenceCheck` with the same format as the new API

```typescript
// ❌ Old
.existenceCheck('query', { id: 'entries' })

// ✅ New
existenceCheck: {
  query: { id: 'entries' }
}
```

`NOT_FOUND` must be declared in the output when `existenceCheck` is present:

```typescript
output: {
  OK: z.string(),
  NOT_FOUND: true
}
```

### 10. Callbacks that use `await` must be `async`

If the callback body uses `await` (e.g. awaiting a PocketBase call), the callback itself must be declared `async`:

```typescript
// ❌ Bad - missing async/await
.callback(({ pb, query: { id }, response }) =>
  response.ok(pb.getOne.collection('calendars').id(id).execute())
)

// ✅ Good - async with await
.callback(async ({ pb, query: { id }, response }) =>
  response.ok(await pb.getOne.collection('calendars').id(id).execute())
)
```

This includes one-liner arrow functions that perform async operations - they must use `async`/`await` just like any other async function.

### 11. Get `response` from context destructuring

The `response` helpers object is available in the callback context:

```typescript
// ❌ Old callback
.callback(async ({ pb, body }) => { ... })

// ✅ New callback
.callback(async ({ pb, body, response }) => { ... })
```

### 11. Use `.pick()` for mutation input bodies

For `create` and `update` mutations, use `.pick()` on the schema to explicitly select only the fields the user should provide:

```typescript
input: {
  body: walletSchemas.categories.pick({
    name: true,
    icon: true,
    color: true,
    type: true
  })
}
```

### 12. Remove `ClientError` import

After replacing all `throw new ClientError(...)`, the `ClientError` import can be removed.

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
import forge from '../forge'

export const list = forge
  .query({
    description: 'Get all items',
    output: {
      OK: z.array(
        z.object({
          id: z.string(),
          name: z.string()
        })
      )
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(await pb.getFullList.collection('items').execute())
  )

export const create = forge
  .mutation({
    description: 'Create an item',
    input: {
      body: z.object({ name: z.string() })
    },
    output: {
      CREATED: z.object({
        id: z.string(),
        name: z.string()
      }),
      CONFLICT: true
    }
  })
  .callback(async ({ pb, body, response }) => {
    const existing = await pb.getFirstListItem
      .collection('items')
      .filter([{ field: 'name', operator: '=', value: body.name }])
      .execute()
      .catch(() => null)

    if (existing) {
      return response.conflict()
    }

    return response.created(
      await pb.create.collection('items').data(body).execute()
    )
  })

export const remove = forge
  .mutation({
    description: 'Delete an item',
    input: {
      query: z.object({ id: z.string() })
    },
    existenceCheck: {
      query: { id: 'items' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('items').id(id).execute()

    return response.noContent()
  })
```
