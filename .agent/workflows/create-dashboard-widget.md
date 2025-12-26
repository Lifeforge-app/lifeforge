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
import { Widget } from 'lifeforge-ui'
import type { WidgetConfig } from 'shared'

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
  id: '<widgetId>',  // camelCase, unique identifier
  icon: 'tabler:icon-name'
}
```

> [!TIP]
> For small/compact widgets where space is limited, the `title` prop can be omitted from the `Widget` wrapper. The widget will still display properly without a header, giving more room for content. See `apps/momentVault/client/src/widgets/QuickAudioCapture.tsx` for an example.

### Widget with Dimension Constraints

```tsx
export const config: WidgetConfig = {
  namespace: 'apps.<moduleName>',
  id: '<widgetId>',
  icon: 'tabler:icon-name',
  minW: 2,  // Minimum width in grid units (optional)
  minH: 2,  // Minimum height in grid units (optional)
  maxW: 4,  // Maximum width in grid units (optional)
  maxH: 4   // Maximum height in grid units (optional)
}
```

### Widget with API Data (Common Pattern)

```tsx
import { useQuery } from '@tanstack/react-query'
import { Button, EmptyStateScreen, Widget, WithQuery } from 'lifeforge-ui'
import { Link } from 'shared'
import type { WidgetConfig } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

export default function MyDataWidget() {
  const dataQuery = useQuery(forgeAPI.<moduleName>.<endpoint>.queryOptions())

  return (
    <Widget
      actionComponent={
        <Button
          as={Link}
          className="p-2!"
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
            <ul>
              {data.map(item => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
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

Widgets can receive dimension props to adapt their layout:

```tsx
function ResponsiveWidget({ 
  dimension: { w, h } 
}: { 
  dimension: { w: number; h: number } 
}) {
  return (
    <div className={clsx(
      'shadow-custom component-bg flex size-full rounded-lg p-4',
      h < 2 ? 'flex-row' : 'flex-col'  // Adjust based on height
    )}>
      {/* Content that adapts to dimensions */}
    </div>
  )
}
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

| Key | Usage |
|-----|-------|
| `widgets.<widgetId>.title` | Widget title in header and widget manager |
| `widgets.<widgetId>.description` | Description shown in widget manager |
| `widgets.<widgetId>.empty.<itemType>.title` | Empty state title |
| `widgets.<widgetId>.empty.<itemType>.description` | Empty state description |

> [!IMPORTANT]
> Add translations to ALL locale files: `en.json`, `ms.json`, `zh-CN.json`, `zh-TW.json`

---

## Step 4: Widget Auto-Discovery

Widgets are **automatically discovered** by the dashboard system. The main dashboard uses `import.meta.glob` to find all widgets matching these patterns:

```ts
const widgets = import.meta.glob([
  '../**/widgets/*.tsx',           // Core app widgets
  './widgets/*.tsx',               // Dashboard's own widgets
  '../../../../apps/**/client/src/widgets/*.tsx'  // Module widgets
])
```

> [!NOTE]
> No manual registration is required. Simply create the widget file with correct exports and it will appear in the dashboard's widget manager.

---

## WidgetConfig Interface Reference

```ts
interface WidgetConfig {
  namespace?: string  // Translation namespace (e.g., 'apps.calendar')
  id: string          // Unique widget identifier in camelCase
  icon: string        // Iconify icon name (e.g., 'tabler:calendar')
  minW?: number       // Minimum width in grid units (1 unit = varies by screen)
  minH?: number       // Minimum height in grid units (1 unit = 100px)
  maxW?: number       // Maximum width in grid units
  maxH?: number       // Maximum height in grid units
}
```

### Grid System Reference

- Grid columns: 8 (lg/md), 4 (sm/xs/xxs)
- Row height: 100px
- Margin: 10px between widgets

---

## Widget Component Props Reference

The `Widget` component from `lifeforge-ui` accepts:

| Prop | Type | Description |
|------|------|-------------|
| `icon` | `string` | Iconify icon name |
| `title` | `string` | Widget title (auto-translated if namespace provided) |
| `namespace` | `string \| false` | Translation namespace, `false` to disable |
| `className` | `string` | Additional CSS classes |
| `actionComponent` | `ReactNode` | Component beside title (e.g., navigation button) |
| `children` | `ReactNode` | Widget content |

---

## Common UI Components for Widgets

Import from `lifeforge-ui`:

| Component | Usage |
|-----------|-------|
| `Widget` | Container wrapper with title and icon |
| `WithQuery` | Handles loading/error states for API queries |
| `EmptyStateScreen` | Shows when no data exists |
| `Scrollbar` | Scrollable content wrapper |
| `Button` | Action buttons |
| `LoadingScreen` | Loading indicator |

---

## Example Widgets Reference

Examine these existing widgets for patterns:

### Simple Display Widgets (No API)
- `client/src/apps/dashboard/widgets/Clock.tsx` - Time display with dimensions
- `client/src/apps/dashboard/widgets/Date.tsx` - Date display with theming
- `client/src/apps/dashboard/widgets/Quotes.tsx` - External API fetch

### Data-Driven Widgets
- `apps/calendar/client/src/widgets/TodaysEvent.tsx` - List with items
- `apps/wallet/client/src/widgets/AssetsBalance.tsx` - Grid layout with toggle
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
- [ ] Use `Widget` wrapper component
- [ ] Add `namespace` for translations
- [ ] Set appropriate dimension constraints
- [ ] Add locale entries in all language files
- [ ] Handle empty states with `EmptyStateScreen`
- [ ] Test widget appears in Manage Widgets modal
- [ ] Test widget renders on dashboard
