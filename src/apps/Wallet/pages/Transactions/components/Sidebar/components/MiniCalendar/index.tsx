import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { SidebarTitle } from '@lifeforge/ui'

import { IWalletTransaction } from '@apps/Wallet/interfaces/wallet_interfaces'

import MiniCalendarContent from './components/MiniCalendarContent'
import MiniCalendarHeader from './components/MiniCalendarHeader'
import MiniCalendarToggleViewMenu from './components/MiniCalendarToggleViewMenu'

function MiniCalendar() {
  const { t } = useTranslation('apps.wallet')
  const [currentMonth, setCurrentMonth] = useState(dayjs().month())
  const [currentYear, setCurrentYear] = useState(dayjs().year())
  const [viewsFilter, setViewsFilter] = useState<IWalletTransaction['type'][]>([
    'income',
    'expenses'
  ])

  const toggleView = useCallback((view: IWalletTransaction['type']) => {
    setViewsFilter(prevViews =>
      prevViews.includes(view)
        ? prevViews.filter(v => v !== view)
        : [...prevViews, view]
    )
  }, [])

  return (
    <>
      <SidebarTitle
        customActionButton={
          <MiniCalendarToggleViewMenu
            toggleView={toggleView}
            viewsFilter={viewsFilter}
          />
        }
        name={t('sidebar.calendarHeatmap')}
      />
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
          viewsFilter={viewsFilter}
        />
      </div>
    </>
  )
}

export default MiniCalendar
