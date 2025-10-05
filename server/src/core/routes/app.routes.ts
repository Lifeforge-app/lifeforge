import { forgeRouter } from '@functions/routes'

const appRoutes = forgeRouter({
  achievements: (await import('@lib/achievements/server')).default,
  calendar: (await import('@lib/calendar/server')).default,
  todoList: (await import('@lib/todoList/server')).default,
  ideaBox: (await import('@lib/ideaBox/server')).default,
  'code-time': (await import('@lib/codeTime/server')).default,
  booksLibrary: (await import('@lib/booksLibrary/server')).default,
  wallet: (await import('@lib/wallet/server')).default,
  wishlist: (await import('@lib/wishlist/server')).default,
  scoresLibrary: (await import('@lib/scoresLibrary/server')).default,
  passwords: (await import('@lib/passwords/server')).default,
  sudoku: (await import('@lib/sudoku/server')).default,
  momentVault: (await import('@lib/momentVault/server')).default,
  movies: (await import('@lib/movies/server')).default,
  railwayMap: (await import('@lib/railwayMap/server')).default,
  youtubeSummarizer: (await import('@lib/youtubeSummarizer/server')).default,
  blog: (await import('@lib/blog/server')).default,
  changiAirportFlightStatus: (
    await import('@lib/changiAirportFlightStatus/server')
  ).default,
  music: (await import('@lib/music/server')).default,
  sinChewDaily: (await import('@lib/sinChewDaily/server')).default
})

export default appRoutes
