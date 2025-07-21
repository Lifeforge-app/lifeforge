import forgeRouter from '@functions/forgeRouter'

import calendarsRouter from './controllers/calendars'
import categoriesRouter from './controllers/categories'
import eventsRouter from './controllers/events'

export default forgeRouter({
  '/events': eventsRouter,
  '/calendars': calendarsRouter,
  '/categories': categoriesRouter
})
