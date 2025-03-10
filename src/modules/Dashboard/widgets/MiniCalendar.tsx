import moment from 'moment'
import React, { useState } from 'react'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import DashboardItem from '@components/utilities/DashboardItem'
import useFetch from '@hooks/useFetch'
import {
  type ICalendarCategory,
  type ICalendarEvent
} from '@interfaces/calendar_interfaces'
import MiniCalendarContent from '../../Calendar/components/Sidebar/components/MiniCalendar/components/MiniCalendarContent'
import MiniCalendarHeader from '../../Calendar/components/Sidebar/components/MiniCalendar/components/MiniCalendarHeader'

export default function MiniCalendar(): React.ReactElement {
  const [currentMonth, setCurrentMonth] = useState(moment().month())
  const [currentYear, setCurrentYear] = useState(moment().year())

  const [events] = useFetch<ICalendarEvent[]>('calendar/events')
  const [categories] = useFetch<ICalendarCategory[]>('calendar/categories')

  return (
    <DashboardItem icon="tabler:calendar" title="mini Calendar">
      <APIFallbackComponent data={events}>
        {events => (
          <div className="size-full">
            <div className="px-2">
              <MiniCalendarHeader
                currentMonth={currentMonth}
                currentYear={currentYear}
                setCurrentMonth={setCurrentMonth}
                setCurrentYear={setCurrentYear}
              />
            </div>
            <MiniCalendarContent
              categories={categories}
              currentMonth={currentMonth}
              currentYear={currentYear}
              events={events}
            />
          </div>
        )}
      </APIFallbackComponent>
    </DashboardItem>
  )
}
