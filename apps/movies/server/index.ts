import { forgeRouter } from '@functions/routes'

import entriesRouter from './routes/entries'
import ticketRouter from './routes/ticket'
import tmdbRouter from './routes/tmdb'

export default forgeRouter({
  entries: entriesRouter,
  ticket: ticketRouter,
  tmdb: tmdbRouter
})
