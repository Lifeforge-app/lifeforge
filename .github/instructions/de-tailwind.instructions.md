---
applyTo: "packages/lifeforge-ui/src/**"
---

# De-Tailwind Instructions for lifeforge-ui

## Overview

Replace all Tailwind utility classes in components and stories with vanilla-extract
CSS-in-JS and the `lifeforge-ui` primitive components. The goal is zero Tailwind
in component/story source files while **preserving every pixel of styling logic**.

---

## Step 0 — Read Before You Write

Before touching any file, read:

1. The **full component source** — understand every conditional class, every
   dark-mode variant, every hover/focus state.
2. The **primitive component prop types** (see §1 below) — know exactly which
   props are available so you don't reach for `style={}` when a prop exists.
3. The **space token table** (see §2 below) — map Tailwind spacing to tokens
   before writing a single line.

---

## §1 — Primitive Components

Import from `@components/primitives`.

### `Box`

General-purpose block element. Accepts all [Layout Props] + [Margin Props].

```tsx
<Box
  as="section"          // any HTML tag (default: div)
  display="block"       // 'block' | 'inline' | 'inline-block' | 'none' | 'contents'
  bg="bg-100"           // background color token
  rounded="md"          // border-radius token: 'none'|'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'full'
  // Layout props (CSS strings, responsive):
  width="100%"
  minWidth="0"
  maxWidth="48rem"
  height="100%"
  // Positioning:
  position="relative"   // 'static'|'relative'|'absolute'|'fixed'|'sticky'
  inset="0"
  top="0" right="0" bottom="0" left="0"
  overflow="hidden"     // 'visible'|'hidden'|'scroll'|'auto'
  overflowX="auto"
  overflowY="hidden"
  // Grid-child props (CSS strings):
  gridColumn="span 2 / span 2"
  gridRow="span 2 / span 2"
  flexBasis="0" flexGrow="1" flexShrink="0"
  // Padding (SpaceToken):
  p="md" px="lg" py="sm" pt="xs" pr="md" pb="sm" pl="xl"
  // Margin (SpaceToken):
  m="md" mx="auto" my="lg" mt="xs" mr="sm" mb="md" ml="xl"
  className="extra-class"
  style={{ /* arbitrary overrides */ }}
/>
```

### `Flex`

Flexbox container.

```tsx
<Flex
  as="h2"
  display="flex"           // 'flex' | 'inline-flex' | 'none'
  direction="row"          // 'row'|'column'|'row-reverse'|'column-reverse'
  align="center"           // 'stretch'|'center'|'start'|'end'|'baseline'
  justify="between"        // 'start'|'center'|'between'|'around'|'evenly'|'end'
  wrap="wrap"              // 'nowrap'|'wrap'|'wrap-reverse'
  gap="md"                 // SpaceToken
  gapX="sm" gapY="lg"
  flexShrink="0"           // CSS string '0'|'1'
  flexGrow="1"
  // + all Box layout/margin/padding props
/>
```

### `Grid`

CSS Grid container.

```tsx
<Grid
  columns="repeat(3, minmax(0, 1fr))"   // CSS string → gridTemplateColumns
  rows="repeat(3, minmax(0, 1fr))"      // CSS string → gridTemplateRows
  gap="lg"
  gapX="sm" gapY="md"
  align="center"          // 'stretch'|'center'|'start'|'end'|'baseline'
  justify="between"       // 'start'|'center'|'end'|'between'
  flow="row"              // 'row'|'column'|'dense'|'row dense'|'column dense'
  // + all Box layout/margin/padding props
/>
```

### `Text`

Inline text/span. Renders as `<span>` by default.

```tsx
<Text
  as="p"                  // any HTML tag
  size="lg"               // 'sm'|'base'|'lg'|'xl'|'2xl'|...|'9xl'
  color="bg-600"          // 'default'|'muted'|'primary'|'inherit'|'bg-50'…'bg-950'|'custom-50'…'custom-900'
  weight="semibold"       // 'normal'|'medium'|'semibold'|'bold'
  align="center"          // 'left'|'center'|'right'
  decoration="underline"
  transform="uppercase"
  wrap="nowrap"
  truncate                // overflow:hidden + ellipsis (shorthand boolean — list BEFORE other props)
  lineClamp={3}
  // Margin props only (no padding)
  m="sm" mx="auto" mt="xs"
/>
```

