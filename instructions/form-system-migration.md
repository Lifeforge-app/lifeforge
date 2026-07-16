# Form System Migration Guide

**From:** Old builder pattern (`defineForm().typesMap().setupFields()...build()` + Zustand)  
**To:** New composition pattern (`useForm()` + `<FormModal>` + field components + `react-hook-form`)

---

## Table of Contents

- [Form System Migration Guide](#form-system-migration-guide)
  - [Table of Contents](#table-of-contents)
  - [Overview of Changes](#overview-of-changes)
    - [Old System](#old-system)
    - [New System](#new-system)
  - [Migration Checklist by File](#migration-checklist-by-file)
  - [Step-by-Step Migration Procedure](#step-by-step-migration-procedure)
    - [Step 1: Imports](#step-1-imports)
    - [Step 2: Define a Zod Schema](#step-2-define-a-zod-schema)
      - [Schema Mapping by Field Type](#schema-mapping-by-field-type)
        - [Text/String Fields (`<TextField>`, `<TextAreaField>`)](#textstring-fields-textfield-textareafield)
        - [Number Fields (`<NumberField>`, `<CurrencyField>`, `<SliderField>`)](#number-fields-numberfield-currencyfield-sliderfield)
        - [Boolean Fields (`<CheckboxField>`)](#boolean-fields-checkboxfield)
        - [Date Fields (`<DateField>`)](#date-fields-datefield)
        - [Listbox/Enum Fields (`<ListboxField>`)](#listboxenum-fields-listboxfield)
        - [Location Fields (`<LocationField>`)](#location-fields-locationfield)
        - [File Fields (`<FileField>`)](#file-fields-filefield)
        - [Recurrence Rule Fields (`<RRuleField>`)](#recurrence-rule-fields-rrulefield)
        - [Array/Collection Fields](#arraycollection-fields)
        - [Wrapper Utilities](#wrapper-utilities)
      - [Example: Rich Zod Schema for Transaction Form](#example-rich-zod-schema-for-transaction-form)
      - [Example: Budget Schema with Conditional Validation](#example-budget-schema-with-conditional-validation)
      - [Cross-Field Validation with `.superRefine()`](#cross-field-validation-with-superrefine)
      - [Common Pitfall: Zod v3 → v4 Breaking Changes](#common-pitfall-zod-v3--v4-breaking-changes)
    - [Step 3: Set Up `useForm`](#step-3-set-up-useform)
    - [Step 4: Replace `defineForm(...)` Chain with JSX Children](#step-4-replace-defineform-chain-with-jsx-children)
    - [Step 5: Map Fields One-to-One](#step-5-map-fields-one-to-one)
    - [Step 6: Handle Conditional Fields](#step-6-handle-conditional-fields)
    - [Step 7: Handle Derived/Computed Listbox Options](#step-7-handle-derivedcomputed-listbox-options)
    - [Step 8: Handle Explicit Form State Access (Zustand patterns)](#step-8-handle-explicit-form-state-access-zustand-patterns)
    - [Step 9: Handle Linked/Cross-Field Validation](#step-9-handle-linkedcross-field-validation)
    - [Step 10: Handle Auto-Focus](#step-10-handle-auto-focus)
    - [Step 11: Remove `.build()` and Return New JSX](#step-11-remove-build-and-return-new-jsx)
    - [Step 12: Clean Up Unused Imports](#step-12-clean-up-unused-imports)
  - [Field Type Mapping Reference](#field-type-mapping-reference)
  - [Old-to-New Prop Mapping](#old-to-new-prop-mapping)
    - [`ListboxField` option shape](#listboxfield-option-shape)
    - [`FileField` props](#filefield-props)
    - [`CheckboxField` props](#checkboxfield-props)
    - [`TextField` with password](#textfield-with-password)
    - [`TextField` with QR scanner](#textfield-with-qr-scanner)
  - [Form Validation Mode (when errors show)](#form-validation-mode-when-errors-show)
  - [Zod Schema Must Mimic the API Shape Exactly](#zod-schema-must-mimic-the-api-shape-exactly)
  - [Common Pitfalls](#common-pitfalls)
    - [1. `zodResolver` requires `@hookform/resolvers`](#1-zodresolver-requires-hookformresolvers)
    - [2. Always use Zod v4 API (not v3)](#2-always-use-zod-v4-api-not-v3)
    - [3. `createDefaultValues` does not handle custom types](#3-createdefaultvalues-does-not-handle-custom-types)
    - [3. Conditional fields + Zod validation conflict](#3-conditional-fields--zod-validation-conflict)
    - [4. `ListboxField` value type mismatch](#4-listboxfield-value-type-mismatch)
    - [5. Always use `useWatch` instead of `form.watch()`](#5-always-use-usewatch-instead-of-formwatch)
    - [6. `FileField` now supports errors natively](#6-filefield-now-supports-errors-natively)
    - [7. `headerActions` replaces `actionButton`](#7-headeractions-replaces-actionbutton)
    - [8. `submitButton` disabled state](#8-submitbutton-disabled-state)
    - [9. Old `defineForm` with `any` type](#9-old-defineform-with-any-type)

---

## Overview of Changes

### Old System

```tsx
import { FormModal, defineForm } from '@lifeforge/ui'

function MyModal({ data: { type }, onClose }) {
  const { formProps } = defineForm<FormDataType>({
    icon: 'tabler:plus',
    title: 'myForm.create',
    namespace: 'apps.myApp',
    submitButton: type,
    onClose
  })
    .typesMap({
      name: 'text',
      age: 'number',
      color: 'color'
    })
    .setupFields({
      name: {
        label: 'Name',
        icon: 'tabler:user',
        placeholder: 'John Doe',
        required: true
      },
      age: {
        label: 'Age',
        icon: 'tabler:number-123'
      },
      color: {
        label: 'Color',
        icon: 'tabler:paint'
      }
    })
    .initialData({ name: '', age: 0 })
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}
```

### New System

```tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import {
  ColorField,
  FormModal,
  NumberField,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.number().nonnegative(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex')
})

function MyModal({ data: { type }, onClose }) {
  const form = useForm({
    defaultValues: createDefaultValues(schema),
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      uiConfig={{
        icon: 'tabler:plus',
        title: 'myForm.create',
        namespace: 'apps.myApp',
        onClose
      }}
      submissionConfig={{
        template: type,
        handler: async data => {
          await mutation.mutateAsync(data)
        }
      }}
    >
      <TextField
        control={form.control}
        name="name"
        label="Name"
        icon="tabler:user"
        placeholder="John Doe"
        required
      />
      <NumberField
        control={form.control}
        name="age"
        label="Age"
        icon="tabler:number-123"
      />
      <ColorField
        control={form.control}
        name="color"
        label="Color"
        icon="tabler:paint"
      />
    </FormModal>
  )
}
```

---

## Migration Checklist by File

For each modal file being migrated, the following must be done:

- [ ] **Imports** - remove `defineForm`, add `useForm`, `zodResolver`, `z`, field components, `createDefaultValues`
- [ ] **Zod schema** - define `z.object({...})` matching the form shape, with validation rules replacing old `validator` functions
- [ ] **`useForm()` call** - set `resolver: zodResolver(schema)` and `defaultValues: createDefaultValues(schema)`, merge any overrides
- [ ] **Remove builder chain** - replace `.typesMap()`, `.setupFields()`, `.initialData()`, `.onSubmit()`, `.build()` with JSX
- [ ] **JSX children** - compose field components (`<TextField>`, `<NumberField>`, etc.) as children of `<FormModal>`
- [ ] **Submission config** - move `onSubmit` logic into `submissionConfig.handler`; pass `mutation.mutateAsync` directly if no data transformation is needed
- [ ] **Conditional fields** - replace `.conditionalFields()` with `useWatch()` + conditional rendering
- [ ] **Derived listbox options** - replace function-based `options: (state) => [...]` with `useWatch()` + computed variable
- [ ] **Explicit state access** - replace `formStateStore` / `formStateStore.getState()` with `form.getValues()` / `form.setValue()`
- [ ] **Cross-field validation** - replace `formStateStore.getState().password` with `schema.superRefine()` in the Zod schema
- [ ] **Auto-focus** - replace `.autoFocusField('name')` with `<TextField autoFocus .../>`
- [ ] **Return** - render `<FormModal>` with the new API

---

## Step-by-Step Migration Procedure

### Step 1: Imports

**Remove these imports:**

```tsx
import { FormModal, defineForm } from '@lifeforge/ui'

// or any destructured combination that includes defineForm
```

**Add these imports:**

```tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import {
  CheckboxField,
  ColorField,
  CurrencyField,
  DateField,
  FileField,
  FormModal,
  IconField,
  ListboxField,
  LocationField,
  NumberField,
  RRuleField,
  SliderField,
  TextAreaField,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'
```

> Import only the field components the modal actually uses.

### Step 2: Define a Zod Schema

Replace the old pattern where you either used a plain TypeScript interface or `InferInput<...>['body']` as the generic type.

Zod v4 is the version used in this project (`zod@4.3.5`). It introduces top-level format factories (e.g., `z.email()`, `z.url()`, `z.uuid()`) alongside the classic chainable methods (`.min()`, `.max()`, `.regex()`, etc.). Prefer the top-level factories - they are the idiomatic v4 way. The instance methods (`.email()`, `.url()`) still exist but are deprecated.

#### Schema Mapping by Field Type

Here is the **correct Zod type to use for each form field type**, utilizing Zod's full API:

##### Text/String Fields (`<TextField>`, `<TextAreaField>`)

| Validation            | Zod Code                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| Required, any string  | `z.string().min(1, 'Required')`                                                                  |
| Optional string       | `z.string().optional()` or **better**: `z.string().optional().catch('')` to keep default as `''` |
| Min/max length        | `z.string().min(3).max(100)`                                                                     |
| Exact length          | `z.string().length(10)`                                                                          |
| Regex pattern         | `z.string().regex(/^[a-zA-Z0-9]+$/, 'Alphanumeric only')`                                        |
| Email                 | `z.email('Invalid email')` (top-level factory)                                                   |
| URL                   | `z.url('Invalid URL')`                                                                           |
| UUID                  | `z.uuid()` - any UUID version                                                                    |
| Color hex             | `z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color (e.g. #FF0000)')`        |
| Icon identifier       | `z.string().regex(/^[a-z]+:[a-z-]+$/)` - or just `z.string()` if you trust the icon picker       |
| Lowercase / Uppercase | `z.string().lowercase()` / `z.string().uppercase()`                                              |
| Trim whitespace       | `z.string().trim()` (overwrites value)                                                           |
| Slug                  | `z.string().slugify()` (converts to URL slug)                                                    |
| Starts/Ends with      | `z.string().startsWith('prefix')` / `.endsWith('suffix')`                                        |
| Contains substring    | `z.string().includes('needle')`                                                                  |
| Phone (E.164)         | `z.e164('Invalid phone number')`                                                                 |
| JWT token             | `z.jwt('Invalid JWT')`                                                                           |
| IP address            | `z.ipv4()` or `z.ipv6()`                                                                         |
| Base64                | `z.base64()`                                                                                     |
| Emoji                 | `z.emoji()`                                                                                      |
| NanoID / CUID / ULID  | `z.nanoid()` / `z.cuid()` / `z.ulid()`                                                           |

> **Important:** Color hex values must always be validated with this regex. The `ColorField` component returns a hex string, but the Zod schema must enforce it - otherwise any string would pass validation. Always use `/^#[0-9A-Fa-f]{6}$/`.
>
> **Note:** In Zod v4, format validators like `z.email()` are top-level factories that return a `ZodString` with the format constraint baked in. You can chain `.optional()`, `.nullable()`, `.default()`, etc. on them just like any schema: `z.email().optional().default('')`.

##### Number Fields (`<NumberField>`, `<CurrencyField>`, `<SliderField>`)

| Validation        | Zod Code                                                     |
| ----------------- | ------------------------------------------------------------ |
| Any number        | `z.number()`                                                 |
| Required non-zero | `z.number().min(0.01)`                                       |
| Non-negative      | `z.number().nonnegative()`                                   |
| Positive          | `z.number().positive()`                                      |
| Negative          | `z.number().negative()`                                      |
| Non-positive      | `z.number().nonpositive()`                                   |
| Integer only      | `z.number().int()`                                           |
| Range             | `z.number().gte(0).lte(100)` or `z.number().min(0).max(100)` |
| Exclusive range   | `z.number().gt(0).lt(100)`                                   |
| Multiple of value | `z.number().multipleOf(0.5)`                                 |
| Specific format   | `z.int()` (integer factory), `z.float32()`, `z.int32()`      |

> **Note:** Use `.int()` for integers. `z.number().safe()` is **deprecated** in v4 (now identical to `.int()`). `z.number().finite()` is a **no-op** in v4 - Infinity is rejected by default.

##### Boolean Fields (`<CheckboxField>`)

| Validation                       | Zod Code                                                 |
| -------------------------------- | -------------------------------------------------------- |
| Boolean (always valid)           | `z.boolean()`                                            |
| Optional boolean (default false) | `z.boolean().default(false)`                             |
| Must be true (accept checkbox)   | `z.boolean().refine(v => v === true, 'You must accept')` |

##### Date Fields (`<DateField>`)

| Validation          | Zod Code                                                           |
| ------------------- | ------------------------------------------------------------------ |
| Any date            | `z.date()`                                                         |
| Future date only    | `z.date().min(new Date(), 'Must be in the future')`                |
| Past date only      | `z.date().max(new Date(), 'Must be in the past')`                  |
| Date range          | `z.date().min(new Date('2020-01-01')).max(new Date('2030-12-31'))` |
| ISO datetime string | `z.iso.datetime()` or `z.datetime()`                               |
| ISO date string     | `z.iso.date()`                                                     |
| ISO time string     | `z.iso.time()`                                                     |
| Nullable date       | `z.date().nullable()`                                              |

##### Listbox/Enum Fields (`<ListboxField>`)

| Validation                      | Zod Code                                     |
| ------------------------------- | -------------------------------------------- |
| Single fixed value              | `z.enum(['income', 'expenses', 'transfer'])` |
| Single string (dynamic options) | `z.string().min(1, 'Required')`              |
| Single numeric ID               | `z.number().int()`                           |
| Multiple strings                | `z.array(z.string()).nonempty()`             |
| Multiple numeric IDs            | `z.array(z.number().int()).min(1)`           |
| Nullable single                 | `z.string().nullable()`                      |
| Nullish single                  | `z.string().nullish()`                       |

##### Location Fields (`<LocationField>`)

| Validation               | Zod Code                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Required location object | `z.object({ name: z.string(), location: z.object({ latitude: z.number(), longitude: z.number() }), formattedAddress: z.string() })`         |
| Optional location        | `z.object({...}).optional()` (use `.optional()` - NOT `.nullable()`, because react-hook-form uses `undefined` for unset fields, not `null`) |

> **Important:** Location fields must use `.optional()`, not `.nullable()`. React-hook-form represents unset/empty fields as `undefined`, and using `.nullable()` (`| null`) creates a type mismatch with the form's `FieldValues` generic. Always use `.optional()` for optional locations. The default value should be `undefined` (or omit it from `defaultValues`) rather than `null`.

##### File Fields (`<FileField>`)

The new form system provides a complete file handling pipeline with three utilities:

- **`fileValueSchema`** - a `z.discriminatedUnion('type', [...])` schema that validates the `FileValue` type (empty / existing / upload / url). Use this instead of `z.any()` for proper type safety.
- **`getFormFileFieldInitialData(forgeAPI, initialData, file)`** - converts raw API data (`File`, filename string, or `null`) into a `FileValue` for the field's `defaultValues`. Handles preview URL generation for existing files.
- **`convertFormFileFieldData(value)`** - converts the `FileValue` back to the format the API expects (`File`, `'keep'`, `'removed'`, or URL string) before submission.

```tsx
import {
  FileField,
  convertFormFileFieldData,
  fileValueSchema,
  getFormFileFieldInitialData
} from '@lifeforge/ui'

const schema = z.object({
  // ... other fields ...
  file: fileValueSchema
})

const form = useForm({
  defaultValues: {
    ...createDefaultValues(schema),
    ...initialData,
    file: getFormFileFieldInitialData(forgeAPI, initialData, initialData?.file)
  },
  resolver: zodResolver(schema)
})

// In the handler:
handler: async formData => {
  await mutation.mutateAsync({
    ...formData,
    file: convertFormFileFieldData(formData.file)
  })
}

return (
  <FormModal ...>
    <FileField
      control={form.control}
      name="file"
      label="File"
      icon="tabler:file"
      mimeTypes={{ font: ['ttf', 'otf', 'woff', 'woff2'] }}
      required
    />
  </FormModal>
)
```

| Validation                | Zod Code                                             |
| ------------------------- | ---------------------------------------------------- |
| Any file (lax, avoid)     | `z.any()`                                            |
| Properly typed file value | `fileValueSchema` (re-exported from `@lifeforge/ui`) |

##### Recurrence Rule Fields (`<RRuleField>`)

| Validation      | Zod Code                          |
| --------------- | --------------------------------- |
| String (rrule)  | `z.string().optional().catch('')` |
| Non-empty rrule | `z.string().min(1).default('')`   |

##### Array/Collection Fields

| Validation      | Zod Code                                                |
| --------------- | ------------------------------------------------------- |
| Non-empty array | `z.array(z.string()).nonempty('At least one required')` |
| Min/max items   | `z.array(z.string()).min(1).max(5)`                     |
| Exact size      | `z.array(z.number()).length(3)`                         |

##### Wrapper Utilities

| Need                           | Zod Code                                                                    |
| ------------------------------ | --------------------------------------------------------------------------- |
| Make a field optional          | `z.string().optional()` → allows `undefined`                                |
| Make a field nullable          | `z.string().nullable()` → allows `null`                                     |
| Both optional + nullable       | `z.string().nullish()` → allows `undefined` or `null`                       |
| Default value                  | `z.string().default('default')` or `z.number().default(0)`                  |
| Catch errors (replace invalid) | `z.string().catch('fallback')` - replaces parse failures with `'fallback'`  |
| Transform value                | `z.string().transform(s => s.toUpperCase())`                                |
| Pipe/chain schemas             | `z.pipe(z.string(), z.number().int())` - parse string, then validate as int |

---

#### Example: Rich Zod Schema for Transaction Form

```tsx
const transactionSchema = z.object({
  type: z.enum(['income', 'expenses', 'transfer']),
  date: z.date({ error: 'Invalid date' }),
  amount: z.number().positive('Amount must be positive').finite(),
  from: z.string().min(1, 'Source asset is required'),
  to: z.string().min(1, 'Destination asset is required'),
  particulars: z.string().min(1, 'Particulars is required').max(500),
  category: z.string().min(1, 'Category is required'),
  asset: z.string().nonempty('Asset is required'),
  ledgers: z.array(z.string()).default([]),
  location: z
    .object({
      name: z.string(),
      location: z.object({
        latitude: z.number().gte(-90).lte(90),
        longitude: z.number().gte(-180).lte(180)
      }),
      formattedAddress: z.string()
    })
    .nullable()
    .default(null),
  receipt: z.any().default({ type: 'empty' })
})
```

#### Example: Budget Schema with Conditional Validation

```tsx
const budgetSchema = z.object({
  amount: z.number().nonnegative('Amount must be non-negative'),
  rollover_enabled: z.boolean(),
  rollover_cap: z.number().nonnegative().optional(),
  alert_threshold: z.number().gte(0).lte(200)
})
```

> The `rollover_cap` field is conditionally rendered - it should be `.optional()` so it doesn't block submission when hidden. The defaults are set in `useForm()`'s `defaultValues`, not in the schema.

#### Cross-Field Validation with `.superRefine()`

When a validation rule depends on multiple fields, use `.superRefine()` on the parent object:

```tsx
const signupSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword']
      })
    }
  })
```

#### Common Pitfall: Zod v3 → v4 Breaking Changes

| What you might write (v3) | What you should write (v4)           | Reason                                    |
| ------------------------- | ------------------------------------ | ----------------------------------------- |
| `z.string().email()`      | `z.email()`                          | Instance method deprecated                |
| `z.string().url()`        | `z.url()`                            | Instance method deprecated                |
| `z.string().uuid()`       | `z.uuid()`                           | Instance method deprecated                |
| `z.string().datetime()`   | `z.iso.datetime()` or `z.datetime()` | Instance method deprecated                |
| `z.string().ip()`         | `z.ipv4()` or `z.ipv6()`             | New top-level factories                   |
| `z.number().safe()`       | `z.number().int()`                   | `.safe()` deprecated; use `.int()`        |
| `z.number().finite()`     | (nothing - skip it)                  | No-op in v4; Infinity rejected by default |
| `z.number().step(0.5)`    | `z.number().multipleOf(0.5)`         | `.step()` deprecated                      |
| `z.nativeEnum(MyEnum)`    | `z.enum(MyEnum)`                     | Merged into single `z.enum()`             |

**If in doubt which API is correct**, check the Zod version: `z.version` at runtime or `node_modules/zod/package.json` - this project uses `zod@4.3.5`, so always write v4-style code.

### Step 3: Set Up `useForm`

```tsx
const form = useForm({
  defaultValues: {
    ...createDefaultValues(schema),
    // override defaults from initialData
    ...initialData
  },
  resolver: zodResolver(schema)
})
```

**Important notes on `defaultValues`:**

- `createDefaultValues(schema)` gives you a complete defaults object (empty strings, zero numbers, etc.).
- Merge `initialData` on top of it: `{ ...createDefaultValues(schema), ...initialData }`.
- The old `.initialData()` method accepted `Partial<FormData>`. The new approach is the same - spread the `initialData` object on top of the defaults.
- For complex fields like `Location`, `date` (Date object conversion), or `file` (FileValue conversion), you must transform the raw API data in the spread, just as you did in the old `.initialData()`.
- **🚨 Default values should NEVER be set via the Zod schema (`.default()`).** Always set them in the `defaultValues` object passed to `useForm()`. The schema should only define validation rules - not business defaults. Defaults like `rollover_cap: 100` or `alert_threshold: 80` belong in the `defaultValues` spread, not in `z.number().default(100)`. Using `.default()` in the schema couples validation logic with default-value logic and makes it harder to override defaults per-modal-instance.

**File field special handling:**

For file fields, use `getFormFileFieldInitialData` to convert the raw API data into a `FileValue` for the initial data, and `convertFormFileFieldData` to convert it back before submission:

```tsx
import {
  createDefaultValues,
  convertFormFileFieldData,
  fileValueSchema,
  getFormFileFieldInitialData
} from '@lifeforge/ui'

const schema = z.object({
  // ... other fields ...
  file: fileValueSchema
})

const form = useForm({
  defaultValues: {
    ...createDefaultValues(schema),
    ...initialData,
    file: getFormFileFieldInitialData(forgeAPI, initialData, initialData?.file)
  },
  resolver: zodResolver(schema)
})

// In submission handler:
submissionConfig={{
  handler: async formData => {
    await mutation.mutateAsync({
      ...formData,
      // Convert FileValue back to API format before sending
      file: convertFormFileFieldData(formData.file)
    })
  }
}}
```

`getFormFileFieldInitialData` returns one of the `FileValue` discriminated union variants:

- `{ type: 'empty' }` - no file selected
- `{ type: 'upload', file, preview? }` - newly uploaded `File` object
- `{ type: 'existing', id, filename, preview? }` - existing file referenced by string ID
- `{ type: 'url', url, preview? }` - external URL

`convertFormFileFieldData` converts back to the format the API expects:

- `'removed'` - file was removed (empty/null/undefined)
- `'keep'` - existing file kept as-is (`type: 'existing'`)
- `File` - newly uploaded file (`type: 'upload'`)
- URL string - external URL (`type: 'url'`)

**Example from ModifyTransactionsModal (old):**

```tsx
.initialData({
  type: initialData?.type || 'income',
  date: initialData ? dayjs(initialData.date).toDate() : dayjs().toDate(),
  amount: initialData?.amount || 0,
  receipt: getFormFileFieldInitialData(initialData, initialData?.receipt),
  ...(initialData?.type === 'transfer'
    ? { from: initialData?.from, to: initialData?.to }
    : { asset: initialData?.asset, ... }
  )
})
```

**Becomes (new):**

```tsx
const defaultValues = {
  // Always fill from Zod defaults first (createDefaultValues handles z.string() -> '', z.number() -> 0, etc.)
  ...createDefaultValues(transactionSchema),
  // Then override with real initial data
  type: initialData?.type || 'income' as const,
  date: initialData ? dayjs(initialData.date).toDate() : dayjs().toDate(),
  amount: initialData?.amount || 0,
  receipt: getFormFileFieldInitialData(initialData, initialData?.receipt),
  ...(initialData?.type === 'transfer'
    ? { from: initialData?.from, to: initialData?.to }
    : { asset: initialData?.asset, category: initialData?.category, ... }
  )
}

const form = useForm({
  defaultValues,
  resolver: zodResolver(transactionSchema)
})
```

> **Why `createDefaultValues(schema)` first?** It guarantees every field exists in the default values object. Without it, react-hook-form will leave fields `undefined` until they're touched, which can cause issues with controlled components. The spread of `initialData` on top overrides the generic defaults with actual data.

### Step 4: Replace `defineForm(...)` Chain with JSX Children

**Old:**

```tsx
const { formProps } = defineForm<FormData>({
  icon: 'tabler:plus',
  title: 'myForm.create',
  namespace: 'apps.myApp',
  submitButton: type,
  onClose
})
  .typesMap({ ... })
  .setupFields({ ... })
  .initialData({ ... })
  .onSubmit(async data => { ... })
  .build()

return <FormModal {...formProps} />
```

**New:**

```tsx
return (
  <FormModal
    form={form}
    uiConfig={{
      icon: 'tabler:plus',
      title: 'myForm.create',
      namespace: 'apps.myApp',
      onClose
    }}
    submissionConfig={{
      template: type, // 'create' | 'update'
      handler: async data => { await mutation.mutateAsync(data) }
    }}
  >
    {/* Children here */}
  </FormModal>
)
```

> ### 🚨 Direct handler rule
>
> If no preprocessing or transformation is needed before the API call, **always** pass the mutation function directly - `handler: mutation.mutateAsync`. This works because `mutation.mutateAsync` already accepts the form data as its argument and returns a promise. Only inline the handler if you need to transform the data first (e.g., `dayjs(date).format('YYYY-MM-DD')`, stripping tracking fields like `_type`, converting `FileValue` with `convertFormFileFieldData`, etc.).
>
> **✅ Correct (no transform needed):**
>
> ```tsx
> submissionConfig={{
>   template: 'create',
>   handler: mutation.mutateAsync
> }}
> ```
>
> **❌ Unnecessary wrapping (no transform needed):**
>
> ```tsx
> submissionConfig={{
>   template: 'create',
>   handler: async data => { await mutation.mutateAsync(data) }
> }}
> ```
>
> **✅ Correct (transform needed):**
>
> ```tsx
> submissionConfig={{
>   handler: async formData => {
>     const { _type: _omit, ...payload } = formData
>     await mutation.mutateAsync(payload)
>   }
> }}
> ```

**`uiConfig` old → new mapping:**

| Old `defineForm` arg | New `uiConfig` prop         | Notes                                                                                 |
| -------------------- | --------------------------- | ------------------------------------------------------------------------------------- |
| `icon`               | `icon`                      | Same                                                                                  |
| `title`              | `title`                     | `modals.` prefix is **auto-prepended** by `FormModal` - do NOT include `modals.` in the title string. E.g. use `title: 'category.create'` (not `'modals.category.create'`). Final locale key resolved to `modals.category.create`. |
| `namespace`          | `namespace`                 | Same                                                                                  |
| `loading`            | `loading`                   | Same                                                                                  |
| `onClose`            | `onClose`                   | Same                                                                                  |
| `actionButton`       | `headerActions`             | `actionButton` was an object, `headerActions` is `React.ReactNode` - wrap in a Button |
| `submitButton`       | (now in `submissionConfig`) | See below                                                                             |

**`submissionConfig` mapping:**

| Old `submitButton` value        | New `submissionConfig`                                     |
| ------------------------------- | ---------------------------------------------------------- |
| `'create'`                      | `{ template: 'create', handler: async data => {...} }`     |
| `'update'`                      | `{ template: 'update', handler: async data => {...} }`     |
| `{ icon, children, ...custom }` | `{ label, icon, disabled?, handler: async data => {...} }` |

### Step 5: Map Fields One-to-One

For each field in `.setupFields({...})`, render the corresponding new field component.

**General rule:**

| Old `.setupFields` config key          | New field component                  | `name` prop value |
| -------------------------------------- | ------------------------------------ | ----------------- |
| `title: { ... }`                       | `<TextField name="title" .../>`      | Same as key       |
| `amount: { ... }` with type `currency` | `<CurrencyField name="amount" .../>` | Same as key       |
| `amount: { ... }` with type `number`   | `<NumberField name="amount" .../>`   | Same as key       |

**Localization Convention for Field Labels:**

Field `label` props are **auto-translated** through the module's i18n namespace (provided by `FormModal`'s `namespace` prop). The locale keys follow this convention:

```json
{
  "inputs": {
    "modifyCollection": {
      "name": "Collection Name"
    },
    "modifyType": {
      "name": "Category Name",
      "icon": "Category Icon"
    },
    "modifyEntry": {
      "name": "Music Name",
      "author": "Author",
      "type": "Score Type",
      "collection": "Collection"
    }
  }
}
```

The label prop references the key **after** `inputs.` - e.g. `label="modifyEntry.name"` resolves to `inputs.modifyEntry.name` in the locale file. There is no `inputs.` prefix needed in the label prop - the `FieldWrapper` component auto-prepends the `inputs.` namespace segment.

> 💡 **Why this convention?** The `inputs.` grouping in the locale file keeps all form field labels organized under one section, while the label prop stays short and focused on the modal-specific key. Each modal gets its own sub-object under `inputs` (e.g. `modifyCollection`, `modifyEntry`, `modifyType`), avoiding flat naming collisions.

**Old field config property → new field prop mapping:**

| Old `.setupFields` property | New prop                                                     | Remarks                                                                                                                         |
| --------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `icon`                      | `icon`                                                       | Same                                                                                                                            |
| `required`                  | `required`                                                   | Same                                                                                                                            |
| `placeholder`               | `placeholder`                                                | Same                                                                                                                            |
| `multiple`                  | `multiple`                                                   | Only for `ListboxField`                                                                                                         |
| `options` (array)           | `options`                                                    | Static array, same shape                                                                                                        |
| `options` (function)        | See [Step 7](#step-7-handle-derivedcomputed-listbox-options) | Removed                                                                                                                         |
| `actionButtonOption`        | `actionButtonOption`                                         | Only for `ListboxField`                                                                                                         |
| `validator` (function)      | (moved to Zod schema field)                                  | Replaced by Zod validation                                                                                                      |
| `validator` (Zod schema)    | (moved to Zod schema field)                                  | Replaced by direct Zod in schema definition                                                                                     |
| `optional`                  | (moved to Zod schema)                                        | Use `z.any().optional()` in schema                                                                                              |
| `disabled`                  | `disabled`                                                   | Same                                                                                                                            |
| `acceptedMimeTypes`         | `mimeTypes`                                                  | Only for `FileField`                                                                                                            |
| `hasDuration`               | `hasDuration`                                                | Only for `RRuleField`                                                                                                           |
| `reminderText`              | `reminderText`                                               | Only for `FileField`                                                                                                            |
| `onImageRemoved`            | `onImageRemoved`                                             | Only for `FileField`                                                                                                            |
| `sources`                   | `sources`                                                    | Only for `FileField`                                                                                                            |
| `autoFocus`                 | `autoFocus`                                                  | Same - moved from `.autoFocusField()` to the field component itself                                                             |
| `qrScanner`                 | N/A in old system                                            | Only in new `TextField`                                                                                                         |
| `isPassword`                | N/A in old system                                            | Only in new `TextField`                                                                                                         |
| `actionButtonProps`         | `actionButtonProps`                                          | Only for `TextField` - this is the underlying `TextInput`'s action button, different from `ListboxField`'s `actionButtonOption` |

**Note:** In the old system, each field config could have arbitrary additional props that were spread onto the input. In the new system, props must explicitly match the field component's prop type. Check each field component's props carefully (see [Field Type Mapping Reference](#field-type-mapping-reference)).

### Step 6: Handle Conditional Fields

Conditional fields were done via `.conditionalFields({ fieldName: (data) => boolean })`.

In the new system, use `useWatch` + conditional rendering:

**Old:**

```tsx
.conditionalFields({
  rollover_cap: data => data.rollover_enabled === true
})
.initialData({ rollover_enabled: false, ... })
```

**New:**

```tsx
import { useWatch } from 'react-hook-form'

const rolloverEnabled = useWatch({ control: form.control, name: 'rollover_enabled' })

return (
  <FormModal ...>
    <CheckboxField
      control={form.control}
      name="rollover_enabled"
      label="Enable Rollover"
      icon="tabler:refresh"
    />
    {rolloverEnabled && (
      <NumberField
        control={form.control}
        name="rollover_cap"
        label="Rollover Cap"
        icon="tabler:percentage"
      />
    )}
    ...
  </FormModal>
)
```

**Important:** Fields that are conditionally hidden should not be required in the Zod schema, OR use `.optional()` or `.nullable()` on them. You cannot have a `z.string().min(1)` on a field that might not render.

### Step 7: Handle Derived/Computed Listbox Options

In the old system, `options` could be a function `(formState) => [...]` that received the current Zustand state.

In the new system, use `useWatch` to reactively compute options:

**Old:**

```tsx
.setupFields({
  category: {
    options: value =>
      categories
        .filter(cat => cat.type === value.type)
        .map(cat => ({ text: cat.name, value: cat.id, ... }))
  }
})
```

**New:**

```tsx
import { useWatch } from 'react-hook-form'

const watchedType = useWatch({ control: form.control, name: 'type' })

const categoryOptions = categories
  .filter(cat => cat.type === watchedType)
  .map(cat => ({ text: cat.name, value: cat.id, icon: cat.icon, color: cat.color }))

return (
  <ListboxField
    control={form.control}
    name="category"
    label="Category"
    icon="tabler:category"
    required
    options={categoryOptions}
    actionButtonOption={...}
  />
)
```

### Step 8: Handle Explicit Form State Access (Zustand patterns)

In the old system, you could destructure `formStateStore` from the return of `defineForm()`:

```tsx
const { formProps, formStateStore } = defineForm<...>({...}).build()
// Later: formStateStore.getState(), formStateStore.subscribe(...)
formStateStore.getState().type  // access type from any context
```

In the new system, this is replaced by `react-hook-form`'s API:

| Old Zustand pattern                                                           | New `react-hook-form` equivalent                                                     |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `formStateStore.getState()`                                                   | `form.getValues()`                                                                   |
| `formStateStore.getState().fieldName`                                         | `form.getValues('fieldName')`                                                        |
| `formStateStore.subscribe(callback)`                                          | `useWatch({ control })` in render, or `form.watch((data) => {...})` for side-effects |
| `setData(old => ({ ...old, key: val }))`                                      | `form.setValue('key', val)`                                                          |
| `formStateStore.getState().fieldName` in field's `actionButtonOption.onClick` | Just use JS closure - `form` is available in the component scope                     |

> **Important:** When using `form.setValue()` programmatically (not triggered by user input), pass `{ shouldValidate: true }` as the third argument to ensure the new value is validated immediately. Without this, the error state won't update until the next user interaction. Example: `form.setValue('family', metadata.family, { shouldValidate: true })`.

**Example - old `actionButtonOption` accessing `formStateStore`:**

```tsx
// Old: within .setupFields, actionButtonOption.onClick receives (data, setData)
category: {
  actionButtonOption: {
    onClick: (data, setData) => {
      const type = data.type // from Zustand store
      open(ModifyCategoryModal, { type: 'create', initialData: { type } })
    }
  }
}
```

```tsx
// New: use useWatch or form.getValues in the closure
const type = useWatch({ control: form.control, name: 'type' })

<ListboxField
  actionButtonOption={{
    onClick: () => {
      open(ModifyCategoryModal, { type: 'create', initialData: { type } })
    }
  }}
/>
```

### Step 9: Handle Linked/Cross-Field Validation

In the old system, cross-field validation was done by reading `formStateStore.getState()` inside a field's `validator` function. This was a hack.

In the new system, use Zod's `.superRefine()` on the entire schema:

**Old:**

```tsx
.setupFields({
  password: { ... },
  confirmPassword: {
    validator: (value) => {
      if (value !== formStateStore.getState().password) {
        return 'Passwords do not match'
      }
      return true
    }
  }
})
```

**New:**

```tsx
const schema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string()
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword']
      })
    }
  })
```

### Step 10: Handle Auto-Focus

**Old:**

```tsx
.autoFocusField('name')
```

**New:**

```tsx
<TextField autoFocus control={form.control} name="name" .../>
```

Add the `autoFocus` prop to the field component that should receive initial focus.

### Step 11: Remove `.build()` and Return New JSX

After composing all fields as JSX children, remove the old return:

```tsx
// OLD:
const { formProps } = defineForm<...>({...})
  .typesMap({...})
  .setupFields({...})
  .initialData({...})
  .onSubmit(async data => {...})
  .build()

return <FormModal {...formProps} />

// NEW:
return (
  <FormModal
    form={form}
    uiConfig={{...}}
    submissionConfig={{...}}
  >
    <TextField .../>
    <NumberField .../>
    ...
  </FormModal>
)
```

### Step 12: Clean Up Unused Imports

After migration, remove unused imports:

- Remove `defineForm` from the `@lifeforge/ui` import
- Remove `InferInput` from `@lifeforge/shared` import if it is no longer needed elsewhere in the file
- Remove old utility imports like `getFormFileFieldInitialData` if the data transformation logic has been inlined into `defaultValues`

Run the following commands from the root directory to lint and format the migrated file:

```
pnpm eslint <path-to-file> --fix
pnpm prettier --write <path-to-file> --config ./.prettierrc
```

Replace `<path-to-file>` with the actual path of the migrated file (e.g., `apps/lifeforge--achievements/client/src/components/modals/ModifyAchievementModal.tsx`). ESLint will catch unused imports, type errors, and other issues; Prettier will format the output.

---

## Field Type Mapping Reference

The table below maps the old `typesMap` type strings to the new field components.

| Old `.typesMap()` value | New Component     | Notes                                          |
| ----------------------- | ----------------- | ---------------------------------------------- |
| `'text'`                | `<TextField>`     | `name` constrained to `string`                 |
| `'textarea'`            | `<TextAreaField>` | `name` constrained to `string`                 |
| `'number'`              | `<NumberField>`   | `name` constrained to `number`                 |
| `'currency'`            | `<CurrencyField>` | `name` constrained to `number`                 |
| `'checkbox'`            | `<CheckboxField>` | `name` constrained to `boolean`                |
| `'color'`               | `<ColorField>`    | `name` constrained to `string`                 |
| `'datetime'`            | `<DateField>`     | `name` constrained to `Date \| null \| string` |
| `'icon'`                | `<IconField>`     | `name` constrained to `string`                 |
| `'listbox'`             | `<ListboxField>`  | Generic `TOption` - single or multi select     |
| `'location'`            | `<LocationField>` | `name` constrained to `Location \| null`       |
| `'file'`                | `<FileField>`     | `name` constrained to `FileValue`              |
| `'rrule'`               | `<RRuleField>`    | `name` constrained to `string`                 |
| `'slider'`              | `<SliderField>`   | `name` constrained to `number`                 |

---

## Old-to-New Prop Mapping

### `ListboxField` option shape

Old (old system):

```tsx
{ text: string, value: string, icon?: string, color?: string }
```

New (new system):

```tsx
{ text: string, value: TOption, icon?: string, color?: string }
```

Same shape - generic `value` type instead of always `string`.

### `FileField` props

Old `.setupFields` config:

```tsx
receipt: {
  label: 'Receipt',
  icon: 'tabler:receipt',
  optional: true,
  acceptedMimeTypes: { image: ['png', 'jpeg', 'webp'], application: ['pdf'] }
}
```

New JSX:

```tsx
<FileField
  control={form.control}
  name="receipt"
  label="Receipt"
  icon="tabler:receipt"
  mimeTypes={{ image: ['png', 'jpeg', 'webp'], application: ['pdf'] }}
/>
```

> Note: `optional` in the old system has no direct equivalent in `FileField`. To make a field optional in the Zod schema, use `.optional()`, e.g., `receipt: z.any().optional()`.
>
> `FileField` now supports error validation - `fieldState.error?.message` is automatically passed to the underlying `FileInput`. You can also pass an explicit `errorMsg` prop to override the field state error.

### `CheckboxField` props

Old:

```tsx
rollover_enabled: { label: 'Enable Rollover', icon: 'tabler:refresh' }
```

New:

```tsx
<CheckboxField
  control={form.control}
  name="rollover_enabled"
  label="Enable Rollover"
  icon="tabler:refresh"
/>
```

> Note: `CheckboxField` does not have a `required` prop. Use `z.boolean()` in the Zod schema (a boolean is always valid).

### `TextField` with password

Old: No built-in password support in old system (was just `type: 'text'` with manual masking).

New:

```tsx
<TextField
  control={form.control}
  name="password"
  label="Password"
  icon="tabler:lock"
  isPassword
  placeholder="••••••••"
/>
```

### `TextField` with QR scanner

Old: No built-in QR scanner support.

New:

```tsx
<TextField
  control={form.control}
  name="secret"
  label="Secret"
  icon="tabler:key"
  qrScanner
/>
```

---

## Form Validation Mode (when errors show)

By default, react-hook-form validates **on submit** (`mode: 'onSubmit'`). This matches the old system's behavior - validation only runs when the user clicks the submit button.

If you need real-time validation (e.g., to enable/disable the submit button dynamically), pass `mode` to `useForm`. **`'all'` is the preferred mode** - it validates on both blur and change:

```tsx
const form = useForm({
  mode: 'all', // preferred - validates on blur and every change
  defaultValues: ...,
  resolver: zodResolver(schema)
})
```

**Available modes:**

| Mode                   | Behavior                                                           |
| ---------------------- | ------------------------------------------------------------------ |
| `'onSubmit'` (default) | Validates only on form submission                                  |
| `'onBlur'`             | Validates when a field loses focus                                 |
| `'onChange'`           | Validates on every value change (keystroke, checkbox toggle, etc.) |
| `'onTouched'`          | Validates after a field has been touched and on subsequent changes |
| `'all'`                | Validates on both blur and change                                  |

If you use `mode: 'onChange'`, you can check `form.formState.isValid` to disable the submit button:

```tsx
const { isValid } = form.formState

<FormModal
  form={form}
  submissionConfig={{
    template: 'create',
    disabled: !isValid,
    handler: async data => { ... }
  }}
>
```

> **Recommendation:** Always use `mode: 'all'`. It validates on both blur and change, giving the most responsive feedback - errors clear as the user types and appear as soon as they tab away.
>
> **Important:** Since users will see errors in real time, every error message defined in the Zod schema must be clear and concise - tell the user exactly what's wrong and what's expected. Bad: `"Invalid input"`. Good: `"Name must be at least 3 characters"` or `"Amount must be a positive number"`. Review all `.min()`, `.max()`, `.regex()`, `.email()`, `.refine()` messages to ensure they are user-friendly.

---

## Zod Schema Must Mimic the API Shape Exactly

When migrating from `InferInput<typeof forgeAPI.x.create>['body']`, you might be tempted to define a loose schema. However, the TypeScript types will be validated at the **mutation call site** - when you pass `formData` to `mutation.mutateAsync(formData)`, TypeScript will check that the form data matches what the API expects. If the Zod schema produces a shape that differs from the API's `InferInput`, you'll get a type error on the mutation line.

Therefore, the Zod schema must **mimic the required shape of the ForgeAPI endpoint exactly**. Use `InferInput<typeof forgeAPI.x.create>['body']` as a reference while writing the schema, or define the schema alongside it.

**Where to find the exact shape:** Each and every module has a `contract.ts` file that defines the API contract as JSON Schema objects. Foe example:

| Codebase     | File                                                  |
| ------------ | ----------------------------------------------------- |
| Achievements | `apps/lifeforge--achievements/client/src/contract.ts` |
| Wallet       | `apps/lifeforge--wallet/client/src/contract.ts`       |
| Core client  | `client/src/contract.ts`                              |

These `contract.ts` files contain the full input/output schemas for every endpoint. Open the relevant one and look at the `input.body.properties` for the endpoint you're migrating - that's the exact shape your Zod schema must match.

```tsx
import type { InferInput } from '@lifeforge/shared'

type TransactionBody = InferInput<typeof forgeAPI.transactions.create>['body']

const transactionSchema = z.object({
  type: z.enum(['income', 'expenses', 'transfer']) as z.ZodType<
    TransactionBody['type']
  >,
  date: z.date(),
  amount: z.number().positive()
  // ... every field must match TransactionBody
})
```

> Using `as z.ZodType<...>` on individual fields is optional (and should be avoided unless you're debugging) but helps catch mismatches early. At minimum, ensure the final inferred type from `z.infer<typeof transactionSchema>` is structurally compatible with `TransactionBody`.

---

## Common Pitfalls

### 1. `zodResolver` requires `@hookform/resolvers`

This is a separate package. Ensure it is installed in the consuming app's `package.json`:

```
pnpm add @hookform/resolvers
```

### 2. Always use Zod v4 API (not v3)

This project uses `zod@4.3.5`. The v4 API uses top-level factories for format validation (`z.email()`, `z.url()`, `z.uuid()`) instead of instance methods (`z.string().email()`). The instance methods still exist but are deprecated and may be removed in a future version. Always write v4-style code.

**✅ Correct:**

```tsx
const schema = z.object({
  email: z.email('Invalid email'),
  website: z.url('Invalid URL'),
  id: z.uuid()
})
```

**❌ Avoid (deprecated v3 style):**

```tsx
const schema = z.object({
  email: z.string().email('Invalid email'),
  website: z.string().url('Invalid URL'),
  id: z.string().uuid()
})
```

### 3. `createDefaultValues` does not handle custom types

`createDefaultValues` only understands native Zod types (`z.string()`, `z.number()`, etc.). If a field is `z.any()` or a custom type like `fileValueSchema` (a `z.discriminatedUnion`), `createDefaultValues` returns `undefined`. You **must** override the default for that field manually using `getFormFileFieldInitialData`:

```tsx
import { createDefaultValues, getFormFileFieldInitialData } from '@lifeforge/ui'

const form = useForm({
  defaultValues: {
    ...createDefaultValues(schema),
    file: getFormFileFieldInitialData(forgeAPI, initialData, initialData?.file)
  },
  resolver: zodResolver(schema)
})
```

### 3. Conditional fields + Zod validation conflict

If a field is conditionally hidden but still required by the schema, the form will not submit. Make conditionally-hidden fields optional in the schema:

```tsx
const schema = z.object({
  rollover_enabled: z.boolean(),
  rollover_cap: z.number().optional(), // optional because it may be hidden
  ...
})
```

### 4. `ListboxField` value type mismatch

The old system's listbox always stored `string` values. In the new system, `ListboxField<TOption>` uses a generic type. If your listbox's value is a number, boolean, or object, ensure your Zod schema reflects the correct type.

### 5. Always use `useWatch` instead of `form.watch()`

Calling `form.watch('fieldName')` in the render path re-renders the entire component on every change to that field. Use `useWatch` from `react-hook-form` - it isolates the re-render to only the fields you're watching:

```tsx
import { useWatch } from 'react-hook-form'

const overrideKey = useWatch({ control: form.control, name: 'overrideKey' })
```

This applies everywhere you need to reactively read form values in the render path:

- Conditional field visibility (Step 6)
- Derived/computed listbox options (Step 7)
- Any other render-time value reading from the form

**Never use `form.watch()` in the render path.** Reserve `form.watch()` only for side-effect callbacks (e.g., `form.watch(data => console.log(data))`).

### 6. `FileField` now supports errors natively

Unlike the old system, `FileField` now displays `fieldState.error?.message` from react-hook-form automatically. An explicit `errorMsg` prop can also be passed to override it. No special handling needed.

### 7. `headerActions` replaces `actionButton`

The old `actionButton` was a single config object. The new `headerActions` is any `React.ReactNode`. Wrap your button:

```tsx
uiConfig={{
  ...
  headerActions: (
    <Button icon="tabler:custom" variant="plain" onClick={...}>Action</Button>
  )
}}
```

### 8. `submitButton` disabled state

In the old system, there was no standard way to disable the submit button. In the new system, add `disabled: true` to `submissionConfig`:

```tsx
submissionConfig={{
  template: 'create',
  disabled: !isFormValid,
  handler: async data => { ... }
}}
```

### 9. Old `defineForm` with `any` type

Some modals (like `CreateBackupModal`) use `defineForm<any>(...)`. These must be migrated to a properly constructed Zod schema that matches the API shape, just like any other modal. Avoid `z.any()` - the whole point of the new system is type safety. If the schema is complex, break it down field by field matching the actual expected types from `InferInput<typeof forgeAPI.x.create>['body']`.
