import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Link } from 'react-router'

import {
  Button,
  DashboardItem,
  EmptyStateScreen,
  QueryWrapper,
  Scrollbar
} from '@lifeforge/ui'

import {
  type ICalendarCategory,
  type ICalendarEvent
} from '@apps/Calendar/interfaces/calendar_interfaces'

import useAPIQuery from '@hooks/useAPIQuery'

function EventItem({
  categories,
  event
}: {
  categories: ICalendarCategory[]
  event: ICalendarEvent
}) {
  return (
    <li
      key={event.id}
      className="flex-between bg-bg-100/50 shadow-custom dark:bg-bg-800 flex flex-1 gap-4 rounded-lg p-4"
    >
      <div
        className="h-full w-1.5 rounded-full"
        style={{
          backgroundColor: categories.find(
            category => category.id === event.category
          )?.color
        }}
      />
      <div className="flex w-full flex-col gap-1">
        <div className="font-semibold">{event.title}</div>
        <div className="text-bg-500 text-sm">
          {categories.find(category => category.id === event.category)?.name}
        </div>
      </div>
    </li>
  )
}

export default function TodaysEvent() {
  const rawEventsQuery = useAPIQuery<ICalendarEvent[]>(
    'calendar/events/today',
    ['calendar', 'events', 'today']
  )
  const categoriesQuery = useAPIQuery<ICalendarCategory[]>(
    'calendar/categories',
    ['calendar', 'categories']
  )
  const filteredEvents = useMemo(
    () =>
      rawEventsQuery.data?.filter(event =>
        dayjs().isBetween(
          dayjs(event.start),
          dayjs(event.end).subtract(1, 'second'),
          'day',
          '[]'
        )
      ),
    [rawEventsQuery.data]
  )

  return (
    <DashboardItem
      componentBesideTitle={
        <Button
          as={Link}
          className="p-2!"
          icon="tabler:chevron-right"
          to="/calendar"
          variant="plain"
        />
      }
      icon="tabler:calendar"
      title="Todays Event"
    >
      <Scrollbar>
        <QueryWrapper query={categoriesQuery}>
          {categories => (
            <QueryWrapper query={rawEventsQuery}>
              {() =>
                (filteredEvents ?? []).length > 0 ? (
                  <ul className="flex flex-1 flex-col gap-2">
                    {filteredEvents?.map(event => (
                      <EventItem
                        key={event.id}
                        categories={categories}
                        event={event}
                      />
                    ))}
                  </ul>
                ) : (
                  <div className="flex-center flex-1">
                    <EmptyStateScreen
                      smaller
                      icon="tabler:calendar-off"
                      name="event"
                      namespace="core.dashboard"
                      tKey="widgets.todaysEvent"
                    />
                  </div>
                )
              }
            </QueryWrapper>
          )}
        </QueryWrapper>
      </Scrollbar>
    </DashboardItem>
  )
}
