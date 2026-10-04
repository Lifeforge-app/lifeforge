# Media (PocketBase files → file-storage SDK)

PB `file` fields store a filename (or a comma-separated list). The new schema
stores a **storage key** in a text column **and** a metadata row in the central
`files` table; the client fetches it via `getMedia({ key, thumb })`.

## Fetching from PocketBase

PB is still running; files are served by the PB API (public for the collections
seen so far, otherwise pass an auth token):

```
GET {PB_HOST}/api/files/{collection}/{recordId}/{filename}
```

`lib/files.ts` exposes `fetchPbFile(collection, recordId, filename)` for this.

## Storing via the new SDK

```ts
const { db, client } = createMigrationDb()
const storage = createModuleStorage(info.storageId, db) // lib/files.ts
const key = await migrateFileField({
  storage,
  pbCollection: table.pgName,
  recordId: pbRow.id,
  filename: pbRow.file,
  thumbs: pbField.thumbs // from `_collections` fields (e.g. ['256x0'])
})
mappedRow.fileKey = key
```

- `createModuleStorage(moduleId, db)` returns a `FileStorage` backed by
  the migration db, so each migrated file also writes a `files` metadata row
  (original name, mime, size, thumbs). `createProvider()` from
  `@lifeforge/file-storage` is used; with no `FILE_STORAGE_PROVIDER` set it
  writes to the **local** provider at `<repoRoot>/storage`, matching the running
  server.
- Storage keys are opaque: `<moduleId>/<uuid>.<ext>`. `moduleId` is the module
  folder name for app modules (`lifeforge--wallet`) and the lib name for core
  (`user`, `fonts`) — matching `getCallerModuleId`. The original PB filename is
  kept in the `files` table, not in the key.
- **Regenerate thumbnails** from the original; do not copy PB's pre-generated
  thumbs. Pass the PB field's `thumbs` array (e.g. avatar `['256x0']`).
- `migrateFileField` returns the generated key (or `null`); store it in the
  mapped row.

## Multi-file fields

PB stores several filenames as a comma-separated string
(`journal__entries.photos`, `moment_vault__entries.file`, `blog__entries.media`).
Use `parsePbList` and, if the target is an array/json column, map each filename
through `migrateFileField`.

## Validation

After migration, each key must resolve through the app endpoint:

```
GET {VITE_API_HOST}/files/get?key=<key>
GET {VITE_API_HOST}/files/get?key=<key>&thumb=256x0
```
