import express from 'express'

import calendarCalendarsRouter from './controllers/calendars.controller'
import calendarCategoriesRouter from './controllers/categories.controller'
import calendarEventsRouter from './controllers/events.controller'

const router = express.Router()

router.use('/events', calendarEventsRouter)
router.use('/calendars', calendarCalendarsRouter)
router.use('/categories', calendarCategoriesRouter)

export default router
