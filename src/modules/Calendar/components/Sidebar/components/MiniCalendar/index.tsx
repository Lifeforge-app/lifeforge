import moment from 'moment'
import { useState } from 'react'

import { type Loadable } from '@interfaces/common'

import {
  type ICalendarCategory,
  type ICalendarEvent
} from '../../../../interfaces/calendar_interfaces'
import MiniCalendarContent from './components/MiniCalendarContent'
import MiniCalendarHeader from './components/MiniCalendarHeader'

function MiniCalendar({
  events,
  categories
}: {
  events: ICalendarEvent[]
  categories: Loadable<ICalendarCategory[]>
}) {
  const [currentMonth, setCurrentMonth] = useState(moment().month())
  const [currentYear, setCurrentYear] = useState(moment().year())

  return (
    <section className="flex w-full flex-col gap-4 p-8 pt-6">
      <div className="size-full">
        <MiniCalendarHeader
          currentMonth={currentMonth}
          currentYear={currentYear}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
        />
        <MiniCalendarContent
          categories={categories}
          currentMonth={currentMonth}
          currentYear={currentYear}
          events={events}
        />
      </div>
    </section>
  )
}

export default MiniCalendar
