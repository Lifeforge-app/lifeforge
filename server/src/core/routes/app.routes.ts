import { forgeRouter } from '@functions/routes'

const appRoutes = forgeRouter({
  achievements: (await import('@lib/achievements/server')).default,
  'code-time': (await import('@lib/codeTime/server')).default,
  codeTime: (await import('@lib/codeTime/server')).default,
  passwords: (await import('@lib/passwords/server')).default,
  ideaBox: (await import('@lib/ideaBox/server')).default,
  scoresLibrary: (await import('@lib/scoresLibrary/server')).default,
  sinChewDaily: (await import('@lib/sinChewDaily/server')).default,
  railwayMap: (await import('@lib/railwayMap/server')).default,
  music: (await import('@lib/music/server')).default,
  calendar: (await import('@lib/calendar/server')).default,
  booksLibrary: (await import('@lib/booksLibrary/server')).default,
  sudoku: (await import('@lib/sudoku/server')).default,
  changiAirportFlightStatus: (
    await import('@lib/changiAirportFlightStatus/server')
  ).default,
  movies: (await import('@lib/movies/server')).default,
  momentVault: (await import('@lib/momentVault/server')).default,
  wallet: (await import('@lib/wallet/server')).default,
  todoList: (await import('@lib/todoList/server')).default
})
export default appRoutes
