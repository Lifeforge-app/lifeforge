const DASHBOARD_WIDGETS: Record<
  string,
  {
    icon: string
    minW?: number
    minH?: number
  }
> = {
  date: {
    icon: 'tabler:calendar-clock',
    minW: 2
  },
  clock: {
    icon: 'tabler:clock'
  },
  quotes: {
    icon: 'tabler:quote'
  },
  quickActions: {
    icon: 'tabler:layout-grid'
  },
  miniCalendar: {
    icon: 'tabler:calendar',
    minH: 4,
    minW: 2
  },
  todaysEvent: {
    icon: 'tabler:calendar-event'
  },
  todoList: {
    icon: 'tabler:checklist'
  },
  pomodoroTimer: {
    icon: 'tabler:clock'
  },
  codeTime: {
    icon: 'tabler:code'
  },
  ideaBox: {
    icon: 'tabler:bulb'
  },
  journal: {
    icon: 'tabler:book'
  },
  flashCards: {
    icon: 'tabler:cards'
  },
  bookshelf: {
    icon: 'tabler:books'
  },
  achievements: {
    icon: 'tabler:award'
  },
  spotify: {
    icon: 'tabler:brand-spotify'
  },
  musicPlayer: {
    icon: 'tabler:music',
    minW: 2,
    minH: 4
  },
  expensesBreakdown: {
    icon: 'tabler:chart-bar'
  },
  incomeExpenses: {
    icon: 'tabler:exchange'
  },
  recentTransactions: {
    icon: 'tabler:file-text'
  },
  assetsBalance: {
    icon: 'tabler:coin'
  },
  serverStatus: {
    icon: 'tabler:server'
  },
  storageStatus: {
    icon: 'tabler:database'
  }
}

export default DASHBOARD_WIDGETS
