---
name: database-migration
description: >
  Use when migrating PocketBase data (database/pb_data/data.db) into a LifeForge
  module's Postgres/Drizzle schema. Triggers on "migrate <module> data", porting
  PB collections into schema.drizzle.ts tables, or writing a per-module migration
  script under apps/api/scripts/migrations/. Do NOT use for authoring schemas,
  writing routes, or non-migration refactors.
---

# PocketBase → Postgres module migration

Move one module's PocketBase records into its new Drizzle/Postgres schema,
preserving relationships, media, and timestamps. Migrations are done
**case-by-case**: the engine here (`inspect` + `lib/`) does the mechanical work,
but a human/agent writes the module's mapping because the new schema is a
redesign, not a mechanical rename.

## Scope checks (stop if any fail)

- The module has a `schema.drizzle.ts` at `modules/<module>/server/schema.drizzle.ts`
  or `apps/api/src/lib/<name>/schema.drizzle.ts`.
- The target tables exist in Postgres (`pnpm db:push` has run).
- PocketBase is still running (`PB_HOST` in `env/.env.local`) — only needed if the
  module has `file` fields.

## Golden rules

1. **Deterministic ids.** `newId(pbId) = uuidv5(NAMESPACE_ID, pbId)` (`lib/id.ts`).
   Never use random UUIDs — linkage between tables and across modules depends on
   this being a pure function.
2. **Never guess renames.** Run `inspect.ts` and read the actual `schema.drizzle.ts`.
3. **Skip** PB `view` collections (`_aggregated`) and `_`-prefixed system collections.
4. **Fail loud** on unmapped *target columns*; **warn + skip** on PB-only fields
   that have no target.
5. **Idempotent.** Clear the module's target tables in FK-safe order, then insert
   inside one transaction.
6. **Always validate** — see `reference/validation.md`.

## Ordering

- Migrate core first: `user`, then `fonts`, before any module that references them.
- A module's **code** migration (`schema.drizzle.ts` + routes) must exist before its
  data migration.

## Workflow

```bash
# 1. Plan (read-only): proposed mapping, relations, row counts, insert order
pnpm --filter @lifeforge/server exec tsx scripts/migrations/inspect.ts <module>

# 2. Read the module schema + PB collections/rows; decide merges / renames / M2M.

# 3. Copy the template and implement the mapping
cp apps/api/scripts/migrations/_template.ts apps/api/scripts/migrations/<module>.ts

# 4. Dry run, review, then run for real
pnpm --filter @lifeforge/server exec tsx scripts/migrations/<module>.ts --dry-run
pnpm --filter @lifeforge/server exec tsx scripts/migrations/<module>.ts
```

## Helper library (`apps/api/scripts/migrations/lib/`)

| Module | Exports |
| --- | --- |
| `constants.ts` | `ROOT_DIR`, `PB_DB_PATH`, `ENV_PATH`, `NAMESPACE_ID` |
| `env.ts` | `loadEnv()`, `requireEnv(name)` |
| `id.ts` | `newId(pbId)` |
| `pb.ts` | `openPb()`, `loadPbCollections()`, `loadPbRows()`, `parsePbDate()`, `parsePbJson()`, `parsePbList()` |
| `drizzle.ts` | `loadModuleSchema(module)`, `introspectModule(info)` |
| `map.ts` | `proposeMapping(table, pb)` |
| `files.ts` | `createModuleStorage(id)`, `fetchPbFile()`, `migrateFileField()` |
| `db.ts` | `createMigrationDb()`, `insertRows()`, `clearTables()` |
| `validate.ts` | `countRows()`, `countPbRows()`, `countOrphanFks()` |

## Hard cases (need deliberate handling)

- **Relations**: `One` → FK column from built relations `sourceColumns`; `Many`
  (PB stores a JSON array) → junction via `throughTable` or an array column.
  See `reference/relations-and-linkage.md`.
- **Self-relations**: insert with `null`, then a second update pass.
- **Merged base/extension collections** (`calendar__events*`, `idea_box__entries*`,
  `wallet__transactions*`): the new schema may merge them; write an explicit merge.
- **Media** (`file` fields): fetch from PB and store via the file-storage SDK.
  See `reference/media.md`.
- **`geoPoint`, PB `password`/`tokenKey`, multi-file/multi-select**: special —
  transform or override.

## Worked example — `lifeforge--achievements`

`inspect` yields:

```
achievements__categories  (5 rows): id, name, color, icon
achievements__entries    (14 rows): id, title, thoughts,
  difficulty (select)  -> difficulty        [enum]
  category   (relation) -> category_id      [relation -> achievementsCategories]
  created/updated       -> created/updated  [date]
insert order: achievements__categories -> achievements__entries
```

Mapping: `id: newId(pb.id)`, scalars as-is, `difficulty` as-is,
`categoryId: pb.category ? newId(pb.category) : null`,
`created/updated: parsePbDate(...)`.

## References

- `reference/type-mapping.md` — PB field type → drizzle column → conversion.
- `reference/relations-and-linkage.md` — ids, `One`/`Many`/self/merged, ordering.
- `reference/media.md` — file fetch + file-storage SDK.
- `reference/validation.md` — post-migration SQL checks.