### Responsive props

All `SpaceToken` and most other props accept a responsive object:

```tsx
<Text size={{ base: 'lg', sm: 'xl' }} />
<Flex p={{ base: 'sm', sm: 'md' }} />
```

Breakpoints: `base` | `sm` (640px) | `md` (768px) | `lg` (1024px) | `xl` (1280px) | `2xl` (1536px)

---

## §2 — Space Token Reference

`--spacing` is Tailwind's default `0.25rem` per unit.

| SpaceToken | Value                  | Tailwind equivalent   |
|------------|------------------------|-----------------------|
| `none`     | `0`                    | `0`                   |
| `xs`       | `calc(var(--spacing) * 1)` = 0.25rem | `1`   |
| `sm`       | `calc(var(--spacing) * 2)` = 0.5rem  | `2`   |
| `md`       | `calc(var(--spacing) * 4)` = 1rem    | `4`   |
| `lg`       | `calc(var(--spacing) * 6)` = 1.5rem  | `6`   |
| `xl`       | `calc(var(--spacing) * 8)` = 2rem    | `8`   |
| `2xl`      | `calc(var(--spacing) * 12)` = 3rem   | `12`  |
| `3xl`      | `calc(var(--spacing) * 16)` = 4rem   | `16`  |

Spacing values **not** in the token table (e.g. `gap-3` = 0.75rem, arbitrary
`mt-[30%]`) must use an inline `style` prop:

```tsx
<Grid style={{ gap: '0.75rem', marginTop: '30%' }} />
```

---

## §3 — Common Tailwind → Primitive Mapping

| Tailwind class                     | Primitive equivalent                                     |
|------------------------------------|----------------------------------------------------------|
| `flex`                             | `<Flex>`                                                 |
| `flex flex-col`                    | `<Flex direction="column">`                              |
| `flex items-center justify-center` | `<Flex align="center" justify="center">`                 |
| `flex items-center justify-between`| `<Flex align="center" justify="between">`                |
| `flex-center` (utility)            | `<Flex align="center" justify="center">`                 |
| `grid grid-cols-3`                 | `<Grid columns="repeat(3, minmax(0, 1fr))">`             |
| `gap-6`                            | `gap="lg"`                                               |
| `p-16`                             | `p="3xl"`                                                |
| `px-16`                            | `px="3xl"`                                               |
| `w-full`                           | `width="100%"`                                           |
| `h-full`                           | `height="100%"`                                          |
| `min-w-0`                          | `minWidth="0"`                                           |
| `min-w-64`                         | `minWidth="16rem"`                                       |
| `size-full`                        | `width="100%" height="100%"` on a `<Box>` or `<Flex>`   |
| `col-span-2`                       | `gridColumn="span 2 / span 2"` on a wrapping `<Box>`    |
| `row-span-2`                       | `gridRow="span 2 / span 2"` on a wrapping `<Box>`       |
| `shrink-0`                         | `flexShrink="0"`                                         |
| `text-bg-500`                      | `<Text color="bg-500">`                                  |
| `text-lg`                          | `<Text size="lg">`                                       |
| `font-semibold`                    | `<Text weight="semibold">`                               |
| `truncate`                         | `<Text truncate>` — **shorthand must come first**        |
| `text-lg sm:text-xl`               | `<Text size={{ base: 'lg', sm: 'xl' }}>`                 |
| `overflow-hidden`                  | `overflow="hidden"`                                      |
| `position-relative`                | `position="relative"`                                    |
| `mb-1`                             | `mb="xs"`                                                |
| `p-2 sm:p-4`                       | `p={{ base: 'sm', sm: 'md' }}`                           |

---

## §4 — De-Tailwinding Stories (`.stories.tsx`)

**Rule: Use primitives only. No `.css.ts` needed.**

### Checklist

- [ ] Replace every `<div className="flex ...">` with `<Flex>` + corresponding props
- [ ] Replace every `<div className="grid ...">` with `<Grid>` + corresponding props
- [ ] Replace every `<div>` wrapper (no layout) with `<Box>`
- [ ] Replace `<p className="text-...">` with `<Text as="p" ...>`
- [ ] Replace `<span className="text-...">` with `<Text ...>`
- [ ] Move `col-span-*` / `row-span-*` from the child component `className` to a
      wrapping `<Box gridColumn="..." gridRow="...">` around it
