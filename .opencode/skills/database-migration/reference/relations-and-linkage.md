# Relations and linkage

## The one invariant: deterministic ids

```ts
newId(pbId) = uuidv5(NAMESPACE_ID, pbId)   // lib/id.ts
```

A PB relation value is a PB record id. `newId` turns it into the exact UUID the
referenced row will have — computed without any lookup table. This is what makes
linkage work across tables, across migration runs, and across modules.

Do **not** use `crypto.randomUUID()` for migrated ids.

## Resolving a relation to a column

Use the module's built relations (`loadModuleSchema` → `introspectModule`). The
relation name matches the PB field name (verified: PB `category` ↔ relation
`category`).

### `One` (PB `maxSelect = 1`)

```ts
const built = info.builtRelations[tableKey].relations
const target = built[pbFieldName]              // Relation
const fkColumn = target.sourceColumns[0].name  // e.g. "category_id"

mappedRow[fkColumn] = pbRow[pbFieldName] ? newId(pbRow[pbFieldName]) : null
```

### `Many` (PB `maxSelect > 1`, stored as a JSON array)

If the new schema models M2M with `.through(...)`, the built relation exposes
`throughTable` and `through.source` / `through.target`:

```ts
for (const relatedId of parsePbList(pbRow[field])) {
  await tx.insert(info.tables[throughKey]).values({
    [throughSourceColumn]: newId(pbRow.id),
    [throughTargetColumn]: newId(relatedId)
  })
}
```

If instead the target column is an array/json, map:
`mappedRow[column] = parsePbList(pbRow[field]).map(newId)`.

Known multi relations: `books_library__entries.languages`,
`todo_list__entries.tags`, `virtual_wardrobe__histories.entries`,
`wallet__transaction_templates.ledgers`,
`wallet__transactions_income_expenses.ledgers`.

## Referential integrity / ordering

FKs are checked at insert time, so referenced rows must exist first.

1. **Topological order** tables by `One` relations (source depends on target).
   `inspect.ts` prints `insert order`. `clearTables` reverses it.
2. **Self-relations / cycles** (e.g. `idea_box__folders.parent`): insert with the
   FK `null`, then run an `UPDATE` pass once all rows exist.
3. **External targets** (module → core `users`): those rows must already be in the
   DB. Because ids are deterministic, migrate core first and module runs will link
   correctly. If a target is missing, leave the FK `null` (if nullable) and report.

## Merged base/extension collections

PB splits some aggregates across a base + extension collections linked by
`base_event` / `base_entry` / `base_transaction`
(`calendar__events*`, `idea_box__entries*`, `wallet__transactions*`). If the new
schema **merged** them into one table, add an explicit merge step (map each PB
collection to the target table + a discriminator column). If the new schema kept
them separate, treat `base_*` as a normal `One` relation.

## Verification

After inserting, orphan check must be 0 for every non-null FK:

```sql
SELECT COUNT(*) FROM entries e
LEFT JOIN categories c ON c.id = e.category_id
WHERE e.category_id IS NOT NULL AND c.id IS NULL;
```
