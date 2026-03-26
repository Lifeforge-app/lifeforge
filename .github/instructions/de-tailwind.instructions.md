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
4. The **system architecture** (see §0.5 below) — understand `ThemeConditionProp`
   and `themeColorProperties` before writing any `.css.ts` file.

---

## §0.5 — System Architecture

### Source files

| Path | Purpose |
|------|---------|
| `src/system/colors.ts` | `colors` map (sprinkle values), `bg[n]` / `custom[n]` objects (for `style()` calls), `ColorToken` type |
| `src/system/vars.css.ts` | `vars` design tokens — `space`, `radii`, `fontSize`, `lineHeight`, `fontWeight` |
| `src/system/sprinkles.css.ts` | `commonProperties` + `themeColorProperties` + `commonSprinkles` |
| `src/system/types.ts` | `ThemeCondition`, `ThemeConditionProp<T>`, all prop interfaces |
| `src/system/responsive.ts` | `responsiveConditions`, `normalizeResponsiveProp`, `ResponsiveProp<T>` |
| `src/system/layout-utils.ts` | `getResponsiveLayoutStyles`, `resolveCommonSprinkleProps` |
| `src/system/index.ts` | Barrel — everything above re-exported |

All imports from the system use the `@/system` alias.

### `ThemeConditionProp<T>`

A union type that accepts either a plain value **or** a per-condition map:

```ts
type ThemeConditionProp<T> = T | Partial<Record<ThemeCondition, T>>
// ThemeCondition = 'base' | 'dark' | 'hover' | 'darkHover' | 'hasBgImage' | 'darkHasBgImage'
```

The six conditions map to selectors:

| Condition | Selector |
|-----------|----------|
| `base` | (default — no selector) |
| `dark` | `.dark &` |
| `hover` | `&:hover` |
| `darkHover` | `.dark &:hover` |
| `hasBgImage` | `.has-bg-image &` |
| `darkHasBgImage` | `.dark .has-bg-image &` |

### `themeColorProperties` (from `@/system`)

A sprinkle `defineProperties` block that applies the 6 conditions above to
`backgroundColor`, `color`, and `borderColor` — all keyed by `ColorToken`
(`'transparent' | 'bg-50'…'bg-950' | 'custom-50'…'custom-900'`).

All container primitives compose this into their `createSprinkles(...)` call,
which is what enables the `bg` prop. Component `.css.ts` files can also compose
it when they need theme-adaptive per-element colors.

### Color token helpers

| Import | Use in |
|--------|--------|
| `colors` (from `@/system`) | Sprinkle property values in `defineProperties({ properties: { color: colors } })` |
| `bg[n]` (from `@/system`) | `style()` calls — e.g. `backgroundColor: bg[50]` |
| `custom[n]` (from `@/system`) | `style()` calls — e.g. `color: custom[500]` |
| `withOpacity(token, 0.1)` (from `@/system`) | opacity-modified colors — `withOpacity(bg[500], 0.2)` |

> **NO raw hex strings or hardcoded `var(--color-*)` in `.css.ts` files.**
> Always use `bg[n]`, `custom[n]`, or `withOpacity(...)`.

---

## §1 — Primitive Components

Import from `@components/primitives`.

### Container primitives — shared props

All five container primitives (`Box`, `Flex`, `Grid`, `Container`, `Section`)
share these additional props beyond their own layout props:

| Prop | Type | Description |
|------|------|-------------|
| `bg` | `ThemeConditionProp<ColorToken>` | Theme-adaptive background color |
| `rounded` | `ResponsiveProp<RadiusToken>` | Border radius token |
| `shadow` | `boolean` | Adds `var(--custom-shadow)` box shadow |

The `bg` prop accepts either a flat token or a per-condition map:

```tsx
// flat — same in all conditions
<Box bg="bg-50" />

// adaptive — different per theme condition
<Box bg={{ base: 'bg-50', dark: 'bg-900' }} />
<Flex bg={{ base: 'bg-50', dark: 'bg-900', hover: 'bg-100', darkHover: 'bg-800' }} />
<Grid bg={{ base: 'bg-100', hasBgImage: 'transparent', darkHasBgImage: 'transparent' }} />
```

### `Box`

General-purpose block element. Accepts all [Layout Props] + [Margin Props].

