---
description: Convention for preserving page state (search, filters, pagination) using nuqs
---

# nuqs Search + Filter Convention

The standard convention for persisting page state (search, filters, pagination) in the URL across all LifeForge modules using `nuqs`.

## Overview

Every filterable list page in a LifeForge module follows this structure:

1. A `useFilter()` hook in `src/hooks/useFilter.ts` manages all URL-bound state
2. **Search query** (`q`) is a standalone `useQueryState` — kept separate because it is often debounced independently
3. **All other state** (string filters, boolean toggles, sort order, view mode, page number) is grouped in a single `useQueryStates` call
4. A single `updateFilter(key, value)` helper is exported for component use
5. Filters feed into a data-fetching hook (e.g., `useQuery`), which rebuilds the API request whenever URL params change

### How state flows

```
User changes filter/input
  → updateFilter(key, value) or setSearchQuery(value)
    → URL param updates (nuqs serializes to ?q=...&category=...&page=1)
      → useQuery re-runs (query key depends on nuqs state)
        → API call with fresh params
```

---

## Standard Template

Create the file at `src/hooks/useFilter.ts`:

```tsx
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
  useQueryStates
} from 'nuqs'

export default function useFilter() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    parseAsString.withDefault('')
  )

  const [filter, setFilter] = useQueryStates({
    // String filters come first
    category: parseAsString.withDefault(''),
    collection: parseAsString.withDefault(''),
    author: parseAsString.withDefault(''),
    // Boolean toggles
    favourite: parseAsBoolean.withDefault(false),
    // Enum-based state
    sort: parseAsStringEnum(['newest', 'oldest', 'name'] as const).withDefault('newest'),
    view: parseAsStringEnum(['grid', 'list'] as const).withDefault('grid'),
    // Pagination
    page: parseAsInteger.withDefault(1)
  })

  const updateFilter = (key: keyof typeof filter, value: any) => {
    setFilter(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return {
    searchQuery,
    setSearchQuery,
    ...filter,
    updateFilter
  }
}
```

### What the URL looks like

With the above config, a user filtering by category `"fiction"`, sorted newest-first, on page 3, searching for `"dune"`:

```
/list?q=dune&category=fiction&sort=newest&view=grid&page=3
```

Default values (`''`, `false`, `newest`, `grid`, `1`) are **omitted** from the URL by nuqs — they only appear when the value diverges from the default.

---

## Full Integration with Data Fetching

The hook lives alongside your data-fetching logic. The typical pattern:

```tsx
// useFilter.ts — URL state (no side effects)
export default function useFilter() {
  // ... as shown above
}

// useList.ts — data fetching (consumes filter state)
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@/utils/forgeAPI'

export function useList({
  searchQuery,
  category,
  sort,
  page
}: ReturnType<typeof useFilter>) {
  return useQuery(
    forgeAPI.books.list.queryOptions({
      q: searchQuery,
      category,
      sort,
      page
    })
  )
}

// Page component — wires them together
export default function BooksPage() {
  const filters = useFilter()
  const listQuery = useList(filters)

  return (
    <>
      <SearchInput value={filters.searchQuery} onChange={filters.setSearchQuery} />
      <ListboxField
        value={filters.category}
        onChange={value => filters.updateFilter('category', value)}
        options={categories}
      />
      <ResultsView data={listQuery.data} />
      <Pagination
        current={filters.page}
        onChange={page => filters.updateFilter('page', page)}
      />
    </>
  )
}
```

> **Key point:** `useList` re-fetches automatically when `searchQuery`, `category`, `sort`, or `page` change — because `useQuery` watches its inputs and the inputs are derived from nuqs state which updates the URL, which triggers re-renders.

### Debouncing search

Search inputs should be debounced before hitting the API to avoid firing a request on every keystroke. Use a local `useState` + a `useDebounce` utility (common in this codebase):

```tsx
import { useEffect, useState } from 'react'

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [local, setLocal] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => onChange(local), 300)
    return () => clearTimeout(timer)
  }, [local])

  return <input value={local} onChange={e => setLocal(e.target.value)} />
}
```

This keeps the URL update (which triggers re-fetch) on a 300ms delay, while the input remains responsive.

---

## Key Rules

### 1. Search is always `'q'` and always standalone

`useQueryState` for `'q'` is separate from the `useQueryStates` group.

**Why:** Search is often debounced independently. It's also the only param that's driven by a text input rather than a discrete toggle or selector. Keeping it standalone avoids needing to spread/ignore it when passing the filter group to API calls.

```tsx
// ✅ Correct
const [searchQuery, setSearchQuery] = useQueryState('q', parseAsString.withDefault(''))
const [filter, setFilter] = useQueryStates({ ... })

// ❌ Wrong — search bundled with filters
const [filter, setFilter] = useQueryStates({
  q: parseAsString.withDefault(''),
  category: parseAsString.withDefault(''),
  ...
})
```

### 2. Always use `.withDefault(...)` — never return `null`

Every parser must have `.withDefault()`. This guarantees the returned value is never `null`, eliminating conditional checks in components and API call preparation.

