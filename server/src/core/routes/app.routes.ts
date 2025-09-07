import { forgeRouter } from '@functions/routes'

const appRoutes = forgeRouter({
  achievements: (await import('@apps/achievements')).default,
  calendar: (await import('@apps/calendar')).default,
  todoList: (await import('@apps/todoList')).default,
  ideaBox: (await import('@apps/ideaBox')).default,
  'code-time': (await import('@apps/codeTime')).default,
  booksLibrary: (await import('@apps/booksLibrary')).default,
  wallet: (await import('@apps/wallet')).default,
  wishlist: (await import('@apps/wishlist')).default,
  scoresLibrary: (await import('@apps/scoresLibrary')).default,
  passwords: (await import('@apps/passwords')).default,
  sudoku: (await import('@apps/sudoku')).default,
  momentVault: (await import('@apps/momentVault')).default,
  movies: (await import('@apps/movies')).default,
  railwayMap: (await import('@apps/railwayMap')).default,
  youtubeSummarizer: (await import('@apps/youtubeSummarizer')).default,
  blog: (await import('@apps/blog')).default,
  changiAirportFlightStatus: (await import('@apps/changiAirportFlightStatus'))
    .default,
  music: (await import('@apps/music')).default,
  sinChewDaily: (await import('@apps/sinChewDaily')).default,
  journal: (await import('@apps/journal')).default
})

export default appRoutes
