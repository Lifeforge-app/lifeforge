import { memo, useMemo } from 'react'

import { useAPIQuery } from 'shared/lib'
import {
  CalendarCollectionsSchemas,
  ISchemaWithPB
} from 'shared/types/collections'
import { CalendarControllersSchemas } from 'shared/types/controllers'

import { INTERNAL_CATEGORIES } from '@apps/Calendar/constants/internalCategories'

import { ICalendarEvent } from '../../index.js'
import EventItemButton from './components/EventItemButton.js'
import EventItemTooltip from './components/EventItemTooltip.js'

function EventItem({ event }: { event: ICalendarEvent }) {
  const categoriesQuery = useAPIQuery<
    CalendarControllersSchemas.ICategories['getAllCategories']['response']
  >('calendar/categories', ['calendar', 'categories'])

  const category = useMemo(() => {
    if (event.category.startsWith('_')) {
      return {
        ...INTERNAL_CATEGORIES[
          event.category as keyof typeof INTERNAL_CATEGORIES
        ]
      } as ISchemaWithPB<CalendarCollectionsSchemas.ICategoryAggregated>
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
