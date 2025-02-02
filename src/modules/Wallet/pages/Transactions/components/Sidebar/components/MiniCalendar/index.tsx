import moment from 'moment'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SidebarTitle } from '@components/layouts/sidebar'
import MiniCalendarContent from './components/MiniCalendarContent'
import MiniCalendarHeader from './components/MiniCalendarHeader'

function MiniCalendar(): React.ReactElement {
  const { t } = useTranslation('modules.wallet')
  const [currentMonth, setCurrentMonth] = useState(moment().month())
  const [currentYear, setCurrentYear] = useState(moment().year())

  return (
    <>
      <SidebarTitle name={t('sidebar.calendarHeatmap')} />
      <div className="w-full px-8">
        <MiniCalendarHeader
          currentMonth={currentMonth}
          currentYear={currentYear}
          setCurrentMonth={setCurrentMonth}
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
