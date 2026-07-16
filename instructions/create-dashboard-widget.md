---
description: How to create a dashboard widget for LifeForge modules
---

# Creating Dashboard Widgets for LifeForge Modules

This workflow guides you through creating dashboard widgets that appear on the main dashboard and can be managed by users.

## Prerequisites

- The module must exist under `apps/<module-name>/`
- The module should have a client-side codebase at `apps/<module-name>/client/src/`

---

## Step 1: Create the Widgets Directory

Create the widgets directory if it doesn't exist:

```bash
mkdir -p apps/<module-name>/client/src/widgets
```

---

## Step 2: Create the Widget Component File

Create a new file at `apps/<module-name>/client/src/widgets/<WidgetName>.tsx`

### Widget File Structure

Every widget file MUST export:

1. A **default export** - the React component function
2. A **named export `config`** - the `WidgetConfig` object

### Basic Widget Template

```tsx
import type { WidgetConfig } from '@lifeforge/shared'
import { Widget } from '@lifeforge/ui'

export default function MyWidget() {
  return (
    <Widget
      icon="tabler:icon-name"
      namespace="apps.<moduleName>"
      title="My Widget Title"
    >
      {/* Widget content goes here */}
    </Widget>
  )
}

export const config: WidgetConfig = {
  namespace: 'apps.<moduleName>',
  id: '<widgetId>', // camelCase, unique identifier
  icon: 'tabler:icon-name'
}
```

> [!IMPORTANT]
> **Import paths for module widgets require special handling.** Module widgets live under `apps/<module>/client/src/` and use different import paths than core:
>
> - `@lifeforge/ui` → `lifeforge-ui` (no `@` prefix)
> - `@lifeforge/shared` → `shared`
> - `@/forgeAPI` → `@/utils/forgeAPI` (or `@/forgeAPI` depending on module setup)

> [!TIP]
> For small/compact widgets where space is limited, the `title` prop can be omitted from the `Widget` wrapper. The widget will still display properly without a header, giving more room for content.

### Widget with Dimension Constraints

```tsx
export const config: WidgetConfig = {
  namespace: 'apps.<moduleName>',
  id: '<widgetId>',
  icon: 'tabler:icon-name',
  minW: 2, // Minimum width in grid units (optional)
  minH: 2, // Minimum height in grid units (optional)
  maxW: 4, // Maximum width in grid units (optional)
  maxH: 4 // Maximum height in grid units (optional)
}
```

### Widget with API Data (Common Pattern)

```tsx
import { useQuery } from '@tanstack/react-query'
import {
  Button,
  Card,
  EmptyStateScreen,
  Flex,
  Icon,
  Text,
  Widget,
  WithQuery,
  surface
} from 'lifeforge-ui'
import { Link } from 'shared'
import type { WidgetConfig } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

export default function MyDataWidget() {
  const dataQuery = useQuery(forgeAPI.<moduleName>.<endpoint>.queryOptions())

  return (
    <Widget
      actionComponent={
        <Button
          icon="tabler:chevron-right"
          to="/<module-route>"
          variant="plain"
        />
      }
      icon="tabler:icon-name"
      namespace="apps.<moduleName>"
      title="Widget Title"
    >
      <WithQuery query={dataQuery}>
        {data => (
          data.length > 0 ? (
            <Flex direction="column" gap="sm">
              {data.map(item => (
                <Card
                  key={item.id}
                  isInteractive
                  as={Link}
                  to="/<module-route>"
                >
                  <Flex align="center" gap="md">
                    <Flex
                      align="center"
                      bg={surface.light}
                      flexShrink="0"
                      height="2.5rem"
                      justify="center"
                      r="md"
                      width="2.5rem"
                    >
                      <Icon color="muted" icon={item.icon}  />
                    </Flex>
                    <Box>
                      <Text weight="medium">{item.name}</Text>
                      <Text color="muted" size="sm">{item.description}</Text>
                    </Box>
                  </Flex>
                </Card>
              ))}
            </Flex>
          ) : (
            <EmptyStateScreen
              smaller
              icon="tabler:off-icon"
              message={{
                id: '<itemType>',
                namespace: 'apps.<moduleName>',
                tKey: 'widgets.<widgetId>'
              }}
            />
          )
        )}
      </WithQuery>
    </Widget>
  )
}

export const config: WidgetConfig = {
  namespace: 'apps.<moduleName>',
  id: '<widgetId>',
  icon: 'tabler:icon-name'
}
```

