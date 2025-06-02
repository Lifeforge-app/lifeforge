import clsx from 'clsx'
import { useMemo } from 'react'

import EventDetails from '@apps/Calendar/components/Calendar/components/EventDetails.tsx'
import { INTERNAL_CATEGORIES } from '@apps/Calendar/constants/internalCategories'
import {
  ICalendarCategory,
  ICalendarEvent
} from '@apps/Calendar/interfaces/calendar_interfaces'

import useAPIQuery from '@hooks/useAPIQuery'
import useComponentBg from '@hooks/useComponentBg'

function AgendaEventItem({ event }: { event: ICalendarEvent }) {
  const { componentBg } = useComponentBg()
  const categoriesQuery = useAPIQuery<ICalendarCategory[]>(
    'calendar/categories',
    ['calendar', 'categories']
  )

  const category = useMemo<ICalendarCategory | undefined>(() => {
    if (event.category.startsWith('_')) {
      return (INTERNAL_CATEGORIES[
        event.category as keyof typeof INTERNAL_CATEGORIES
      ] ?? {}) as ICalendarCategory
    }

    return categoriesQuery.data?.find(
      category => category.id === event.category
    )
  }, [categoriesQuery, event.category])

  return (
    <div
      className={clsx(
        componentBg,
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