```tsx
<Box
  as="section"          // any HTML tag (default: div)
  display="block"       // 'block' | 'inline' | 'inline-block' | 'none' | 'contents'
  bg={{ base: 'bg-50', dark: 'bg-900' }}  // ThemeConditionProp<ColorToken>
  rounded="md"          // border-radius token: 'none'|'sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'full'
  shadow                // adds var(--custom-shadow)
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
  bg={{ base: 'bg-50', dark: 'bg-900' }}
  shadow
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
  bg={{ base: 'bg-50', dark: 'bg-900' }}
  shadow
  // + all Box layout/margin/padding props
/>
```

### `Text`

Inline text/span. Renders as `<span>` by default.

```tsx
<Text
  as="p"                  // any HTML tag
  size="lg"               // 'sm'|'base'|'lg'|'xl'|'2xl'|...|'9xl'
  // color accepts ThemeConditionProp — flat or per-condition:
  color="bg-600"
  color={{ base: 'bg-500', dark: 'bg-50' }}
  // Named semantic colors: 'default'(bg-900) | 'muted'(bg-500) | 'primary'(custom-500) | 'inherit'
  // Full palette: 'bg-50'…'bg-950' | 'custom-50'…'custom-900'
  bg={{ base: 'bg-100', dark: 'bg-800' }}   // backgroundColor, same token set as color
  weight="semibold"       // 'normal'|'medium'|'semibold'|'bold'
  align="center"          // 'left'|'center'|'right'
  decoration="underline"
  transform="uppercase"
  wrap="nowrap"
  whiteSpace="pre-wrap"   // 'normal'|'nowrap'|'pre'|'pre-line'|'pre-wrap'|'break-spaces'
  wordBreak="break-all"   // 'normal'|'break-all'|'keep-all'
  overflowWrap="anywhere" // 'normal'|'break-word'|'anywhere'
  truncate                // overflow:hidden + ellipsis (shorthand boolean — list BEFORE other props)
  lineClamp={3}
  // Margin + Padding props
  m="sm" mx="auto" mt="xs"
  p="sm" px="md"
/>
```

> **`color` and `bg` on `Text` use `ThemeConditionProp`, not `ResponsiveProp`.**
> They respond to dark mode / hover conditions, not breakpoints.

### Responsive props

All `SpaceToken` and most layout/size props accept a responsive object:

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
| `text-bg-500 dark:text-bg-50`      | `<Text color={{ base: 'bg-500', dark: 'bg-50' }}>`       |
| `text-lg`                          | `<Text size="lg">`                                       |
| `font-semibold`                    | `<Text weight="semibold">`                               |
| `truncate`                         | `<Text truncate>` — **shorthand must come first**        |
| `text-lg sm:text-xl`               | `<Text size={{ base: 'lg', sm: 'xl' }}>`                 |
| `overflow-hidden`                  | `overflow="hidden"`                                      |
| `position-relative`                | `position="relative"`                                    |
| `mb-1`                             | `mb="xs"`                                                |
| `p-2 sm:p-4`                       | `p={{ base: 'sm', sm: 'md' }}`                           |
| `bg-bg-50 dark:bg-bg-900`          | `bg={{ base: 'bg-50', dark: 'bg-900' }}` on a container |
| `hover:bg-bg-100 dark:hover:bg-bg-800` | `bg={{ base: 'bg-50', dark: 'bg-900', hover: 'bg-100', darkHover: 'bg-800' }}` |
| `shadow-custom`                    | `shadow` on any container primitive                      |

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

### Decision tree — which approach for theme-adaptive colors?

```
Is the element a container primitive (Box/Flex/Grid/Container/Section)?
  └─ YES → use the `bg` prop: <Box bg={{ base: 'bg-50', dark: 'bg-900' }}>
           use `shadow` prop for box-shadow
  └─ NO  → Is it a <Text>?
             └─ YES → use `color`/`bg` props: <Text color={{ base: 'bg-500', dark: 'bg-50' }}>
             └─ NO  → write a .css.ts using themeColorProperties sprinkle (see below)
```

### Workflow

1. **Identify styling categories** in the component:
   - *Layout* (display, flex/grid, gap, padding, margin, width, height,
     overflow, position) → **primitive props**
   - *Adaptive background/color/border* on a container primitive → **`bg` prop** or **`shadow` prop**
   - *Adaptive background/color/border* on a non-primitive element → **`.css.ts` sprinkle**
   - *Interactive* (hover, focus, active, transition) not coverable by primitive props → **`.css.ts`**
   - *Context selectors* (`.bordered &`, `.has-bg-image &`) → **`.css.ts`**
   - *Responsive font sizes / padding* that map to tokens → **responsive primitive props**

2. **Create `ComponentName.css.ts`** next to the component file only when needed.

3. **Export one `style()` or `sprinkles(...)` class per logical role** — name by
   purpose, not by Tailwind class names.

