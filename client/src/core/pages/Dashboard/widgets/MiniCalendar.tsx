import dayjs from 'dayjs'
import { Button, DashboardItem, QueryWrapper } from 'lifeforge-ui'
import { useState } from 'react'
import { Link } from 'react-router'

import { useAPIQuery } from 'shared/lib'
import { CalendarControllersSchemas } from 'shared/types/controllers'

import MiniCalendarContent from '@apps/Calendar/components/Sidebar/components/MiniCalendar/components/MiniCalendarContent'
import MiniCalendarHeader from '@apps/Calendar/components/Sidebar/components/MiniCalendar/components/MiniCalendarHeader'

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

  const eventsQuery = useAPIQuery<
    CalendarControllersSchemas.IEvents['getEventsByDateRange']['response']
  >(`calendar/events?start=${startDate}&end=${endDate}`, [
    'calendar',
    'events',
    currentYear,
    currentMonth
  ])

  return (
    <DashboardItem
      className="higher-z"
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
      title="mini Calendar"
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
        <QueryWrapper query={eventsQuery}>
          {events => (
            <MiniCalendarContent
              currentMonth={currentMonth}
              currentYear={currentYear}
              events={events}
            />
          )}
        </QueryWrapper>
      </div>
    </DashboardItem>
  )
}
