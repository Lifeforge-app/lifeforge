import MiniCalendarContent from '@/components/Sidebar/components/MiniCalendar/components/MiniCalendarContent'
import MiniCalendarHeader from '@/components/Sidebar/components/MiniCalendar/components/MiniCalendarHeader'
import forgeAPI from '@/utils/forgeAPI'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { Button, Widget, WithQuery } from 'lifeforge-ui'
import { useState } from 'react'
import { Link } from 'shared'
import type { WidgetConfig } from 'shared'

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
    forgeAPI.calendar.events.getByDateRange
      .input({
        start: startDate,
        end: endDate
      })
      .queryOptions()
  )

  return (
    <Widget
      className="higher-z"
      actionComponent={
        <Button
          as={Link}
          className="p-2!"
          icon="tabler:chevron-right"
          to="/calendar"
          variant="plain"
        />
      }
      icon="tabler:calendar"
      namespace="apps.calendar"
      title="Mini Calendar"
    >
      <div className="relative z-[9999] size-full">
        <div className="px-2">
          <MiniCalendarHeader
            currentMonth={currentMonth}
            currentYear={currentYear}
            setCurrentMonth={setCurrentMonth}
            setCurrentYear={setCurrentYear}
          />
        </div>
        <WithQuery query={eventsQuery}>
          {events => (
            <MiniCalendarContent
              currentMonth={currentMonth}
              currentYear={currentYear}
              events={events}
            />
          )}
        </WithQuery>
      </div>
    </Widget>
  )
}

export const config: WidgetConfig = {
  namespace: 'apps.calendar',
  id: 'miniCalendar',
  icon: 'tabler:calendar',
  minW: 2,
  minH: 4
}
