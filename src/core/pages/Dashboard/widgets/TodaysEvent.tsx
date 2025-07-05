import { Icon } from '@iconify/react/dist/iconify.js'
import { useSidebarState } from '@providers/SidebarStateProvider'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'
import { Tooltip } from 'react-tooltip'

import {
  Button,
  DashboardItem,
  EmptyStateScreen,
  QueryWrapper,
  Scrollbar
} from '@lifeforge/ui'

import EventDetails from '@apps/Calendar/components/Calendar/components/EventDetails.tsx'
import { INTERNAL_CATEGORIES } from '@apps/Calendar/constants/internalCategories'
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
  const { sidebarExpanded } = useSidebarState()
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLLIElement>(null)

  const handleResize = () => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth)
    }
  }

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const targetCategory = useMemo(
    () =>
      event.category.startsWith('_')
        ? (INTERNAL_CATEGORIES[
            event.category as keyof typeof INTERNAL_CATEGORIES
          ] as ICalendarCategory)
        : categories.find(category => category.id === event.category),
    [event.category, categories]
  )

  return (
    <>
      <li
        key={event.id}
        ref={ref}
        className={clsx(
          'flex-between shadow-custom component-bg-lighter flex cursor-pointer gap-3 rounded-lg p-4'
        )}
        data-tooltip-id={`calendar-event-${event.id}`}
      >
        <div
          className="h-full w-1 rounded-full"
          style={{
            backgroundColor: targetCategory?.color
          }}
        />
        <div className="flex w-full flex-col gap-1">
          <div className="text-bg-500 flex items-center gap-1 text-sm">
            <Icon
              icon={targetCategory?.icon ?? ''}
              style={{
                color: targetCategory?.color
              }}
            />
            {targetCategory?.name}
          </div>
          <div className="font-semibold">{event.title}</div>
        </div>
      </li>
      {
        createPortal(
          <Tooltip
            clickable
            noArrow
            openOnClick
            className={clsx(
              'bg-bg-50! text-bg-800! border-bg-200 dark:border-bg-700 shadow-custom dark:bg-bg-800! bg-opacity-0! dark:text-bg-50 rounded-md! border p-4! text-base!',
              sidebarExpanded ? 'z-[-1] lg:z-0' : 'z-0'
            )}
            id={`calendar-event-${event.id}`}
            opacity={1}
            place="bottom-start"
            positionStrategy="fixed"
          >
            <div
              className="relative max-h-96 overflow-y-auto whitespace-normal"
              style={{
                width: `${width - 32}px`
              }}
            >
              <EventDetails
                category={targetCategory}
                editable={false}
                event={event}
              />
            </div>
          </Tooltip>,
          document.getElementById('app') ?? document.body
        ) as React.ReactPortal
      }
    </>
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
      className="pr-4"
      componentBesideTitle={
        <Button
          as={Link}
          className="mr-2 p-2!"
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
                  <ul className="flex flex-1 flex-col gap-2 pr-3">
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
