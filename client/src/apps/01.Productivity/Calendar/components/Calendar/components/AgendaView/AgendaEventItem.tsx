import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import { useMemo } from 'react'

import EventDetails from '@apps/01.Productivity/Calendar/components/Calendar/components/EventDetails.tsx'
import { INTERNAL_CATEGORIES } from '@apps/01.Productivity/Calendar/constants/internalCategories'

import type { CalendarCategory, CalendarEvent } from '../..'

function AgendaEventItem({ event }: { event: CalendarEvent }) {
  const categoriesQuery = useQuery(
    forgeAPI.calendar.categories.list.queryOptions()
  )

  const category = useMemo(() => {
    if (event.category.startsWith('_')) {
      return (INTERNAL_CATEGORIES[
        event.category as keyof typeof INTERNAL_CATEGORIES
      ] ?? {}) as CalendarCategory | undefined
    }

    return categoriesQuery.data?.find(
      category => category.id === event.category
    )
  }, [categoriesQuery, event.category])

  return (
    <div
      className={clsx(
        'component-bg',
        'shadow-custom relative min-w-96 rounded-md p-4 pl-9 before:absolute before:top-4 before:left-4 before:h-[calc(100%-2rem)] before:w-1 before:rounded-full before:bg-[var(--bg-color)]'
      )}
      style={{
        // @ts-expect-error - CSS variable
        '--bg-color': category?.color ?? ''
      }}
    >
      <EventDetails category={category} event={event} />
    </div>
  )
}

export default AgendaEventItem
