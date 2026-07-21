import type { ModuleCategory } from '@lifeforge/configs'

import { SYSTEM_CATEGORIES } from '../providers/FederationProvider'

function routeSorter(categoriesSeq: Record<string, Record<string, string>>) {
  return (a: ModuleCategory, b: ModuleCategory) => {
    const aIndex = SYSTEM_CATEGORIES.indexOf(a.title)

    const bIndex = SYSTEM_CATEGORIES.indexOf(b.title)

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

    if (Object.keys(categoriesSeq).length > 0) {
      const aCatIndex = Object.keys(categoriesSeq).indexOf(
        a.title.toLowerCase()
      )

      const bCatIndex = Object.keys(categoriesSeq).indexOf(
        b.title.toLowerCase()
      )

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

export function sortRoutes<T extends ModuleCategory>(
  routes: T[],
  categoryOrder: Record<string, Record<string, string>>
): T[] {
  return routes.sort(routeSorter(categoryOrder)).map(cat => ({
    ...cat,
    title: ['<START>', '<END>'].includes(cat.title) ? '' : cat.title,
    items: cat.items.sort((a, b) => a.name.localeCompare(b.name))
  })) as unknown as T[]
}
