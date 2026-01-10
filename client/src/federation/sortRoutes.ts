import type { ModuleCategory } from 'shared'

const ORDER = ['<START>', 'Miscellaneous', 'Settings', 'SSO', '<END>']

/**
 * Sorts the routes based on the order of the categories
 *
 * @param categoriesSeq The sequence of categories
 * @returns The sorted routes
 */
function routeSorter(categoriesSeq: string[]) {
  return (a: ModuleCategory, b: ModuleCategory) => {
    const aIndex = ORDER.indexOf(a.title)

    const bIndex = ORDER.indexOf(b.title)

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
  }
}

export default function sortRoutes(
  routes: ModuleCategory[],
  categoryOrder: string[] = []
) {
  return routes.sort(routeSorter(categoryOrder)).map(cat => ({
    title: ['<START>', '<END>'].includes(cat.title) ? '' : cat.title,
    items: cat.items.sort((a, b) => a.name.localeCompare(b.name))
  }))
}
