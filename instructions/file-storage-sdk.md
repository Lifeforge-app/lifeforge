# File Storage SDK

**Status**: Implemented (`packages/file-storage/`)

A pluggable file storage layer for LifeForge, replacing PocketBase's built-in
file fields. Files are stored under deterministic, module-owned keys, with
optional thumbnails, and served through a single `GET /files` endpoint.
Providers: local filesystem and S3-compatible.

---

## Package layout

```
packages/file-storage/
└── src/
    ├── index.ts            # public exports
    ├── types.ts            # StorageProvider, SaveOptions, TableKey/FieldKey, ...
    ├── utils.ts            # generateKey, generateThumbKey, resizeImage (sharp)
    ├── fileStorage.ts      # FileStorage<TSchema> (validation + key logic + thumbs)
    ├── createProvider.ts   # env-driven provider factory
    └── providers/
        ├── local.ts        # LocalStorageProvider
        └── s3.ts           # S3StorageProvider (@aws-sdk/client-s3)
```

Public exports (`index.ts`): `StorageProvider` (type), `generateThumbKey`,
`LocalStorageProvider`, `S3StorageProvider`, `createProvider`, `FileStorage`.

---

## Configuration

Environment variables, read by `createProvider()`:

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

The provider is a process-wide singleton:

```typescript
// apps/api/src/core/storage.ts
import { type StorageProvider, createProvider } from '@lifeforge/file-storage'

export const storageProvider: StorageProvider = createProvider()
```

---

## Types (`types.ts`)

```typescript
export interface FileStream {
  stream: Readable
  mimeType: string
  size: number
}

export interface StorageProvider {
  save(
    key: string,
    data: Buffer | Readable,
    options?: { mimeType?: string; size?: number }
  ): Promise<void>
  get(key: string, options?: { thumb?: string }): Promise<FileStream | null>
  delete(key: string): Promise<void>
  exists(key: string): Promise<boolean>
}

export type DrizzleTableColumns<TTable> = /* columns of a Drizzle table */
export type TableKey<TSchema> = Extract<keyof TSchema, string>
export type FieldKey<TSchema, TTable extends TableKey<TSchema>> =
  DrizzleTableColumns<TSchema[TTable]>

export interface SaveOptions<
  TSchema extends Record<string, unknown> = Record<string, unknown>,
  TTable extends TableKey<TSchema> = TableKey<TSchema>
> {
  file: Express.Multer.File | Buffer | 'keep' | 'removed' | null | undefined
  currentKey?: string | null
  table: TTable
  field: FieldKey<TSchema, TTable>
  thumbs?: string[]
}
```

`TSchema` is the module's Drizzle relations type (the same type bound to the
`forge` builder). `table` is a relation-map key and `field` a column of that
table, so both are autocompleted and runtime-checked.

---

## `FileStorage<TSchema>`

```typescript
import { FileStorage } from '@lifeforge/file-storage'

new FileStorage(provider, module, schemas?, logger?)
```

- `provider` - the singleton `StorageProvider`.
- `module` - `{ source?: string; id: string }`; `id` is the module id used as the
  key prefix (`lifeforge--<module>` for federation modules, or the core lib name).
- `schemas?` - the module's relations object for runtime validation. When empty,
  validation is skipped.
- `logger?` - optional logger for warnings.

### `save(options): Promise<string | null>`

Saves a file and returns its **storage key** (or `null` on failure).

```typescript
const key = await core.storage.save({
  file, // Multer file | Buffer | 'keep' | 'removed' | null
  currentKey: existing?.avatar ?? undefined,
  table: 'users',
  field: 'avatar',
  thumbs: ['256x0']
})
```

Behaviour:

- `file === 'keep'` → returns `currentKey` unchanged.
- `file === 'removed'` → deletes `currentKey` (if any) and returns `null`.
- `file` falsy → returns `currentKey` unchanged.
- Otherwise: validates `table`/`field`, deletes `currentKey` (replacement),
  writes the file, generates thumbnails, removes the multer temp file, and
  returns the new key.

This covers the whole "keep / removed / replace" update flow — there is no
separate `resolveField` helper; `save()` itself handles those states.

### `get(key, options?): Promise<FileStream | null>`

Returns a readable stream + mime type + size. With `{ thumb }`, returns the
matching thumbnail. Returns `null` on key-ownership mismatch (logged).

### `delete(key): Promise<void>`

Deletes the original and its thumbnails. No-op (with a warning) on ownership
mismatch.

### `exists(key): Promise<boolean>`

Returns `false` on ownership mismatch (logged).

### Runtime validation

`save()` checks `table` and `field` against the instance's `schemas` and logs a
warning + returns `null` when invalid. This is defense-in-depth behind the
compile-time `TableKey`/`FieldKey` types. If `schemas` is empty, the check is
skipped — which is the current runtime state, because `controllerLogic` does not
yet pass the contract's `schemas` to `createCoreContext`.

### Key ownership

Every key-accepting method (`get`, `delete`, `exists`) verifies
`key.startsWith(moduleId + '/')` and refuses keys from other modules (warning +
null/void/false). `save()` is exempt because it always constructs the key with
the caller's own module prefix.

---

## Storage path convention

### Key format

```
{module-id}/{table}/{field}-{uuid}.{ext}
```

- `{module-id}` is the caller module id, derived from `createCoreContext`'s `module`:
  `lifeforge--<module>` for federation modules, or the core lib name (`user`,
  `fonts`, ...).
