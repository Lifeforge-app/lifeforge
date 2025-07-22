import forgeRouter from '@functions/forgeRouter'

import calendarsRouter from './routes/calendars'
import categoriesRouter from './routes/categories'
import eventsRouter from './routes/events'

export default forgeRouter({
  '/events': eventsRouter,
  '/calendars': calendarsRouter,
  '/categories': categoriesRouter
})