### Widget with Dimension-Responsive Layout

Widgets receive `dimension` props to adapt their layout. Use `Card` as the root element for responsive widgets that don't need the `Widget` header wrapper:

```tsx
import type { WidgetConfig } from '@lifeforge/shared'
import { Card, Flex, Text } from '@lifeforge/ui'

export default function ResponsiveWidget({
  dimension: { w, h }
}: {
  dimension: { w: number; h: number }
}) {
  return (
    <Card
      align={h < 2 ? 'center' : undefined}
      direction={h < 2 ? 'row' : 'column'}
      gap="md"
      height="100%"
      justify={h < 2 ? 'between' : undefined}
    >
      <Text weight="medium">Widget Content</Text>
      <Text color="muted" size="sm">
        Adapts to {w}x{h}
      </Text>
    </Card>
  )
}

export const config: WidgetConfig = {
  id: '<widgetId>',
  icon: 'tabler:icon-name',
  minW: 2,
  minH: 1
}
```

> [!NOTE]
> When using `Card` directly as a widget root (no `Widget` wrapper), `Card` already provides the correct default background (`surface.default`), shadow, padding, and rounded corners - no inline styles or Tailwind classes needed.

### Legacy Pattern (Do NOT Use)

```tsx
// ❌ OLD - uses removed component-bg classes, clsx, inline styles, and @iconify/react
import { Icon } from '@iconify/react'
import clsx from 'clsx'

<div
  className={clsx(
    'shadow-custom component-bg flex size-full rounded-lg p-4',
    h < 2 ? 'flex-row' : 'flex-col'
  )}
>
```

```tsx
// ✅ NEW - use Card with direction/align/justify props
<Card
  align={h < 2 ? 'center' : undefined}
  direction={h < 2 ? 'row' : 'column'}
  gap="md"
  height="100%"
>
```

---

## Step 3: Add Localization Entries

Update the module's locale files at `apps/<module-name>/locales/`:

### Localization Structure (en.json example)

```json
{
  "title": "Module Title",
  "description": "Module description.",
  "widgets": {
    "<widgetId>": {
      "title": "Widget Display Name",
      "description": "Widget description shown in widget manager.",
      "empty": {
        "<itemType>": {
          "title": "No Items Found",
          "description": "Description when no items exist."
        }
      }
    }
  }
}
```

### Required Locale Fields

| Key                                               | Usage                                     |
| ------------------------------------------------- | ----------------------------------------- |
| `widgets.<widgetId>.title`                        | Widget title in header and widget manager |
| `widgets.<widgetId>.description`                  | Description shown in widget manager       |
| `widgets.<widgetId>.empty.<itemType>.title`       | Empty state title                         |
| `widgets.<widgetId>.empty.<itemType>.description` | Empty state description                   |

> [!IMPORTANT]
> Add translations to ALL locale files: `en.json`, `ms.json`, `zh-CN.json`, `zh-TW.json`

---

## Step 4: Widget Auto-Discovery

Widgets are **automatically discovered** by the dashboard system. The main dashboard uses `import.meta.glob` to find all widgets matching these patterns:

```ts
const widgets = import.meta.glob([
  '../**/widgets/*.tsx', // Core app widgets
  './widgets/*.tsx', // Dashboard's own widgets
  '../../../../apps/**/client/src/widgets/*.tsx' // Module widgets
])
```

> [!NOTE]
> No manual registration is required. Simply create the widget file with correct exports and it will appear in the dashboard's widget manager.

---

## WidgetConfig Interface Reference

```ts
interface WidgetConfig {
  namespace?: string // Translation namespace (e.g., 'apps.calendar')
  id: string // Unique widget identifier in camelCase
  icon: string // Iconify icon name (e.g., 'tabler:calendar')
  minW?: number // Minimum width in grid units (1 unit = varies by screen)
  minH?: number // Minimum height in grid units (1 unit = 100px)
  maxW?: number // Maximum width in grid units
  maxH?: number // Maximum height in grid units
}
```

