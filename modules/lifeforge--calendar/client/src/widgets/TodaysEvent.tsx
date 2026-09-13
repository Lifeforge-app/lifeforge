import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'
import { Tooltip } from 'react-tooltip'

import type { InferOutput } from '@lifeforge/api'
import type { WidgetConfig } from '@lifeforge/configs'
import {
  Box,
  Button,
  Card,
  EmptyStateScreen,
  Flex,
  Icon,
  Scrollbar,
  Text,
  Widget,
  WithQuery,
  surface,
  useMainSidebarState
} from '@lifeforge/ui'

import type { CalendarCategory, CalendarEvent } from '@/components/Calendar'
import EventDetails from '@/components/Calendar/components/EventDetails'
import { useInternalCategories } from '@/hooks/useInternalCategories'
import { forgeAPI } from '@/manifest'

function EventItem({
  categories,
  event
}: {
  categories: InferOutput<typeof forgeAPI.categories.list>
  event: CalendarEvent
}) {
  const { sidebarExpanded } = useMainSidebarState()
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const { map: internalCategoryMap } = useInternalCategories()

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
        ? internalCategoryMap[event.category]
        : categories.find(category => category.id === event.category)) as
        CalendarCategory | undefined,
    [event.category, categories, internalCategoryMap]
  )

  return (
    <>
      <Card
        key={event.id}
        ref={ref}
        bg={surface.light}
        data-tooltip-id={`calendar-event-${event.id}`}
      >
        <Flex align="center" gap="sm">
          <Box
            height="2.5rem"
            r="full"
            style={{
              backgroundColor: targetCategory?.color
            }}
            width="0.25rem"
          />
          <Flex direction="column" gap="xs" width="100%">
            <Flex align="center" gap="xs">
              <Icon
                icon={targetCategory?.icon ?? ''}
                size="0.875em"
                style={{ color: targetCategory?.color }}
              />
              <Text color="muted" size="sm">
                {targetCategory?.name}
              </Text>
            </Flex>
            <Text weight="semibold">{event.title}</Text>
          </Flex>
        </Flex>
      </Card>
      {
        createPortal(
          <Box
            asChild
            shadow
            bg={{ base: 'bg-50', dark: 'bg-800' }}
            r="md"
            zIndex={{ base: sidebarExpanded ? '-1' : '0', lg: '0' }}
          >
            <Tooltip
              clickable
              noArrow
              openOnClick
              id={`calendar-event-${event.id}`}
              opacity={1}
              place="bottom-start"
              positionStrategy="fixed"
            >
              <Box
                maxHeight="24rem"
                overflowY="auto"
                position="relative"
                style={{
                  whiteSpace: 'normal',
                  width: `${width - 32}px`
                }}
              >
                <EventDetails
                  category={targetCategory}
                  editable={false}
                  event={event}
                />
              </Box>
            </Tooltip>
          </Box>,
          document.getElementById('app') ?? document.body
        ) as React.ReactPortal
      }
    </>
  )
}

export default function TodaysEvent() {
  const rawEventsQuery = useQuery(forgeAPI.events.getToday.queryOptions())
  const categoriesQuery = useQuery(forgeAPI.categories.list.queryOptions())

  return (
    <Widget
      actionComponent={
        <Button
          as={Link}
          icon="tabler:chevron-right"
          mr="sm"
          p="sm"
          to="/calendar"
          variant="plain"
        />
      }
      icon="tabler:calendar"
      pr="md"
      title="Todays Event"
    >
      <Scrollbar>
        <WithQuery query={categoriesQuery}>
          {categories => (
            <WithQuery query={rawEventsQuery}>
              {() => {
                const targetEvents = (rawEventsQuery.data ?? []).filter(
                  event =>
                    dayjs(event.start)
                      .add(1, 'second')
                      .isSame(dayjs(), 'day') ||
                    dayjs(event.end)
                      .subtract(1, 'second')
                      .isSame(dayjs(), 'day')
                )

                return targetEvents.length > 0 ? (
                  <Flex as="ul" direction="column" gap="xs" pr="sm">
                    {targetEvents.map(event => (
                      <EventItem
                        key={event.id}
                        categories={categories}
                        event={event}
                      />
                    ))}
                  </Flex>
                ) : (
                  <Flex centered flex="1">
                    <EmptyStateScreen
                      smaller
                      icon="tabler:calendar-off"
                      message={{
                        id: 'event',
                        tKey: 'widgets.todaysEvent'
                      }}
                    />
                  </Flex>
                )
              }}
            </WithQuery>
          )}
        </WithQuery>
      </Scrollbar>
    </Widget>
  )
}

export const config: WidgetConfig = {
  id: 'todaysEvent',
  icon: 'tabler:calendar-event'
}
