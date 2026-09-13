import dayjs from 'dayjs'
import { useCallback, useState } from 'react'

import { Box, SidebarTitle } from '@lifeforge/ui'

import type { WalletTransaction } from '@/pages/Transactions'

import MiniCalendarContent from './components/MiniCalendarContent'
import MiniCalendarHeader from './components/MiniCalendarHeader'
import MiniCalendarToggleViewMenu from './components/MiniCalendarToggleViewMenu'

function MiniCalendar() {
  const [currentMonth, setCurrentMonth] = useState(dayjs().month())
  const [currentYear, setCurrentYear] = useState(dayjs().year())

  const [viewsFilter, setViewsFilter] = useState<WalletTransaction['type'][]>([
    'income',
    'expenses'
  ])

  const toggleView = useCallback((view: WalletTransaction['type']) => {
    setViewsFilter(prevViews =>
      prevViews.includes(view)
        ? prevViews.filter(v => v !== view)
        : [...prevViews, view]
    )
  }, [])

  return (
    <>
      <SidebarTitle
        actionButton={
          <MiniCalendarToggleViewMenu
            toggleView={toggleView}
            viewsFilter={viewsFilter}
          />
        }
        label="calendarHeatmap"
      />
      <Box px="xl" width="100%">
        <MiniCalendarHeader
          currentMonth={currentMonth}
          currentYear={currentYear}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
        />
        <MiniCalendarContent
          currentMonth={currentMonth}
          currentYear={currentYear}
          viewsFilter={viewsFilter}
        />
      </Box>
    </>
  )
}

export default MiniCalendar
