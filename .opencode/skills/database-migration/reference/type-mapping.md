# Type mapping (PocketBase → Drizzle/Postgres)

Convert values based on the **target drizzle column**, not the PB field type
alone. Inspect the column with `getTableColumns(table)` (`dataType`,
`columnType`, `enumValues`).

| PB field type | Target column | Conversion |
| --- | --- | --- |
| `text`, `email`, `url` | `varchar` / `text` | value as-is (`string \| null`) |
| `select` (maxSelect 1) | `pgEnum` / `varchar` | value as-is; if enum, must match `enumValues` |
| `number` | `integer` / `real` / `numeric` | `Number(value)` |
| `bool` | `boolean` | `Boolean(value)` (SQLite stores 0/1) |
| `date`, `autodate` | `timestamp` | `parsePbDate(value)` |
| `json` | `json` (`$type<T>`) | `parsePbJson(value)` |
| `relation` (maxSelect 1) | `uuid` FK | `newId(value)` (see relations doc) |
| `relation` (maxSelect > 1) | junction / array | `parsePbList(value).map(newId)` |
| `file` | `varchar` key | media pipeline (`media.md`) |
| `select` (maxSelect > 1) | array / json | `parsePbList(value)` |
| `geoPoint` | `json` or two columns | **special** — `parsePbJson` or split `lon`/`lat` |
| `password` | `auth_password_hash`? | **special** — confirm hash algorithm before mapping |

## Notes

- **Never copy PB system fields** (`password`, `tokenKey`) blindly. The new app
  authenticates against `users.auth_password_hash`; confirm the hash format
  (PB uses its own) before writing it. This likely needs a transform/override.
- SQLite has loose typing: a column may come back as `number`, `string`, or
  `null`. Coerce defensively (`Number`, `Boolean`, `String`).
- PB stores `date`/`autodate` as `YYYY-MM-DD HH:MM:SS.mmmZ` (space separator,
  UTC). `parsePbDate` replaces the space with `T`; the value round-trips and
  Drizzle reads it back as the same instant.
- PB stores multi relations as a **JSON array string** (`["id1","id2"]`) and
  multi files as a comma-separated string. `parsePbList` handles both.
- Empty PB values are `''` for text; normalise to `null` only if the target
  column is nullable.

## Example

```ts
const mappedRow = {
  id: newId(pb.id),
  title: pb.title,
  difficulty: pb.difficulty, // enum
  categoryId: pb.category ? newId(pb.category) : null,
  backdropFilters: pb.backdropFilters ? parsePbJson(pb.backdropFilters) : null,
  created: parsePbDate(pb.created),
  updated: parsePbDate(pb.updated)
}
```
