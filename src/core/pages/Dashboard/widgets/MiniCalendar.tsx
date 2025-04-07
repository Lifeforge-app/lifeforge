import dayjs from 'dayjs'
import { useState } from 'react'

import { DashboardItem, QueryWrapper } from '@lifeforge/ui'

import MiniCalendarContent from '@apps/Calendar/components/Sidebar/components/MiniCalendar/components/MiniCalendarContent'
import MiniCalendarHeader from '@apps/Calendar/components/Sidebar/components/MiniCalendar/components/MiniCalendarHeader'
import {
  type ICalendarCategory,
  type ICalendarEvent
} from '@apps/Calendar/interfaces/calendar_interfaces'

import useAPIQuery from '@hooks/useAPIQuery'

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

  const eventsQuery = useAPIQuery<ICalendarEvent[]>(
    `calendar/events?start=${startDate}&end=${endDate}`,
    ['calendar', 'events', currentYear, currentMonth]
  )

  const categoriesQuery = useAPIQuery<ICalendarCategory[]>(
    'calendar/categories',
    ['calendar', 'categories']
  )

  return (
    <DashboardItem
      className="higher-z"
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
        <QueryWrapper query={categoriesQuery}>
          {categories => (
            <QueryWrapper query={eventsQuery}>
              {events => (
                <MiniCalendarContent
                  categories={categories}
                  currentMonth={currentMonth}
                  currentYear={currentYear}
                  events={events}
                />
              )}
            </QueryWrapper>
          )}
        </QueryWrapper>
      </div>
    </DashboardItem>
  )
}
