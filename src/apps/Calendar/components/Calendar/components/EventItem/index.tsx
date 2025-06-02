import { memo, useMemo } from 'react'

import { INTERNAL_CATEGORIES } from '@apps/Calendar/constants/internalCategories'

import useAPIQuery from '@hooks/useAPIQuery.ts'

import {
  type ICalendarCategory,
  type ICalendarEvent
} from '../../../../interfaces/calendar_interfaces.ts'
import EventItemButton from './components/EventItemButton.tsx'
import EventItemTooltip from './components/EventItemTooltip.tsx'

function EventItem({ event }: { event: ICalendarEvent }) {
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
