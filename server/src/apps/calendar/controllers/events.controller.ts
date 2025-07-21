import ClientError from '@functions/ClientError'
import { forgeController } from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { getAPIKey } from '@functions/getAPIKey'
import { singleUploadMiddleware } from '@middlewares/uploadMiddleware'

import { CalendarControllersSchemas } from 'shared/types/controllers'

import * as EventsService from '../services/events.service'

const getEventsByDateRange = forgeController
  .route('GET /')
  .description('Get events by date range')
  .schema(CalendarControllersSchemas.Events.getEventsByDateRange)
  .callback(
    async ({ pb, query: { start, end } }) =>
      await EventsService.getEventsByDateRange(pb, start, end)
  )

const getEventsToday = forgeController
  .route('GET /today')
  .description("Get today's events")
  .schema(CalendarControllersSchemas.Events.getEventsToday)
  .callback(async ({ pb }) => await EventsService.getTodayEvents(pb))

const getEventById = forgeController
  .route('GET /:id')
  .description('Get an event by ID')
  .schema(CalendarControllersSchemas.Events.getEventById)
  .existenceCheck('params', {
    id: 'calendar__events'
  })
  .callback(
    async ({ pb, params: { id } }) => await EventsService.getEventById(pb, id)
  )

const createEvent = forgeController
  .route('POST /')
  .description('Create a new event')
  .schema(CalendarControllersSchemas.Events.createEvent)
  .statusCode(201)
  .existenceCheck('body', {
    calendar: '[calendar__calendars]',
    category: 'calendar__categories'
  })
  .callback(async ({ pb, body }) => {
    return await EventsService.createEvent(
      pb,
      body as CalendarControllersSchemas.IEvents['createEvent']['body']
    )
  })

const scanImage = forgeController
  .route('POST /scan-image')
  .description('Scan an image to extract event data')
  .schema(CalendarControllersSchemas.Events.scanImage)
  .middlewares(singleUploadMiddleware)
  .callback(async ({ pb, req }) => {
    const { file } = req

    if (!file) {
      throw new ClientError('No file uploaded')
    }

    const gcloudKey = await getAPIKey('gcloud', pb)

    const eventData = await EventsService.scanImage(pb, file.path, gcloudKey)

    if (!eventData) {
      throw new Error('Failed to scan image')
    }

    return eventData
  })

const addException = forgeController
  .route('DELETE /exception/:id')
  .description('Add an exception to a recurring event')
  .schema(CalendarControllersSchemas.Events.addException)
  .existenceCheck('params', {
    id: 'calendar__events'
  })
  .callback(
    async ({ pb, params: { id }, query: { date } }) =>
      await EventsService.addException(pb, id, date)
  )

const updateEvent = forgeController
  .route('PATCH /:id')
  .description('Update an existing event')
  .schema(CalendarControllersSchemas.Events.updateEvent)
  .existenceCheck('params', {
    id: 'calendar__events'
  })
  .existenceCheck('body', {
    calendar: '[calendar__calendars]',
    category: 'calendar__categories'
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await EventsService.updateEvent(
        pb,
        id.split('-')[0],
        body as CalendarControllersSchemas.IEvents['updateEvent']['body']
      )
  )

const deleteEvent = forgeController
  .route('DELETE /:id')
  .description('Delete an existing event')
  .schema(CalendarControllersSchemas.Events.deleteEvent)
  .existenceCheck('params', {
    id: 'calendar__events'
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await EventsService.deleteEvent(pb, id)
  )

export default forgeRouter({
  getEventsByDateRange,
  getEventsToday,
  getEventById,
  createEvent,
  addException,
  updateEvent,
  deleteEvent,
  scanImage
})
