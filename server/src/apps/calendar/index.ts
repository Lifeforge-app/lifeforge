import forgeRouter from '@functions/forgeRouter'

import calendarCalendarsRouter from './controllers/calendars.controller'
import calendarCategoriesRouter from './controllers/categories.controller'
import calendarEventsRouter from './controllers/events.controller'

export default forgeRouter({
  '/events': calendarEventsRouter,
  '/calendars': calendarCalendarsRouter,
  '/categories': calendarCategoriesRouter
})