```tsx
// ✅ Correct — value is always a string
category: parseAsString.withDefault('')

// ✅ Correct — value is always a boolean
favourite: parseAsBoolean.withDefault(false)

// ✅ Correct — value is always a number
page: parseAsInteger.withDefault(1)

// ❌ Wrong — value is `string | null`
category: parseAsString
```

### 3. Use `as const` on enum arrays

TypeScript infers `string[]` from a plain array, which weakens autocomplete. Add `as const`:

```tsx
// ✅ Correct — type is '"newest" | "oldest" | "name"'
sort: parseAsStringEnum(['newest', 'oldest', 'name'] as const).withDefault('newest')

// ❌ Wrong — type is `string`
sort: parseAsStringEnum(['newest', 'oldest', 'name']).withDefault('newest')
```

### 4. Dynamic enums extract keys from constants

When options come from a constants object:

```tsx
const DIFFICULTIES = { easy: 'Easy', medium: 'Medium', hard: 'Hard' } as const

difficulty: parseAsStringEnum(
  Object.keys(DIFFICULTIES) as Array<keyof typeof DIFFICULTIES>
).withDefault('')
```

> Use `''` as the default for optional enum filters so "no selection" is the initial state.

### 5. `updateFilter` is the only public setter for grouped state

Components should **never** call `setFilter` directly. The `updateFilter` helper wraps it for consistency:

```tsx
// ✅ Correct — goes through the single public setter
updateFilter('category', 'fiction')
updateFilter('page', 3)

// ❌ Wrong — bypasses the hook's API
setFilter(prev => ({ ...prev, category: 'fiction' }))
```

> **`value: any`** is intentionally loose. Using `filter[key]`'s value type would be more precise but creates friction when the key is dynamic. The tradeoff is acceptable for a 3-line helper with no runtime validation logic.

---

## Return Value Conventions

Two styles exist in the codebase. **Prefer Style A** (spread) — it's more ergonomic in components.

### Style A: Spread (preferred)

```tsx
return { searchQuery, setSearchQuery, ...filter, updateFilter }

// Component usage:
const { category, sort, page, updateFilter } = useFilter()
```

### Style B: Object

```tsx
return { searchQuery, setSearchQuery, filter, updateFilter }

// Component usage:
const { filter, updateFilter } = useFilter()
// → filter.category, filter.sort, filter.page
```

---

## Page Reset on Filter Change

When a filter or search changes, the page should reset to 1 (otherwise the user stays on page 5 but sees results for a different filter, which is empty if there are only 3 pages).

If `page` lives inside the `useQueryStates` group, add a `useEffect` with an `initialLoading` guard:

```tsx
const [initialLoading, setInitialLoading] = useState(true)

useEffect(() => {
  if (page !== 1 && !initialLoading) setPage(1)
  if (initialLoading) setInitialLoading(false)
}, [filter, searchQuery])
```

**Why `initialLoading`?** Without it, the effect fires on mount and immediately resets `page` to 1 — even if the user navigated to `?page=3&category=fiction`. The flag suppresses the reset on the initial render, preserving the user's intent.

> **Alternative:** If `page` is a standalone `useQueryState` (like `books-library`), the reset logic is the same — just reference `page` directly instead of `filter.page`.

---

## Anti-Patterns

These patterns exist in the codebase but should **not** be replicated:

### ❌ Multiple `useQueryState` calls for each filter

```tsx
// ❌ DON'T — calendar module does this; no grouping, no updateFilter helper
const [category, setCategory] = useQueryState('category', parseAsString.withDefault(''))
const [calendar, setCalendar] = useQueryState('calendar', parseAsString.withDefault(''))
// ... as the list grows, the component destructuring becomes unwieldy
```

Use `useQueryStates` to group related filters. The only standalone `useQueryState` should be `q`.

### ❌ Raw objects instead of parsers

```tsx
// ❌ DON'T — wallet/Assets uses this; loses type narrowing and parser validation
const [q, setQ] = useQueryState('q', { defaultValue: '' })
const [range, setRange] = useQueryState('range', { defaultValue: 'month' })
```

Always use the `parseAs*` parsers from nuqs. They enforce types at the URL boundary and integrate with `useQueryStates`.

### ❌ Filter state in Zustand instead of URL

```tsx
// ❌ DON'T — wallet/Transactions stores filters in a Zustand store
const { category, searchQuery } = useWalletStore()
```

If filter state belongs in the URL (sharable and back-button-friendly), use nuqs. Zustand is for state that shouldn't be URL-encoded.

---

## Checklist

- [ ] `useFilter()` hook created in `src/hooks/useFilter.ts`
- [ ] Search query is standalone `useQueryState('q', parseAsString.withDefault(''))`
- [ ] All other state (filters, toggles, sort, view, page) grouped in one `useQueryStates({...})`
- [ ] Every parser has `.withDefault(...)` — no `null` returns
- [ ] Enum parsers use `as const` on the literal array
- [ ] `updateFilter(key, value)` helper provided and used by all components
- [ ] Data-fetching hook consumes filter state from `useFilter()`'s return
- [ ] Search input is debounced before updating URL state
- [ ] Page resets to 1 when filters/search change, guarded by `initialLoading`
- [ ] No bare `useQueryState` calls for individual filters (except `q`)
