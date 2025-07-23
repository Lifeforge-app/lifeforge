import { Icon } from '@iconify/react'
import { useUserPersonalization } from '@providers/UserPersonalizationProvider'
import clsx from 'clsx'
import { EmptyStateScreen, LoadingScreen } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout'
import { useTranslation } from 'react-i18next'
import { useSidebarState } from 'shared'
import { usePersonalization } from 'shared'

import Achievements from '../widgets/Achievements'
import AssetsBalance from '../widgets/AssetsBalance'
import Bookshelf from '../widgets/Bookshelf'
import Clock from '../widgets/Clock'
import CodeTime from '../widgets/CodeTime'
import DateWidget from '../widgets/Date'
import ExpensesBreakdown from '../widgets/ExpensesBreakdown'
import FlashCards from '../widgets/FlashCards'
import IdeaBox from '../widgets/IdeaBox'
import IncomeAndExpenses from '../widgets/IncomeAndExpenses'
import Journal from '../widgets/Journal'
import MiniCalendar from '../widgets/MiniCalendar'
import MusicPlayer from '../widgets/MusicPlayer'
import PomodoroTimer from '../widgets/PomodoroTimer'
import QuickActions from '../widgets/QuickActions'
import Quotes from '../widgets/Quotes'
import RecentTransactions from '../widgets/RecentTransactions'
import Spotify from '../widgets/Spotify'
import TodaysEvent from '../widgets/TodaysEvent'
import TodoList from '../widgets/TodoList'

const RGL: any = ResponsiveGridLayout as any

const COMPONENTS = {
  date: DateWidget,
  clock: Clock,
  quotes: Quotes,
  ideaBox: IdeaBox,
  todaysEvent: TodaysEvent,
  expensesBreakdown: ExpensesBreakdown,
  incomeExpenses: IncomeAndExpenses,
  recentTransactions: RecentTransactions,
  assetsBalance: AssetsBalance,
  todoList: TodoList,
  spotify: Spotify,
  miniCalendar: MiniCalendar,
  codeTime: CodeTime,
  pomodoroTimer: PomodoroTimer,
  flashCards: FlashCards,
  bookshelf: Bookshelf,
  journal: Journal,
  achievements: Achievements,
  musicPlayer: MusicPlayer,
  quickActions: QuickActions
}

function DashboardGrid({
  wrapperRef,
  canLayoutChange
}: {
  wrapperRef: React.RefObject<HTMLDivElement | null>
  canLayoutChange: boolean
}) {
  const { t } = useTranslation('core.dashboard')

  const { sidebarExpanded } = useSidebarState()

  const [width, setWidth] = useState(0)

  const { dashboardLayout: enabledWidgets } = usePersonalization()

  const { changeDashboardLayout } = useUserPersonalization()

  function handleResize() {
    if (wrapperRef.current !== null) {
      setWidth(wrapperRef.current.offsetWidth)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      handleResize()
    }, 200)
  }, [wrapperRef.current, sidebarExpanded])

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [wrapperRef.current])

  const onLayoutChange = (_: any, layouts: any) => {
    changeDashboardLayout(layouts)
  }

  if (width === 0) {
    return <LoadingScreen customMessage={t('loading')} />
  }

  return Object.values(enabledWidgets).every(e => e.length === 0) ? (
    <div className="flex h-full flex-1 items-center justify-center">
      <EmptyStateScreen
        icon="tabler:apps-off"
        name="widget"
        namespace="core.dashboard"
      />
    </div>
  ) : (
    <RGL
      className={canLayoutChange && 'pb-64'}
      cols={
        {
          lg: 8,
          md: 8,
          sm: 4,
          xs: 4,
          xxs: 4
        } as any
      }
      isDraggable={canLayoutChange}
      isDroppable={canLayoutChange}
      isResizable={canLayoutChange}
      layouts={enabledWidgets}
      rowHeight={100}
      width={width}
      onLayoutChange={onLayoutChange}
    >
      {[
        ...new Set(
          Object.values(enabledWidgets)
            .map(widgetArray => widgetArray.map(widget => widget.i))
            .flat()
        )
      ].map(widgetId => (
        <div key={widgetId} className={clsx(canLayoutChange && 'cursor-move')}>
          {(() => {
            const Component = COMPONENTS[widgetId as keyof typeof COMPONENTS]

            return <Component />
          })()}
          {canLayoutChange && (
            <Icon
              className="absolute right-0 bottom-0 text-2xl"
              icon="clarity:drag-handle-corner-line"
            />
          )}
        </div>
      ))}
    </RGL>
  )
}

export default DashboardGrid
