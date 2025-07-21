import forgeRouter from '@functions/forgeRouter'

import entriesRouter from './controllers/entries'
import ticketRouter from './controllers/ticket'
import tmdbRouter from './controllers/tmdb'

export default forgeRouter({
  '/entries': entriesRouter,
  '/ticket': ticketRouter,
  '/tmdb': tmdbRouter
})
