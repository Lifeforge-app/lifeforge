import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'

import type { CalendarCategory } from '@/components/Calendar'
import { forgeAPI } from '@/manifest'

interface InternalCategory {
  id: string
  name: string
  color: string
  icon: string
  requiredModule: string
}

const INTERNAL_CATEGORIES: Record<string, InternalCategory> = {
  _todo: {
    id: '_todo',
    name: 'Todo Deadline',
    color: '#F44336',
    icon: 'tabler:hexagon-letter-x',
    requiredModule: 'lifeforge--todo-list'
  },
  _movie: {
    id: '_movie',
    name: 'Movie',
    color: '#ff8904',
    icon: 'tabler:movie',
    requiredModule: 'lifeforge--movies'
  }
}

export function useInternalCategories() {
  const moduleIds = useMemo(
    () => [
      ...new Set(Object.values(INTERNAL_CATEGORIES).map(c => c.requiredModule))
    ],
    []
  )

  const availabilityQueries = useQueries({
    queries: moduleIds.map(moduleId =>
      forgeAPI.checkModuleAvailability({ moduleId }).queryOptions()
    )
  })

  const availabilityMap = useMemo(() => {
    const map: Record<string, boolean> = {}
    moduleIds.forEach((id, i) => {
      map[id] = availabilityQueries[i]?.data ?? false
    })

    return map
  }, [moduleIds, availabilityQueries])

  return useMemo(() => {
    const values = Object.values(INTERNAL_CATEGORIES)
      .filter(c => availabilityMap[c.requiredModule])
      .map(e => ({
        ...e,
        collectionId: '',
        collectionName: ''
      })) as CalendarCategory[]

    const map = Object.fromEntries(
      Object.entries(INTERNAL_CATEGORIES).map(e => ({
        ...e,
        collectionId: '',
        collectionName: ''
      }))
    ) as unknown as Record<string, CalendarCategory>

    return { values, map }
  }, [availabilityMap])
}
