import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Link } from 'react-router'

import type { WidgetConfig } from '@lifeforge/configs'
import { Button, Stack, Widget, WithQuery } from '@lifeforge/ui'

import MiniCalendarContent from '@/components/Sidebar/components/MiniCalendar/components/MiniCalendarContent'
import MiniCalendarHeader from '@/components/Sidebar/components/MiniCalendar/components/MiniCalendarHeader'
import { forgeAPI } from '@/manifest'

export default function MiniCalendar() {
  const [currentMonth, setCurrentMonth] = useState(dayjs().month())
  const [currentYear, setCurrentYear] = useState(dayjs().year())

  const startDate = dayjs()
    .year(currentYear)
    .month(currentMonth)
    .startOf('month')
    .format('YYYY-MM-DD')

  const endDate = dayjs()
    .year(currentYear)
    .month(currentMonth)
    .endOf('month')
    .format('YYYY-MM-DD')

  const eventsQuery = useQuery(
    forgeAPI.events.getByDateRange
      .input({
        start: startDate,
        end: endDate
      })
      .queryOptions()
  )

  return (
    <Widget
      actionComponent={
        <Button
          as={Link}
          icon="tabler:chevron-right"
          p="sm"
          to="/calendar"
          variant="plain"
        />
      }
      className="higher-z"
      icon="tabler:calendar"
      title="Mini Calendar"
    >
      <Stack
        gap="md"
        height="100%"
        minHeight="0"
        position="relative"
        width="100%"
        zIndex="9999"
      >
        <MiniCalendarHeader
          currentMonth={currentMonth}
          currentYear={currentYear}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
        />
        <WithQuery query={eventsQuery}>
          {events => (
            <MiniCalendarContent
              currentMonth={currentMonth}
              currentYear={currentYear}
              events={events}
            />
          )}
        </WithQuery>
      </Stack>
    </Widget>
  )
}

export const config: WidgetConfig = {
  id: 'miniCalendar',
  icon: 'tabler:calendar',
  minW: 2,
  minH: 4
}
