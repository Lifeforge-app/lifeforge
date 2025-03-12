import { Icon } from '@iconify/react'
import { useGlobalState } from '@providers/GlobalStateProvider'
import { usePersonalization } from '@providers/PersonalizationProvider'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout'

import { EmptyStateScreen, LoadingScreen } from '@lifeforge/ui'

import Achievements from '../widgets/Achievements'
import AssetsBalance from '../widgets/AssetsBalance'
import Bookshelf from '../widgets/Bookshelf'
import Clock from '../widgets/Clock'
import CodeTime from '../widgets/CodeTime'
import DateWidget from '../widgets/Date'
import ExpensesBreakdown from '../widgets/ExpensesBreakdown'
import FlashCards from '../widgets/FlashCards'
import IdeaBox from '../widgets/IdexBox'
import IncomeAndExpenses from '../widgets/IncomeAndExpenses'
import Journal from '../widgets/Journal'
import MiniCalendar from '../widgets/MiniCalendar'
import MusicPlayer from '../widgets/MusicPlayer'
import PomodoroTimer from '../widgets/PomodoroTimer'
import QuickActions from '../widgets/QuickActions'
import Quotes from '../widgets/Quotes'
import RecentTransactions from '../widgets/RecentTransactions'
import ServerStatus from '../widgets/ServerStatus'
import Spotify from '../widgets/Spotify'
import StorageStatus from '../widgets/StorageStatus'
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
  storageStatus: StorageStatus,
  serverStatus: ServerStatus,
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
}): React.ReactElement {
  const { sidebarExpanded } = useGlobalState()
  const [width, setWidth] = useState(0)
  const { dashboardLayout: enabledWidgets, setDashboardLayout } =
    usePersonalization()

  function handleResize(): void {
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

  const onLayoutChange = (_: any, layouts: any): void => {
    setDashboardLayout(layouts)
  }

  if (width === 0) {
    return <LoadingScreen />
  }

  return Object.values(enabledWidgets).every(e => e.length === 0) ? (
    <div className="flex h-full flex-1 items-center justify-center">
      <EmptyStateScreen
        icon="tabler:apps-off"
        name="widget"
        namespace="modules.dashboard"
      />
    </div>
  ) : (
    <RGL
      className={clsx('pt-6', canLayoutChange && 'pb-64')}
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
              className="absolute bottom-0 right-0 text-2xl"
              icon="clarity:drag-handle-corner-line"
            />
          )}
        </div>
      ))}
    </RGL>
  )
}

export default DashboardGrid
