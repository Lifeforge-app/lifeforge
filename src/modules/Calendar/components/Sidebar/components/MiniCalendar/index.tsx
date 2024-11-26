/* eslint-disable @typescript-eslint/indent */
import moment from 'moment'
import React, { useState } from 'react'
import {
  type ICalendarCategory,
  type ICalendarEvent
} from '@interfaces/calendar_interfaces'
import MiniCalendarContent from './components/MiniCalendarContent'
import MiniCalendarHeader from './components/MiniCalendarHeader'

function MiniCalendar({
  events,
  categories
}: {
  events: ICalendarEvent[]
  categories: ICalendarCategory[] | 'loading' | 'error'
}): React.ReactElement {
  const [currentMonth, setCurrentMonth] = useState(moment().month())
  const [currentYear, setCurrentYear] = useState(moment().year())

  return (
    <section className="flex w-full flex-col gap-4 p-8 pt-6">
      <div className="size-full">
        <MiniCalendarHeader
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          currentYear={currentYear}
          setCurrentYear={setCurrentYear}
        />
        <MiniCalendarContent
          currentMonth={currentMonth}
          currentYear={currentYear}
          events={events}
          categories={categories}
        />
      </div>
    </section>
  )
}

export default MiniCalendar
