import moment from 'moment'
import { useState } from 'react'

import { QueryWrapper } from '@lifeforge/ui'

import { type Loadable } from '@interfaces/common'

import useAPIQuery from '@hooks/useAPIQuery'

import {
  type ICalendarCategory,
  ICalendarEvent
} from '../../../../interfaces/calendar_interfaces'
import MiniCalendarContent from './components/MiniCalendarContent'
import MiniCalendarHeader from './components/MiniCalendarHeader'

function MiniCalendar({
  categories
}: {
  categories: Loadable<ICalendarCategory[]>
}) {
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

  return (
    <section className="flex w-full flex-col gap-4 p-8 pt-6">
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
              categories={categories}
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
