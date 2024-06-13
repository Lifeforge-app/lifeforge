import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout'

import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import Achievements from '../modules/Achievements'
import AssetsBalance from '../modules/AssetsBalance'
import Bookshelf from '../modules/Bookshelf'
import CodeTime from '../modules/CodeTime'
import ExpensesBreakdown from '../modules/ExpensesBreakdown'
import FlashCards from '../modules/FlashCards'
import IdeaBox from '../modules/IdexBox'
import IncomeAndExpenses from '../modules/IncomeAndExpenses'
import Journal from '../modules/Journal'
import MiniCalendar from '../modules/MiniCalendar'
import MusicPlayer from '../modules/MusicPlayer'
import PomodoroTimer from '../modules/PomodoroTimer'
import RecentTransactions from '../modules/RecentTransactions'
import ServerStatus from '../modules/ServerStatus'
import Spotify from '../modules/Spotify'
import StorageStatus from '../modules/StorageStatus'
import TodaysEvent from '../modules/TodaysEvent'
import TodoList from '../modules/TodoList'

const COMPONENTS = {
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
  musicPlayer: MusicPlayer
}

function DashboardGrid({
  wrapperRef,
  canLayoutChange
}: {
  wrapperRef: React.RefObject<HTMLDivElement | null>
  canLayoutChange: boolean
}): React.ReactElement {
  const { sidebarExpanded } = useGlobalStateContext()
  const [width, setWidth] = useState(0)
  const { dashboardLayout: enabledWidgets, setDashboardLayout } =
    usePersonalizationContext()

  useEffect(() => {
    setTimeout(() => {
      if (wrapperRef.current !== null) {
        setWidth(wrapperRef.current.offsetWidth)
      }
    }, 200)
  }, [wrapperRef.current, sidebarExpanded])

  useEffect(() => {
    function handleResize(): void {
      if (wrapperRef.current !== null) {
        setWidth(wrapperRef.current.offsetWidth)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [wrapperRef.current])

  const onLayoutChange = (_: any, layouts: any): void => {
    setDashboardLayout(layouts)
  }

  if (width === 0) {
    return <div>Loading...</div>
  }

  return (
    // @ts-expect-error cannot fix
    <ResponsiveGridLayout
      className={`mt-6 translate-x-[-10px] ${canLayoutChange ? 'mb-64' : ''}`}
      layouts={enabledWidgets}
      cols={
        {
          lg: 8,
          md: 8,
          sm: 4,
          xs: 4,
          xxs: 4
        } as any
      }
      onLayoutChange={onLayoutChange}
      rowHeight={100}
      width={width + 10}
      isDraggable={canLayoutChange}
      isResizable={canLayoutChange}
      isDroppable={canLayoutChange}
    >
      {[
        ...new Set(
          Object.values(enabledWidgets)
            .map(e => e.map(e => e.i))
            .flat()
        )
      ].map(i => (
        <div key={i} className={canLayoutChange ? 'cursor-move' : ''}>
          {(() => {
            const Component = COMPONENTS[i as keyof typeof COMPONENTS]
            return <Component />
          })()}
          {canLayoutChange && (
            <Icon
              icon="clarity:drag-handle-corner-line"
              className="absolute bottom-0 right-0 text-2xl"
            />
          )}
        </div>
      ))}
    </ResponsiveGridLayout>
  )
}

export default DashboardGrid
