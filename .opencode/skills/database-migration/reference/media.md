# Media (PocketBase files → file-storage SDK)

PB `file` fields store a filename (or a comma-separated list). The new schema
stores a **storage key** in a text column; the client fetches it via
`getMedia({ key, thumb })`.

## Fetching from PocketBase

PB is still running; files are served by the PB API (public for the collections
seen so far, otherwise pass an auth token):

```
GET {PB_HOST}/api/files/{collection}/{recordId}/{filename}
```

`lib/files.ts` exposes `fetchPbFile(collection, recordId, filename)` for this.

## Storing via the new SDK

```ts
const storage = createModuleStorage(info.storageId) // lib/files.ts
const key = await migrateFileField({
  storage,
  pbCollection: table.pgName,
  recordId: pbRow.id,
  filename: pbRow.file,
  table: table.pgName,   // used only to build the key
  field: 'fileKey',      // target column DB name
  thumbs: pbField.thumbs // from `_collections` fields (e.g. ['256x0'])
})
mappedRow.fileKey = key
```

- `createModuleStorage` uses `createProvider()` from `@lifeforge/file-storage`.
  With no `FILE_STORAGE_PROVIDER` set it writes to the **local** provider at
  `<repoRoot>/storage`, matching the running server.
- Storage keys look like `<moduleId>/<table>/<field>-<uuid>.<ext>`. `moduleId` is
  the module folder name for app modules (`lifeforge--wallet`) and the lib name
  for core (`user`, `fonts`) — matching `getCallerModuleId`.
- **Regenerate thumbnails** from the original; do not copy PB's pre-generated
  thumbs. Pass the PB field's `thumbs` array (e.g. avatar `['256x0']`).
- The generated keys are the source of truth; store them in the mapped row.

## Multi-file fields

PB stores several filenames as a comma-separated string
(`journal__entries.photos`, `moment_vault__entries.file`, `blog__entries.media`).
Use `parsePbList` and, if the target is an array/json column, map each filename
through `migrateFileField`.

## Validation

After migration, each key must resolve through the app endpoint:

```
GET {VITE_API_HOST}/files?key=<key>
GET {VITE_API_HOST}/files?key=<key>&thumb=256x0
```
