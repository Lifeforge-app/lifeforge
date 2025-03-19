import dayjs from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  HamburgerMenu,
  HamburgerMenuSelectorWrapper,
  MenuItem,
  SidebarTitle
} from '@lifeforge/ui'

import MiniCalendarContent from './components/MiniCalendarContent'
import MiniCalendarHeader from './components/MiniCalendarHeader'

const VIEWS = [
  ['tabler:login-2', 'income'],
  ['tabler:logout', 'expenses'],
  ['tabler:transfer', 'transfer']
] as const

function MiniCalendar() {
  const { t } = useTranslation('apps.wallet')
  const [currentMonth, setCurrentMonth] = useState(dayjs().month())
  const [currentYear, setCurrentYear] = useState(dayjs().year())
  const [viewsFilter, setViewsFilter] = useState<
    ('income' | 'expenses' | 'transfer')[]
  >(['income', 'expenses'])

  function toggleView(view: 'income' | 'expenses' | 'transfer') {
    setViewsFilter(prevViews =>
      prevViews.includes(view)
        ? prevViews.filter(v => v !== view)
        : [...prevViews, view]
    )
  }

  return (
    <>
      <SidebarTitle
        customActionButton={
          <HamburgerMenu>
            <HamburgerMenuSelectorWrapper icon="tabler:eye" title="Toggle view">
              {VIEWS.map(([icon, id]) => (
                <MenuItem
                  key={id}
                  icon={icon}
                  isToggled={viewsFilter.includes(id)}
                  namespace={false}
                  text={t(`transactionTypes.${id}`)}
                  onClick={e => {
                    e.preventDefault()
                    toggleView(id)
                  }}
                />
              ))}
            </HamburgerMenuSelectorWrapper>
          </HamburgerMenu>
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