4. **Import and use** with `import * as styles from './ComponentName.css'` and
   `className={clsx(styles.foo, condition && styles.bar)}`.

### `.css.ts` — two patterns

#### Pattern A: `style()` for structural/interactive-only styles

Use for `boxShadow`, `transition`, `cursor`, `borderWidth`, and rules that
depend on **parent context selectors** (`.bordered &`) where a sprinkle cannot
be used.

```ts
import { style } from '@vanilla-extract/css'
import { bg, custom, withOpacity } from '@/system'
import { vars } from '@/system'

export const wrapper = style({
  // Structural / non-theme
  borderRadius: vars.radii.lg,
  transition: 'all 0.2s',
  // Theme-adaptive via selectors (only when themeColorProperties sprinkle can't be used)
  backgroundColor: bg[50],
  selectors: {
    '.dark &': { backgroundColor: bg[900] },
    '.bordered &': { borderWidth: '2px', borderStyle: 'solid' }
  }
})
```

#### Pattern B: `themeColorProperties` sprinkle for theme-adaptive colors on child elements

When a **non-primitive element inside a component** needs adaptive `backgroundColor`,
`color`, or `borderColor` across dark / hover / hasBgImage conditions, create a
local sprinkle from `themeColorProperties`:

```ts
import { createSprinkles } from '@vanilla-extract/sprinkles'
import { style } from '@vanilla-extract/css'
import { themeColorProperties } from '@/system'

const sprinkles = createSprinkles(themeColorProperties)

// Then call sprinkles() directly as a className value:
export const iconWrapper = style([
  { borderRadius: vars.radii.lg },
  sprinkles({ backgroundColor: { base: 'bg-100', dark: 'bg-800' } })
])

export const titleText = sprinkles({
  color: { base: 'bg-500', dark: 'bg-50' }
})

export const optionInactive = sprinkles({
  color: { base: 'bg-500', hover: 'bg-800', darkHover: 'bg-50' }
})
```

`themeColorProperties` supports:
- `backgroundColor: ColorToken | Partial<Record<ThemeCondition, ColorToken>>`
- `color: ColorToken | Partial<Record<ThemeCondition, ColorToken>>`
- `borderColor: ColorToken | Partial<Record<ThemeCondition, ColorToken>>`

### Token helpers

| Need                        | Code                                      |
|-----------------------------|-------------------------------------------|
| Background color (style)    | `bg[50]` … `bg[950]`                      |
| Accent color (style)        | `custom[50]` … `custom[900]`              |
| Color with opacity (style)  | `withOpacity(bg[500], 0.1)`               |
| Border radius               | `vars.radii.sm/md/lg/xl/2xl/3xl/full`     |
| Space value                 | `vars.space.xs/sm/md/lg/xl/2xl/3xl`       |
| Font size                   | `vars.fontSize.sm/base/lg/xl/.../9xl`     |
| Font weight                 | `vars.fontWeight.normal/medium/semibold/bold` |
| Box shadow                  | `boxShadow: 'var(--custom-shadow)'`       |

### Common Tailwind utility → `.css.ts` mapping

| Tailwind utility            | `.css.ts` equivalent                                         |
|-----------------------------|--------------------------------------------------------------|
| `component-bg`              | `bg={{ base: 'bg-50', dark: 'bg-900' }}` on primitive (preferred) OR `backgroundColor: bg[50]` + `.dark &` selector |
| `component-bg-lighter`      | `backgroundColor: bg[100]` + `.dark &` → `withOpacity(bg[800], 0.5)` |
| `shadow-custom`             | `shadow` prop on primitive OR `boxShadow: 'var(--custom-shadow)'` |
| `border-bg-500/20`          | `borderColor: withOpacity(bg[500], 0.2)`                     |
| `bg-bg-500/10`              | `backgroundColor: withOpacity(bg[500], 0.1)`                 |
| `text-bg-500 dark:text-bg-50` | `<Text color={{ base: 'bg-500', dark: 'bg-50' }}>` OR `sprinkles({ color: { base: 'bg-500', dark: 'bg-50' } })` in css.ts |
| `in-[.bordered]:border-2`   | `selectors: { '.bordered &': { borderWidth: '2px', borderStyle: 'solid' } }` |
| `hover:bg-bg-100`           | `bg={{ ..., hover: 'bg-100' }}` on primitive OR `sprinkles({ backgroundColor: { hover: 'bg-100' } })` |
| `transition-all`            | `transition: 'all 0.2s'`                                     |
| `rounded-lg`                | `rounded="lg"` prop on primitive, or `borderRadius: vars.radii.lg` in `.css.ts` |
| `text-2xl sm:text-3xl`      | `<Text size={{ base: '2xl', sm: '3xl' }}>` |