- `{table}` and `{field}` are the strings passed to
  `core.storage.save({ table, field })` - normally the module's Drizzle table key
  and the target column/field.
- `{uuid}` guarantees uniqueness; `{ext}` comes from the uploaded filename
  (`generateKey` in `packages/file-storage/src/utils.ts`).

Examples (real, from the core migration):

```
user/users/avatar-a1b2c3d4.png
fonts/fontsFontFamilyUpload/file-e5f6g7h8.ttf
```

### Rationale

- **No record ID needed** - avoids circular dependency (record doesn't exist yet at save time)
- **UUID ensures uniqueness** - no collisions
- **Module prefix auto-inferred** from `createCoreContext`'s `module.id` (e.g., `lifeforge--books-library`)
- **Listable**: all files for a target = prefix `{module-id}/{table}/`
- **S3-native**: `/` renders as folder hierarchy in S3 console
- **Local filesystem**: `/` creates real directories for browsing with `find`, `du`, etc.

### Thumbnail storage

Thumbnails live next to the original, with `-thumb-{size}` appended before the
extension (`generateThumbKey` in `packages/file-storage/src/utils.ts`):

```
{base}-thumb-{size}{ext}
```

Examples:

```
user/users/avatar-a1b2c3d4-thumb-256x0.png
fonts/fontsFontFamilyUpload/file-e5f6g7h8-thumb-200x0.png
```

`GET /files?key=<original-key>&thumb=<size>` resolves the thumbnail via
`generateThumbKey(key, thumb)` (see `apps/api/src/core/routes/core.routes.ts`).

Thumbnails are generated with `sharp` (`resizeImage`), only for `image/*`
uploads that are not SVG. Sizes are `WxH` strings (e.g. `256x0`, `0x512`,
`200x200`); a zero dimension means "no constraint on that axis".

---

## Module usage

```typescript
// Upload / replace an avatar (apps/api/src/lib/user/routes/settings.ts)
const avatarKey = await core.storage.save({
  file: rawFile,
  currentKey: user.avatar || undefined,
  table: 'users',
  field: 'avatar',
  thumbs: ['256x0']
})

await db.update(users).set({ avatar: avatarKey, updated: new Date() })
```

```typescript
// Delete a file (apps/api/src/lib/user/routes/personalization.ts)
if (user.bgImage) {
  await core.storage.delete(user.bgImage)
}
```

```typescript
// Save a non-image file (apps/api/src/lib/fonts/routes/custom.ts)
const fileKey = await core.storage.save({
  file,
  currentKey: existingFileKey,
  table: 'fontsFontFamilyUpload',
  field: 'file'
})
```

`core.storage` is typed with the same `TSchema` as the module's `forge` builder,
so `table`/`field` are checked at compile time.

---

## Wiring

- `apps/api/src/core/storage.ts` - the provider singleton.
- `apps/api/src/core/functions/routes/utils/coreContext.ts` - creates a
  `FileStorage` per request from `(storageProvider, module, schemas, logging)`.
- Forge contracts expose `getValue().schemas` (the module's tables) so
  `createCoreContext` can receive them. **Note:** `controllerLogic` currently
  calls `createCoreContext({ module })` without `schemas`, so runtime
  `table`/`field` validation is a no-op today; type safety comes from
  `TableKey`/`FieldKey`.
- `apps/api/src/core/routes/core.routes.ts` - the public `GET /files` endpoint.

---

## Backend file endpoint

`GET /files?key=<key>&thumb=<size>` (no auth, no encryption, no rate limit):

```typescript
const targetKey = thumb ? generateThumbKey(key, thumb) : key
const fileStream = await storageProvider.get(targetKey)

if (!fileStream) {
  res.status(404).json({ error: 'File not found' })
  return
}

res.setHeader('Content-Type', fileStream.mimeType)
if (fileStream.size > 0) res.setHeader('Content-Length', fileStream.size)
res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
fileStream.stream.pipe(res)
```

The endpoint serves any key; per-module access control is not enforced here
(files are public). Keys are unguessable (uuid) but not secret.

---

## Frontend

`forgeAPI.getMedia({ key, thumb? })` builds the URL via
`packages/api/src/proxy/helpers/getMediaHelper.ts`:

```typescript
forgeAPI.getMedia({ key: record.thumbnailKey, thumb: '200x0' })
// => '<apiHost>/files?key=lifeforge--books-library/booksEntries/file-123.epub&thumb=200x0'
```

`key` is the storage key stored on the record (e.g. `record.avatarKey`), not a
PocketBase id.

---

## Providers

### LocalStorageProvider

- Root is `FILE_STORAGE_LOCAL_PATH` (default `./storage`), resolved against the
  project root (`findProjectRoot`).
- `save` writes the file (creating directories); `get` streams it; `exists` stats
  it; `delete` unlinks the file and any `{base}-thumb-*` siblings.

### S3StorageProvider

- Uses `@aws-sdk/client-s3` with the `FILE_STORAGE_S3_*` config.
- `save` → `PutObject`, `get` → `GetObject` (returns `null` on error), `exists` →
  `HeadObject`, `delete` → `DeleteObject` + lists/deletes the `{base}-thumb-`
  prefix.

---

## Migrating PocketBase files

PB `file` fields become text columns holding a storage key. To move existing PB
files into storage, fetch them from `{PB_HOST}/api/files/{collection}/{recordId}/{filename}`
and store them with `FileStorage.save` so keys and thumbnails are generated
consistently. See the `database-migration` skill and
`apps/api/scripts/migrations/` for the tooling and worked examples.
