import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import {
  Button,
  DashboardItem,
  EmptyStateScreen,
  Scrollbar,
  WithQuery
} from 'lifeforge-ui'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'
import { Tooltip } from 'react-tooltip'
import type { InferOutput } from 'shared'
import { useSidebarState } from 'shared'

import type WidgetConfig from '@apps/00/dashboard/typescript/widgetConfig.types'
import type {
  CalendarCategory,
  CalendarEvent
} from '@apps/01.Productivity/calendar/components/Calendar'
import EventDetails from '@apps/01.Productivity/calendar/components/Calendar/components/EventDetails.tsx'
import { INTERNAL_CATEGORIES } from '@apps/01.Productivity/calendar/constants/internalCategories'

function EventItem({
  categories,
  event
}: {
  categories: InferOutput<typeof forgeAPI.calendar.categories.list>
  event: CalendarEvent
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
      (event.category.startsWith('_')
        ? INTERNAL_CATEGORIES[
            event.category as keyof typeof INTERNAL_CATEGORIES
          ]
        : categories.find(category => category.id === event.category)) as
        | CalendarCategory
        | undefined,
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
  const rawEventsQuery = useQuery(
    forgeAPI.calendar.events.getToday.queryOptions()
  )

  const categoriesQuery = useQuery(
    forgeAPI.calendar.categories.list.queryOptions()
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
      namespace="apps.calendar"
      title="Todays Event"
    >
      <Scrollbar>
        <WithQuery query={categoriesQuery}>
          {categories => (
            <WithQuery query={rawEventsQuery}>
              {() =>
                (rawEventsQuery.data ?? []).length > 0 ? (
                  <ul className="flex flex-1 flex-col gap-2 pr-3">
                    {rawEventsQuery.data?.map(event => (
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
                      namespace="apps.dashboard"
                      tKey="widgets.todaysEvent"
                    />
                  </div>
                )
              }
            </WithQuery>
          )}
        </WithQuery>
      </Scrollbar>
    </DashboardItem>
  )
}

export const config: WidgetConfig = {
  namespace: 'apps.calendar',
  id: 'todaysEvent',
  icon: 'tabler:calendar-event'
}
