import { memo, useMemo } from 'react'

import { INTERNAL_CATEGORIES } from '@apps/Calendar/constants/internalCategories'

import {
  type ICalendarCategory,
  type ICalendarEvent
} from '../../../../interfaces/calendar_interfaces.ts'
import EventItemButton from './components/EventItemButton.tsx'
import EventItemTooltip from './components/EventItemTooltip.tsx'

function EventItem({
  event,
  categories
}: {
  event: ICalendarEvent
  categories: ICalendarCategory[]
}) {
  const category = useMemo<ICalendarCategory | undefined>(() => {
    if (event.category.startsWith('_')) {
      return (INTERNAL_CATEGORIES[
        event.category as keyof typeof INTERNAL_CATEGORIES
      ] ?? {}) as ICalendarCategory
    }

    return categories.find(category => category.id === event.category)
  }, [categories, event.category])

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