### What stays in `.css.ts` vs moves to primitive props

| Property | Where |
|----------|-------|
| `display`, `flexDirection`, `gap`, `padding`, `margin`, `width`, `height`, `overflow`, `position` | **Primitive prop** |
| `backgroundColor` of a container primitive | **`bg` prop** (ThemeConditionProp) |
| `backgroundColor` of a non-primitive child | **`.css.ts` sprinkle** (Pattern B) |
| `color` of a `<Text>` | **`color` prop** (ThemeConditionProp) |
| `color` of a non-Text element | **`.css.ts` sprinkle** (Pattern B) |
| `borderColor` | **`.css.ts` sprinkle** (Pattern B) |
| `borderRadius` | **`rounded` prop** on container, or `.css.ts` for non-primitive |
| `boxShadow` of a container primitive | **`shadow` prop** |
| `boxShadow` (complex / non-standard) | **`.css.ts`** `style()` |
| `transition`, `cursor`, `hover`, `focus` | **`.css.ts`** `style()` |
| Dark-mode selectors | **`.css.ts`** `style()` selectors OR `themeColorProperties` sprinkle |
| Context selectors (`.bordered &`, `.has-bg-image &`) | **`.css.ts`** `style()` selectors |
| `fontWeight`, `fontSize` | **`<Text weight= size=>`** |

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

### Component: themed wrapper div — bg on primitive + shadow prop

```tsx
// Before
<div className="shadow-custom component-bg border-bg-500/20 flex size-full flex-col gap-6 rounded-lg p-4 in-[.bordered]:border-2">

// Widget.css.ts — only what primitives can't express
import { style } from '@vanilla-extract/css'
import { withOpacity, bg } from '@/system'

export const wrapper = style({
  borderColor: withOpacity(bg[500], 0.2),
  selectors: {
    '.bordered &': { borderWidth: '2px', borderStyle: 'solid' }
  }
})

// After (Widget.tsx) — bg and shadow handled by primitive props
<Flex
  shadow
  bg={{ base: 'bg-50', dark: 'bg-900' }}
  className={styles.wrapper}
  direction="column"
  gap="lg"
  height="100%"
  p="md"
  rounded="lg"
  width="100%"
>
```

### Component: child element theme colors — themeColorProperties sprinkle

```tsx
// Before
<div className="flex rounded-lg p-2 sm:p-4 bg-bg-100 dark:bg-bg-800/50 mb-1">
<h3 className="w-full min-w-0 truncate text-bg-500 dark:text-bg-50 text-lg">

// Widget.css.ts
import { createSprinkles } from '@vanilla-extract/sprinkles'
import { style } from '@vanilla-extract/css'
import { themeColorProperties, bg, withOpacity, vars } from '@/system'

const sprinkles = createSprinkles(themeColorProperties)

export const iconWrapper = style([
  { borderRadius: vars.radii.lg },
  sprinkles({ backgroundColor: { base: 'bg-100', dark: 'bg-800' } })
])

export const titleText = sprinkles({
  color: { base: 'bg-500', dark: 'bg-50' }
})

// After (Widget.tsx)
<Flex
  className={styles.iconWrapper}
  mb="xs"
  p={{ base: 'sm', sm: 'md' }}
>
<Text
  truncate
  as="h3"
  className={styles.titleText}
  size="lg"
  style={{ width: '100%', minWidth: 0 }}
>
```

### Text with theme-adaptive color via prop (no .css.ts needed)

```tsx
// Before
<span className="text-bg-500 dark:text-bg-50 hover:text-bg-800">

// After — ThemeConditionProp directly on Text
<Text color={{ base: 'bg-500', dark: 'bg-50', hover: 'bg-800' }}>
```

### Interactive card — bg with hover/darkHover conditions

```tsx
// Before
<div className="bg-bg-50 dark:bg-bg-900 hover:bg-bg-100 dark:hover:bg-bg-800 cursor-pointer transition-all">

// Card.css.ts — only transition/cursor remain in style()
import { style } from '@vanilla-extract/css'
export const interactive = style({ cursor: 'pointer', transition: 'all 0.2s' })

// After (Card.tsx)
<Box
  shadow
  bg={{ base: 'bg-50', dark: 'bg-900', hover: 'bg-100', darkHover: 'bg-800' }}
  className={styles.interactive}
  rounded="lg"
>
```
