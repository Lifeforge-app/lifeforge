import type { ModuleCategory, ModuleConfig } from 'shared'

let ROUTES: ModuleCategory[] = []

const categoryFile = import.meta.glob('../../../apps/cat.config.json', {
  eager: true
})

let categoriesSeq: string[] = []

if (categoryFile['../../../apps/cat.config.json']) {
  categoriesSeq = (
    categoryFile['../../../apps/cat.config.json'] as { default: string[] }
  ).default
}

await Promise.all(
  Object.entries(
    import.meta.glob(['../apps/**/manifest.ts', '../../../apps/**/manifest.ts'])
  ).map(async ([_, resolver]) => {
    const mod = (await resolver()) as {
      default: ModuleConfig & { category?: string }
    }

    const category = mod.default.category || 'Miscellaneous'

    const categoryIndex = ROUTES.findIndex(cat => cat.title === category)

    if (categoryIndex > -1) {
      ROUTES[categoryIndex].items.push(mod.default)
    } else {
      ROUTES.push({
        title: category,
        items: [mod.default]
      })
    }
  })
)

ROUTES = ROUTES.sort((a, b) => {
  const order = ['<START>', 'Miscellaneous', 'Settings', 'SSO', '<END>']

  const aIndex = order.indexOf(a.title)

  const bIndex = order.indexOf(b.title)

  // Both are special categories
  if (aIndex !== -1 && bIndex !== -1) {
    return aIndex - bIndex
  }

  // Only a is special - handle positioning
  if (aIndex !== -1) {
    if (aIndex === 0) return -1 // <START> goes first
    if (aIndex >= 1) return 1 // Settings, SSO, <END> go last
  }

  // Only b is special - handle positioning
  if (bIndex !== -1) {
    if (bIndex === 0) return 1 // <START> goes first
    if (bIndex >= 1) return -1 // Settings, SSO, <END> go last
  }

  if (categoriesSeq.length > 0) {
    const aCatIndex = categoriesSeq.indexOf(a.title)

    const bCatIndex = categoriesSeq.indexOf(b.title)

    // Both found in sequence
    if (aCatIndex !== -1 && bCatIndex !== -1) {
      return aCatIndex - bCatIndex
    }

    // Only a found in sequence
    if (aCatIndex !== -1) {
      return -1
    }

    // Only b found in sequence
    if (bCatIndex !== -1) {
      return 1
    }
  }

  // Default to alphabetical
  return a.title.localeCompare(b.title)
}).map(cat => ({
  title: ['<START>', '<END>'].includes(cat.title) ? '' : cat.title,
  items: cat.items.sort((a, b) => a.name.localeCompare(b.name))
}))

import.meta.glob('../../../apps/**/client/index.css', {
  eager: true
})

export default ROUTES