### Grid System Reference

- Grid columns: 8 (lg/md), 4 (sm/xs/xxs)
- Row height: 100px
- Margin: 10px between widgets

---

## Widget Component Props Reference

The `Widget` component from `@lifeforge/ui` accepts:

| Prop              | Type                        | Description                                          |
| ----------------- | --------------------------- | ---------------------------------------------------- |
| `icon`            | `string`                    | Iconify icon name                                    |
| `iconColor`       | `TokenizedColor`            | Optional custom icon color                           |
| `title`           | `ReactNode`                 | Widget title (auto-translated if namespace provided) |
| `description`     | `ReactNode`                 | Widget description                                   |
| `namespace`       | `string \| false`           | Translation namespace, `false` to disable            |
| `actionComponent` | `ReactNode`                 | Component beside title (e.g., navigation button)     |
| `variant`         | `'default' \| 'large-icon'` | Visual variant                                       |
| `children`        | `ReactNode`                 | Widget content                                       |

---

## Common UI Components for Widgets

Import from `lifeforge-ui` (modules) or `@lifeforge/ui` (core):

| Component          | Usage                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `Widget`           | Container wrapper with title and icon                                                                               |
| `Card`             | Card wrapper for dimension-responsive widgets                                                                       |
| `Flex`             | Flexbox layout container                                                                                            |
| `Box`              | Generic layout primitive                                                                                            |
| `Text`             | Typography (with spacing and style props)                                                                           |
| `Icon`             | Icon display (uses `size` prop, not `width`/`height`)                                                               |
| `WithQuery`        | Handles loading/error states for API queries                                                                        |
| `EmptyStateScreen` | Shows when no data exists                                                                                           |
| `Scrollbar`        | Scrollable content wrapper                                                                                          |
| `Button`           | Action buttons                                                                                                      |
| `LoadingScreen`    | Loading indicator                                                                                                   |
| `surface`          | Pre-built bg presets (`surface.light`, `surface.lightInteractive`, `surface.default`, `surface.defaultInteractive`) |

> [!WARNING]
> Never import `Icon` from `@iconify/react` directly. Always use the `Icon` primitive from the UI library. Use the `size` prop (not `width`/`height`) for sizing, and the `color` prop (not `className="text-..."`) for colors.

---

## Example Widgets Reference

Examine these existing widgets for patterns:

### Simple Display Widgets (No API)

- `client/src/core/dashboard/widgets/Clock.tsx` - Time display with dimensions
- `client/src/core/dashboard/widgets/Date.tsx` - Date display with theming
- `client/src/core/dashboard/widgets/Quotes.tsx` - External API fetch

### Data-Driven Widgets

- `apps/calendar/client/src/widgets/TodaysEvent.tsx` - List with items
- `apps/wallet/client/src/widgets/AssetsBalance.tsx` - Grid layout with toggle (not yet migrated - see as legacy reference)
- `apps/todoList/client/src/widgets/TodoList.tsx` - List with context provider
- `apps/codeTime/client/src/widgets/CodeTime.tsx` - Chart visualization

### Interactive Widgets

- `apps/music/client/src/widgets/MusicPlayer.tsx` - Media controls
- `apps/calendar/client/src/widgets/MiniCalendar.tsx` - Interactive calendar

---

## Checklist

- [ ] Create `apps/<module>/client/src/widgets/<WidgetName>.tsx`
- [ ] Export default React component
- [ ] Export named `config: WidgetConfig`
- [ ] Use `Widget` wrapper component (or `Card` for dimension-responsive widgets without header)
- [ ] Import `Icon` from UI library, not `@iconify/react`
- [ ] Use `size` prop for icon sizing, `color` prop for icon colors
- [ ] No `className` with Tailwind classes
- [ ] No `component-bg-*` classes - use `surface` presets or `Card` instead
- [ ] Use `@lifeforge/ui` / `@lifeforge/shared` for core, `lifeforge-ui` / `shared` for modules
- [ ] Add `namespace` for translations
- [ ] Set appropriate dimension constraints
- [ ] Add locale entries in all language files
- [ ] Handle empty states with `EmptyStateScreen`
- [ ] Test widget appears in Manage Widgets modal
- [ ] Test widget renders on dashboard