- [ ] Spacing not in token table → `style={{ ... }}`
- [ ] Remove the `tailwindcss/colors` import if `COLORS` is only used for story
      data (keep it if it feeds `iconColor` props etc.)
- [ ] Update imports: add `Box`, `Flex`, `Grid`, `Text` from `@components/primitives`,
      remove any now-unused imports

### Prop ordering lint rules

JSX props must be **alphabetical**, except:
- `ref` — always **first**
- Boolean shorthand props (e.g. `truncate`) — always **before** other props

---

## §5 — De-Tailwinding Components (`.tsx` + `.css.ts`)

**Rule: Use primitives for layout structure; create `ComponentName.css.ts` for
all theming, color, shadow, hover, dark-mode, and state-variant styles.**

### Workflow

1. **Identify styling categories** in the component:
   - *Layout* (display, flex/grid, gap, padding, margin, width, height,
     overflow, position) → **primitive props**
   - *Theming* (background color, border color, shadow, border-radius, opacity,
     dark mode, `.bordered` / `.has-bg-image` context selectors) → **`.css.ts`**
   - *Interactive* (hover, focus, active, transition) → **`.css.ts`**
   - *Responsive font sizes / padding* that are theming-flavoured → **`.css.ts`
     `@media` blocks** or **responsive primitive props** (prefer primitive props
     when the value maps to a token)

2. **Create `ComponentName.css.ts`** next to the component file.

3. **Export one `style()` per logical role** — name exports by purpose, not by
   Tailwind class names.

4. **Import and use** with `import * as styles from './ComponentName.css'` and
   `className={clsx(styles.foo, condition && styles.bar)}`.

### `.css.ts` template

```ts
import { style } from '@vanilla-extract/css'

import { bg } from '@/styles/vanilla-extract'
import { withOpacity } from '@/styles/vanilla-extract/utils'

import { vars } from '../../system'

export const someRole = style({
  // Use bg[n] tokens — NEVER raw hex strings or var(--color-bg-*) directly
  backgroundColor: bg[50],
  selectors: {
    '.dark &': { backgroundColor: bg[900] },
    '&:hover': { backgroundColor: bg[100] }
  }
})
```

### Token helpers

| Need                        | Code                                      |
|-----------------------------|-------------------------------------------|
| Background color            | `bg[50]` … `bg[950]`                      |
| Color with opacity          | `withOpacity(bg[500], 0.1)`               |
| Border radius               | `vars.radii.sm/md/lg/xl/2xl/3xl/full`     |
| Space value                 | `vars.space.xs/sm/md/lg/xl/2xl/3xl`       |
| Font size                   | `vars.fontSize.sm/base/lg/xl/.../9xl`     |
| Font weight                 | `vars.fontWeight.normal/medium/semibold/bold` |
| Box shadow (`shadow-custom`)| `boxShadow: 'var(--custom-shadow)'`       |

### Common Tailwind utility → `.css.ts` mapping

| Tailwind utility            | `.css.ts` equivalent                                         |
|-----------------------------|--------------------------------------------------------------|
| `component-bg`              | `backgroundColor: bg[50]` + `.dark &` → `bg[900]`           |
| `component-bg-lighter`      | `backgroundColor: bg[100]` + `.dark &` → `withOpacity(bg[800], 0.5)` |
| `shadow-custom`             | `boxShadow: 'var(--custom-shadow)'`                          |
| `border-bg-500/20`          | `borderColor: withOpacity(bg[500], 0.2)`                     |
| `bg-bg-500/10`              | `backgroundColor: withOpacity(bg[500], 0.1)`                 |
| `text-bg-500 dark:text-bg-50` | `color: bg[500]` + `.dark &` → `color: bg[50]`             |
| `in-[.bordered]:border-2`   | `selectors: { '.bordered &': { borderWidth: '2px', borderStyle: 'solid' } }` |
| `hover:bg-bg-100`           | `selectors: { '&:hover': { backgroundColor: bg[100] } }`    |
| `transition-all`            | `transition: 'all 0.2s'`                                     |
| `rounded-lg`                | `borderRadius: vars.radii.lg`                                |
| `text-2xl sm:text-3xl`      | `fontSize: vars.fontSize['2xl'], '@media': { '(min-width: 640px)': { fontSize: vars.fontSize['3xl'] } }` |

### What stays in `.css.ts` vs moves to primitive props

