# File Storage SDK

How to store and serve files from a module. Every forge callback has a
`core.storage` bound to the calling module: you hand it an uploaded file, it
writes bytes to the configured provider (local filesystem or S3) and records
metadata in the shared `files` table. Clients fetch files via `GET /files/get`.

Two entry points:

- **`@lifeforge/file-storage`** — the `core.storage` API, `FileReference`/
  `fileReferenceSchema`, and the provider factory.
- **`@lifeforge/file-storage/server`** — server wiring used by `apps/api`
  (upload middleware, `files` table/store, staging sweep).

---

## Concepts

- **`core.storage`** — scoped to the calling module. It will only read, write,
  or delete keys under `{moduleId}/`, so modules can't touch each other's files.
- **Staging** — an HTTP upload lands in a temp staging area first and is handed
  to your callback as a `StagedFile`, so you can validate or pre-process it
  before committing.
- **Keys** — opaque: `{moduleId}/{uuid}.{ext}`. The original name, mime type,
  size, and thumbnails live in the `files` table, not in the key.
- **`FileReference`** — what `save`/`getReference` return; store its `key` in
  your column and return the whole object from routes.

---

## Configuration

Read from the environment when the provider is created:

```bash
# Provider selection (defaults to local)
FILE_STORAGE_PROVIDER=local|s3

# Local provider (path relative to the project root)
FILE_STORAGE_LOCAL_PATH=./storage

# S3 provider
FILE_STORAGE_S3_BUCKET=my-bucket
FILE_STORAGE_S3_REGION=us-east-1
FILE_STORAGE_S3_ENDPOINT=https://s3.amazonaws.com   # optional (MinIO/R2)
FILE_STORAGE_S3_ACCESS_KEY=...
FILE_STORAGE_S3_SECRET_KEY=...
FILE_STORAGE_S3_FORCE_PATH_STYLE=false               # MinIO compatibility
```

In-flight uploads are staged in `<FILE_STORAGE_LOCAL_PATH>/.staging`
(`./storage/.staging` by default).

---

## Uploading

Declare the file fields on the route with `media`. The callback receives each
as a `StagedFile`:

```typescript
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
      thumbs: ['256x0'] // image thumbnails (optional)
    })

    await db.update(users).set({ avatar: ref?.key ?? null })

    return response.ok(ref)
  })
```

### The `StagedFile`

- `file.originalName`, `file.mimeType`, `file.size`
- `await file.read()` → `Buffer`
- `file.stream()` → `Readable`
- `file.path` → absolute temp path (in-process convenience)

Use these to validate (e.g. extension/type checks) or pre-process (resize,
parse, OCR, transcode) before committing.

### `save` state machine

| `file` value         | Effect                                              |
| -------------------- | --------------------------------------------------- |
| a `StagedFile`       | writes a new file; deletes `currentKey` if provided |
| `'keep'`             | keeps `currentKey` as-is                            |
| `'removed'`          | deletes `currentKey`                                |
| `null` / `undefined` | same as `'keep'`                                    |

`save` returns a `FileReference` (or `null`). Always persist `ref.key` in your
column — the key is what the client fetches by.

`thumbs` are generated only for images (non-SVG) and returned in
`ref.thumbs`.

---

## Serving files

Return a `FileReference` from any route that exposes a file. Use the shared
schema so the contract and client types stay in sync:

```typescript
import { fileReferenceSchema } from '@lifeforge/file-storage'

const output = {
  OK: z.object({ file: fileReferenceSchema })
}
```

On the client, build a URL with the API helper:

```typescript
forgeAPI.getMedia({ key: ref.key, thumb: '256x0' })
// => '<apiHost>/files/get?key=...&thumb=256x0'
```

### `GET /files/get`

- `?key=<key>&thumb=<size>&download=<bool>`
- **Public** (no auth) — access is gated only by the opaque key. Keys are
  `{moduleId}/{uuid}.{ext}` and effectively unguessable.
- Streams the file or thumbnail with the correct `Content-Type`,
  `Content-Disposition`, and immutable cache headers.
- Returns **404 unless the key is registered** in the `files` table.

---

## `FileReference`

```typescript
interface FileReference {
  key: string
  originalName: string
  mimeType: string
  size: number
  thumbs: { size: string; key: string; width: number; height: number }[]
}
```

The client-side `FileReference` type is exported from `@lifeforge/api`, and
form file fields map it to an `existing` value via
`getFormFileFieldInitialData`.

---

## Reading and deleting

```typescript
const ref = await core.storage.getReference(key) // FileReference | null
const file = await core.storage.get(key, { thumb: '256x0' }) // { stream, mimeType, size } | null
await core.storage.delete(key)
```

All three are scoped to the calling module.

---

## Migrating PocketBase files

Migration scripts fetch files from the running PocketBase and store them through
the SDK, which generates the key, thumbnails, and `files` row:

```typescript
const storage = createModuleStorage(info.storageId, db)

const key = await migrateFileField({
  storage,
  pbCollection: 'users',
  recordId: pbRow.id,
  filename: pbRow.avatar,
  thumbs: ['256x0']
})
```

See the `database-migration` skill and `apps/api/scripts/migrations/` for the
full workflow.

---

## Behavior notes

- Staged temp files are deleted when committed, and any leftovers are reclaimed
  by a TTL sweep on boot.
- Replacing a file deletes the previous object immediately. Consistent with the
  usual object-storage model, a failed request can therefore leave an orphaned
  object (or a briefly-missing replaced file); this is accepted, not
  reconciled.
