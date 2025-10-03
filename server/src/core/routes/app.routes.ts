import { forgeRouter } from '@functions/routes'

const appRoutes = forgeRouter({
  achievements: (await import('@lib/achievements/server')).default,
  calendar: (await import('@lib/calendar')).default,
  todoList: (await import('@lib/todoList')).default,
  ideaBox: (await import('@lib/ideaBox')).default,
  'code-time': (await import('@lib/codeTime')).default,
  booksLibrary: (await import('@lib/booksLibrary')).default,
  wallet: (await import('@lib/wallet/server')).default,
  wishlist: (await import('@lib/wishlist')).default,
  scoresLibrary: (await import('@lib/scoresLibrary')).default,
  passwords: (await import('@lib/passwords')).default,
  sudoku: (await import('@lib/sudoku')).default,
  momentVault: (await import('@lib/momentVault')).default,
  movies: (await import('@lib/movies')).default,
  railwayMap: (await import('@lib/railwayMap')).default,
  youtubeSummarizer: (await import('@lib/youtubeSummarizer')).default,
  blog: (await import('@lib/blog')).default,
  changiAirportFlightStatus: (await import('@lib/changiAirportFlightStatus'))
    .default,
  music: (await import('@lib/music')).default,
  sinChewDaily: (await import('@lib/sinChewDaily')).default,
  journal: (await import('@lib/journal')).default
})

export default appRoutes
