# Validation checklist

Run after every module migration. All checks must pass before considering the
migration done.

## 1. Row counts match

For each migrated table, compare target count to the PB collection count:

```sql
SELECT COUNT(*) FROM "<table>";
```

Use `countRows(db, table)` and `countPbRows(pb, collection)` from `lib/`.

## 2. No orphan foreign keys

For every non-null FK, the target row must exist:

```sql
SELECT COUNT(*) FROM entries e
LEFT JOIN categories c ON c.id = e.category_id
WHERE e.category_id IS NOT NULL AND c.id IS NULL;
```

`countOrphanFks(db, { label, sourceTable, sourceColumn, targetTable, targetColumn })`
runs this. Expect `0` for every relation.

## 3. Enums are valid

Every enum column value must be in its `enumValues` (Drizzle/pg would reject
invalid values, so a successful insert is usually enough, but check counts by
value):

```sql
SELECT difficulty, COUNT(*) FROM achievements__entries GROUP BY difficulty;
```

## 4. Timestamps preserved

Spot-check that `created`/`updated` equal the PB values:

```sql
SELECT created::text, updated::text FROM "<table>" LIMIT 5;
```

## 5. Media resolves

For each migrated file key, confirm the app can serve it:

```
GET {VITE_API_HOST}/files?key=<key>
GET {VITE_API_HOST}/files?key=<key>&thumb=<size>
```

## 6. Idempotency

Re-run the migration script. Counts must stay identical (deterministic ids +
clear-then-insert). If the script uses upsert instead, counts must also stay
identical.

## 7. Spot-check joins

Pick a row and verify a relation resolves to the expected related record:

```sql
SELECT e.title, c.name
FROM achievements__entries e
JOIN achievements__categories c ON c.id = e.category_id
LIMIT 5;
```