| Property                         | Where                    |
|----------------------------------|--------------------------|
| `display`, `flexDirection`, `gap`, `padding`, `margin`, `width`, `height`, `overflow`, `position` | **Primitive prop** |
| `backgroundColor` (theme-aware)  | **`.css.ts`**            |
| `borderColor` (theme-aware)      | **`.css.ts`**            |
| `borderRadius`                   | **`.css.ts`** (or `rounded` prop on `Box`) |
| `boxShadow`                      | **`.css.ts`**            |
| `color` (theme-aware or interactive) | **`.css.ts`**        |
| `fontWeight`, `fontSize`         | **`<Text weight= size=>`** |
| `transition`, `hover`, `focus`   | **`.css.ts`**            |
| Dark-mode selectors              | **`.css.ts`**            |
| Context selectors (`.bordered &`, `.dark &`) | **`.css.ts`** |

---

## §6 — Preservation Checklist

Before calling done, verify every item from the original:

- [ ] All conditional class logic is reproduced (variant props, boolean flags)
- [ ] All dark-mode styles are present (`.dark &` selectors in `.css.ts`)
- [ ] All responsive styles are present (`@media` blocks or responsive props)
- [ ] All hover/focus/active states are present
- [ ] All context-selector styles are present (`.bordered &`, `.has-bg-image &`)
- [ ] `iconColor` / dynamic inline styles that can't be tokenised are still
      passed as `style={{ backgroundColor: ... }}` on the relevant primitive
- [ ] No Tailwind utility classes remain in the file (search for `className="` 
      containing any bare Tailwind class names)
- [ ] `get_errors` reports zero TypeScript errors after all edits

---

## §7 — Examples

### Story: grid wrapper with spanning children

```tsx
// Before
<div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-6 p-16">
  <Widget className="col-span-2 row-span-2" />
</div>

// After
<Grid
  columns="repeat(3, minmax(0, 1fr))"
  gap="lg"
  height="100%"
  p="3xl"
  rows="repeat(3, minmax(0, 1fr))"
  width="100%"
>
  <Box gridColumn="span 2 / span 2" gridRow="span 2 / span 2">
    <Widget />
  </Box>
</Grid>
```

### Component: themed wrapper div

```tsx
// Before
<div className="shadow-custom component-bg border-bg-500/20 flex size-full flex-col gap-6 rounded-lg p-4 in-[.bordered]:border-2">

// Widget.css.ts
export const wrapper = style({
  boxShadow: 'var(--custom-shadow)',
  backgroundColor: bg[50],
  borderColor: withOpacity(bg[500], 0.2),
  borderRadius: vars.radii.lg,
  selectors: {
    '.dark &': { backgroundColor: bg[900] },
    '.bordered &': { borderWidth: '2px', borderStyle: 'solid' }
  }
})

// After (Widget.tsx)
<Flex
  className={styles.wrapper}
  direction="column"
  gap="lg"
  height="100%"
  p="md"
  width="100%"
>
```

### Component: responsive icon sizing

```tsx
// Before
<div className="shadow-custom mb-1 flex rounded-lg p-2 sm:p-4 component-bg-lighter bg-bg-100">

// Widget.css.ts
export const largeIconWrapper = style({
  boxShadow: 'var(--custom-shadow)',
  borderRadius: vars.radii.lg
})
export const largeIconWrapperNoColor = style({
  backgroundColor: bg[100],
  selectors: { '.dark &': { backgroundColor: withOpacity(bg[800], 0.5) } }
})

// After (Widget.tsx)
<Flex
  className={clsx(styles.largeIconWrapper, !iconColor && styles.largeIconWrapperNoColor)}
  mb="xs"
  p={{ base: 'sm', sm: 'md' }}
  style={iconColor ? { backgroundColor: anyColorToHex(iconColor) + '20' } : undefined}
>
```

### Text with dark-mode colour

```tsx
// Before
<h3 className="w-full min-w-0 truncate text-bg-500 dark:text-bg-50 text-lg">

// Widget.css.ts
export const titleTextDefault = style({
  color: bg[500],
  selectors: { '.dark &': { color: bg[50] } }
})

// After (Widget.tsx)
<Text
  truncate
  as="h3"
  className={styles.titleTextDefault}
  size="lg"
  style={{ width: '100%', minWidth: 0 }}
>
```
