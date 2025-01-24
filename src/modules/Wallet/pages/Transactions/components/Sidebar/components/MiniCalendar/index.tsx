import moment from 'moment'
import React, { useState } from 'react'
import { SidebarTitle } from '@components/layouts/sidebar'
import MiniCalendarContent from './components/MiniCalendarContent'
import MiniCalendarHeader from './components/MiniCalendarHeader'

function MiniCalendar(): React.ReactElement {
  const [currentMonth, setCurrentMonth] = useState(moment().month())
  const [currentYear, setCurrentYear] = useState(moment().year())

  return (
    <>
      <SidebarTitle name="Calendar Heatmap" />
      <div className="w-full px-8">
        <MiniCalendarHeader
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          currentYear={currentYear}
          setCurrentYear={setCurrentYear}
        />
        <MiniCalendarContent
          currentMonth={currentMonth}
          currentYear={currentYear}
        />
      </div>
    </>
  )
}

export default MiniCalendar
