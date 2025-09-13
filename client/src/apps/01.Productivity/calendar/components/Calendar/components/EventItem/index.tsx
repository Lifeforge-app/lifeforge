import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI.js'
import { memo, useMemo } from 'react'

import { INTERNAL_CATEGORIES } from '@apps/01.Productivity/calendar/constants/internalCategories.js'

import type { CalendarCategory, CalendarEvent } from '../../index.js'
import EventItemButton from './components/EventItemButton.js'
import EventItemTooltip from './components/EventItemTooltip.js'

function EventItem({ event }: { event: CalendarEvent }) {
  const categoriesQuery = useQuery(
    forgeAPI.calendar.categories.list.queryOptions()
  )

  const category = useMemo(() => {
    if (event.category.startsWith('_')) {
      return {
        ...INTERNAL_CATEGORIES[
          event.category as keyof typeof INTERNAL_CATEGORIES
        ]
      } as CalendarCategory | undefined
    }

    return categoriesQuery.data?.find(
      category => category.id === event.category
    )
  }, [categoriesQuery, event.category])

  return (
    <>
      <EventItemButton
        color={category?.color ?? ''}
        icon={category?.icon ?? ''}
        id={event.id}
        isStrikethrough={event.is_strikethrough}
        title={event.title}
      />
      <EventItemTooltip category={category} event={event} />
    </>
  )
}

export default memo(EventItem)
