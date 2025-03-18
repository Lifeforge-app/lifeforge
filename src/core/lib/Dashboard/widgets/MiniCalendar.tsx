import moment from 'moment'
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
  const [currentMonth, setCurrentMonth] = useState(moment().month())
  const [currentYear, setCurrentYear] = useState(moment().year())

  const startDate = moment()
    .year(currentYear)
    .month(currentMonth)
    .startOf('month')
    .format('YYYY-MM-DD')
  const endDate = moment()
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
    <DashboardItem icon="tabler:calendar" title="mini Calendar">
      <div className="size-full">
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
