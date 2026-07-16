# Mutation Migration Guide

**From:** Manual `useMutation` + `mutationOptions()` + `queryClient.invalidateQueries()` + `toast.error()` + `useModuleTranslation(['common.fetch'])`  
**To:** Centralized `useForgeMutation()` hook that handles query invalidation, error toasting, and console.error logging

---

## Table of Contents

- [Mutation Migration Guide](#mutation-migration-guide)
  - [Table of Contents](#table-of-contents)
  - [Overview of Changes](#overview-of-changes)
    - [Before](#before)
    - [After](#after)
  - [Migration Checklist by File](#migration-checklist-by-file)
  - [Step-by-Step Migration Procedure](#step-by-step-migration-procedure)
    - [Step 1: Imports](#step-1-imports)
    - [Step 2: Replace the Mutation Block](#step-2-replace-the-mutation-block)
      - [Pattern A: Delete Mutation](#pattern-a-delete-mutation)
      - [Pattern B: Create/Update with Conditional Endpoint](#pattern-b-createupdate-with-conditional-endpoint)
      - [Pattern C: Custom onSuccess / onError](#pattern-c-custom-onsuccess--onerror)
    - [Step 3: Clean Up Unused Imports](#step-3-clean-up-unused-imports)
  - [Query Key Convention](#query-key-convention)
  - [Action Convention](#action-convention)
  - [Do Not Convert](#do-not-convert)
  - [Common Pitfalls](#common-pitfalls)
  - [Hook API Reference](#hook-api-reference)

---

## Overview of Changes

### Before

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useModuleTranslation } from '@lifeforge/localization'
import { toast } from '@lifeforge/ui'

const queryClient = useQueryClient()
const { t } = useModuleTranslation(['common.fetch'])

const deleteMutation = useMutation(
  forgeAPI.templates.remove.input({ id: template.id }).mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet', 'templates'] })
    },
    onError: () => {
      toast.error(
        t('common.fetch:failure', {
          action: t('common.fetch:action.delete')
        })
      )
    }
  })
)
```

### After

```tsx
import { useForgeMutation } from '@lifeforge/api'

const deleteMutation = useForgeMutation(
  forgeAPI.templates.remove.input({ id: template.id }),
  { action: 'delete', queryKey: forgeAPI.templates.key }
)
```

---

## Migration Checklist by File

- [ ] **Imports** - remove `useMutation`, `useQueryClient` from `@tanstack/react-query`; remove `useModuleTranslation` from `@lifeforge/localization` if only used for `common.fetch`; remove `toast` from `@lifeforge/ui` if only used in mutation; add `useForgeMutation` from `@lifeforge/api`
- [ ] **Replace mutation block** - remove `useMutation(...)` and replace with `useForgeMutation(...)` (see patterns below)
- [ ] **Use forgeAPI key** - replace hardcoded query key arrays with `forgeAPI.<entity>.key` or `forgeAPI.key`
- [ ] **Create/update splitting** - split conditional `(type === 'create' ? create : update)` into two separate `useForgeMutation` calls
- [ ] **Refactor handler** - update `mutation.mutateAsync` references to use `createMutation` / `updateMutation` as appropriate

---

## Step-by-Step Migration Procedure

### Step 1: Imports

**Remove these imports:**

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useModuleTranslation } from '@lifeforge/localization'   // if only used for common.fetch
import { toast } from '@lifeforge/ui'                             // if only used in mutation
```

**Add this import:**

```tsx
import { useForgeMutation } from '@lifeforge/api'
```

**Preserve these imports if needed elsewhere in the file:**

```tsx
import { useQuery } from '@tanstack/react-query'           // still needed for data queries
import { useModuleTranslation } from '@lifeforge/localization'  // if t() is used for UI labels
import { toast } from '@lifeforge/ui'                      // if toast.success() used outside mutation
```

> **Always verify before removing.** Check the rest of the file for any remaining usage of `t`, `toast`, `queryClient`, etc.

### Step 2: Replace the Mutation Block

#### Pattern A: Delete Mutation

The simplest case - a delete mutation with no custom onSuccess logic beyond query invalidation.

**Before:**

```tsx
const queryClient = useQueryClient()
const { t } = useModuleTranslation(['common.fetch'])

const deleteMutation = useMutation(
  forgeAPI.entities.remove.input({ id: item.id }).mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moduleName', 'entities'] })
    },
    onError: () => {
      toast.error(
        t('common.fetch:failure', {
          action: t('common.fetch:action.delete')
        })
      )
    }
  })
)

// Usage:
await deleteMutation.mutateAsync(undefined)
```

**After:**

```tsx
const deleteMutation = useForgeMutation(
  forgeAPI.entities.remove.input({ id: item.id }),
  { action: 'delete', queryKey: forgeAPI.entities.key }
)

// Usage is identical:
await deleteMutation.mutateAsync(undefined)
```

**Key details:**
- `action: 'delete'` - the hook auto-resolves this to `t('common.fetch:action.delete')` via i18n
- `queryKey: forgeAPI.entities.key` - replaces hardcoded `['moduleName', 'entities']`
- For entire-module invalidation, use `queryKey: forgeAPI.key` (equivalent to `['moduleName']`)

#### Pattern B: Create/Update with Conditional Endpoint

Create and update mutations must be **split into two separate `useForgeMutation` calls**. They cannot share a single hook because `(type === 'create' ? create : update)` produces a union type that doesn't unify.

**Before:**

```tsx
const queryClient = useQueryClient()
const { t } = useModuleTranslation(['common.fetch'])

const mutation = useMutation(
  (type === 'create'
    ? forgeAPI.entities.create
    : forgeAPI.entities.update.input({ id: initialData?.id || ''! })
  ).mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moduleName'] })
    },
    onError: () => {
      toast.error(
        t('common.fetch:failure', {
          action:
            type === 'create'
              ? t('common.fetch:action.create')
              : t('common.fetch:action.update')
        })
      )
    }
  })
)

// Usage - direct handler:
return (
  <FormModal
    submissionConfig={{
      handler: mutation.mutateAsync,
      template: type
    }}
    ...
  />
)

// Usage - wrapped handler:
handler: async data => {
  await mutation.mutateAsync(data)
}
```

**After - direct handler:**

```tsx
const createMutation = useForgeMutation(
  forgeAPI.entities.create,
  { action: 'create', queryKey: forgeAPI.key }
)

const updateMutation = useForgeMutation(
  forgeAPI.entities.update.input({ id: initialData?.id || ''! }),
  { action: 'update', queryKey: forgeAPI.key }
)

// Usage:
return (
  <FormModal
    submissionConfig={{
      handler: data => {
        (type === 'create' ? createMutation : updateMutation).mutateAsync(data)
      },
      template: type
    }}
    ...
  />
)
```

**After - wrapped handler:**

```tsx
handler: async data => {
  await (type === 'create'
    ? createMutation
    : updateMutation
  ).mutateAsync(data)
}
```

> **Important:** The handler wrapper must use the ternary inside `mutateAsync()` - not an if/else that conditionally calls `useForgeMutation()`. React hooks cannot be called conditionally. Both mutations are always created; only one is invoked.

#### Pattern C: Custom onSuccess / onError

Some mutations need custom logic beyond the standard query invalidation and error toast. In these cases, pass `onSuccess` and/or `onError` callbacks. The hook will still handle query invalidation and `console.error` logging.

**Before:**

```tsx
const mutation = useMutation(
  forgeAPI.transactions.createMultiple.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: forgeAPI.key })
      toast.success(t('toasts.createMultipleTransactions.success'))
      onClose()
    },
    onError: error => {
      toast.error(t('toasts.createMultipleTransactions.error'))
      console.error(error)
    }
  })
)
```

**After:**

```tsx
const mutation = useForgeMutation(
  forgeAPI.transactions.createMultiple,
  {
    action: 'create',
    queryKey: forgeAPI.key,
    onSuccess: () => {
      toast.success(t('toasts.createMultipleTransactions.success'))
      onClose()
    },
    onError: () => {
      toast.error(t('toasts.createMultipleTransactions.error'))
    }
  }
)
```

**Key details:**
- `queryClient.invalidateQueries` and `onClose()` → removed; hook handles invalidation; `onClose()` moved to `onSuccess`
- `console.error(error)` → removed; hook always logs with `[useForgeMutation] action failed:` prefix
- Custom `onError` → **overrides** the default i18n toast. Use for module-specific error messages (e.g., `t('toasts.savePrompts.error')`)

**Multiple query keys to invalidate:**

Pass an array of keys:

```tsx
const deleteMutation = useForgeMutation(
  forgeAPI.calendars.remove.input({ id: item.id }),
  {
    action: 'delete',
    queryKey: [forgeAPI.calendars.list.key, forgeAPI.events.key]
  }
)
```

### Step 3: Clean Up Unused Imports

After migration, remove any imports that are no longer used anywhere in the file:

- `useMutation` - no longer needed
- `useQueryClient` - only keep if still used by non-migrated mutations (e.g., `queryClient.setQueryData()`)
- `useModuleTranslation` - only keep if `t()` is used for UI labels, buttons, etc.
- `toast` - only keep if `toast.success()` or `toast.error()` is used outside mutations (e.g., clipboard copy confirmations)

---

## Query Key Convention

Always use `forgeAPI`-derived keys instead of hardcoded string arrays. This ensures correct module ID scoping.

| Scope                             | Convention                         | Example result        |
| --------------------------------- | ---------------------------------- | --------------------- |
| Entire module                     | `forgeAPI.key`                     | `['wallet']`          |
| Entity subtree (all nested ops)   | `forgeAPI.<entity>.key`            | `['wallet', 'assets']` |
| Specific list query               | `forgeAPI.<entity>.list.key`       | `['wallet', 'assets', 'list']` |
| Multiple entities                 | `[forgeAPI.a.key, forgeAPI.b.key]` | Array of query keys   |

> **Why?** The module ID in `forgeAPI.key` is dynamically generated. Hardcoded `['wallet']` would break if the module ID changes. `forgeAPI.key` always resolves correctly.

---

## Action Convention

The `action` parameter can be either a common action key (auto-resolved via `common.fetch:action.*`) or a pre-translated string from module locales.

### Common action keys (auto-translated)

These are stored in `locales/lang-en/common.json` under `fetch.action`:

| Key        | Resolves to       |
| ---------- | ----------------- |
| `create`   | `"created"`       |
| `update`   | `"updated"`       |
| `delete`   | `"deleted"`       |

Used like:

```ts
{ action: 'delete' }
// → toast: "Oh no... Failed to get the item deleted. Please try again."
```

### Module-specific actions (pre-translated)

When no matching key exists in `common.fetch:action`, the `action` string is used as-is:

```ts
const { t } = useModuleTranslation()

const mutation = useForgeMutation(
  forgeAPI.events.summarize.input({ id }),
  { action: t('calendar:actions.summarized'), queryKey: forgeAPI.key }
)
```

The hook checks via `i18n.exists()` - if the key is found in `common.fetch`, it's translated; otherwise the raw string is used.

> **Note:** The `common.fetch:action` entry was stripped to only `create`, `update`, and `delete`. All other 19 entries (`rename`, `pin`, `archive`, etc.) were unused dead keys and have been removed. For niche actions, pass a pre-translated string or add the key back to the locale file.

---

## Do Not Convert

The following mutation patterns should **not** be converted to `useForgeMutation`:

- **Mutations using `queryClient.setQueryData()`** - these have unique cache-busting logic that can't be abstracted. Example: `forgeAPI.events.addException` in EventDetailsHeader.
- **Mutations using `queryClient.removeQueries()`** - different invalidation strategy.
- **Raw `.mutate()` calls outside `useMutation`** - these are direct API calls, not React Query mutations. Example: `forgeAPI.events.scanImage.mutate()` in ScanImageModal.
- **Mutations with `.refetch()` on a specific query** - the hook only does `invalidateQueries`. If you need `.refetch()` instead, keep manual handling or use `onSuccess` with `refetch`.

---

## Common Pitfalls

### 1. Don't hook conditionally

```tsx
// ❌ WRONG - hooks must not be called conditionally
if (type === 'create') {
  const mutation = useForgeMutation(...)
}

// ✅ CORRECT - create both, invoke one
const createMutation = useForgeMutation(...)
const updateMutation = useForgeMutation(...)
handler: data => {
  (type === 'create' ? createMutation : updateMutation).mutateAsync(data)
}
```

### 2. Not removing `['common.fetch']` from `useModuleTranslation`

```tsx
// ❌ WRONG - common.fetch is no longer needed
const { t } = useModuleTranslation(['common.fetch'])

// ✅ CORRECT - default namespace is enough for UI labels
const { t } = useModuleTranslation()
```

### 3. Leaving `useQueryClient` when no longer needed

Check if `queryClient` is used by any remaining non-converted mutations. If not:

```tsx
// ❌ WRONG - unused import
const queryClient = useQueryClient()

// ✅ CORRECT - remove it
// (don't import useQueryClient at all)
```

### 4. Forgetting to split create/update

```tsx
// ❌ WRONG - produces union type error
const mutation = useForgeMutation(
  (type === 'create' ? forgeAPI.e.create : forgeAPI.e.update.input({ id })),
  { action: type, queryKey: forgeAPI.key }
)

// ✅ CORRECT - split into two
const createMutation = useForgeMutation(forgeAPI.e.create, { action: 'create', ... })
const updateMutation = useForgeMutation(forgeAPI.e.update.input({ id }), { action: 'update', ... })
```

### 5. Using hardcoded query keys

```tsx
// ❌ WRONG - fragile, breaks if module ID changes
queryKey: ['wallet', 'assets']

// ✅ CORRECT - derived from forgeAPI
queryKey: forgeAPI.assets.key
```

---

## Hook API Reference

### `useForgeMutation(endpoint, options)`

| Parameter        | Type                                          | Description                                              |
| ---------------- | --------------------------------------------- | -------------------------------------------------------- |
| `endpoint`       | `ForgeEndpoint<T>`                            | A forgeAPI endpoint (e.g., `forgeAPI.templates.remove.input({ id })`) |
| `options.action` | `string`                                      | Action name - resolved via `common.fetch:action.*` or used as-is |
| `options.queryKey` | `QueryKey \| QueryKey[]` (optional)          | Query key(s) to invalidate on success. Supports single key or array of keys for multi-entity invalidation |
| `options.onSuccess` | `() => void` (optional)                     | Called after query invalidation. Use for side effects like closing modals or success toasts |
| `options.onError` | `(error: Error) => void` (optional)          | Overrides the default i18n error toast. The hook still logs `console.error` |

**Returns:** `UseMutationResult` - same object shape as `useMutation()`. All standard properties available: `.mutateAsync()`, `.mutate()`, `.isPending`, `.data`, `.error`, etc.

**Internal behavior:**
1. Calls `endpoint.mutationOptions()` to generate React Query options
2. Injects `onSuccess` that invalidates `queryKey` (if provided), then calls `options.onSuccess`
3. Injects `onError` that logs with `console.error`, then:
   - Calls `options.onError` if provided (caller takes responsibility)
   - Otherwise calls the globally registered error handler (see below)

### `setForgeMutationErrorHandler(handler)`

One-time setup functon called at app initialization to wire the toast system.

```tsx
// In apps/web/src/providers/index.tsx
import { setForgeMutationErrorHandler } from '@lifeforge/api'
import { toast } from '@lifeforge/ui'

setForgeMutationErrorHandler(msg => toast.error(msg))
```

This is called once at module level before any component renders. The handler receives the i18n-formatted error message string.
