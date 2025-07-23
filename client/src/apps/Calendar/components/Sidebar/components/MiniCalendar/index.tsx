import dayjs from 'dayjs'
import { QueryWrapper } from 'lifeforge-ui'
import { useState } from 'react'
import { useAPIQuery } from 'shared'

import { ICalendarEvent } from '@apps/Calendar/components/Calendar'

import MiniCalendarContent from './components/MiniCalendarContent'
import MiniCalendarHeader from './components/MiniCalendarHeader'

function MiniCalendar() {
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

  return (
    <section className="flex w-full flex-col gap-3 px-8 py-4">
      <div className="size-full">
        <MiniCalendarHeader
          currentMonth={currentMonth}
          currentYear={currentYear}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
        />
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
    </section>
  )
}

export default MiniCalendar
