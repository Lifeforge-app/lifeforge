import { forgeController } from '@functions/routes'
import { z } from 'zod/v4'

import { SCHEMAS } from '../../../core/schema'

const getAllCalendars = forgeController
  .route('GET /')
  .description('Get all calendars')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList.collection('calendar__calendars').sort(['name']).execute()
  )

const getCalendarById = forgeController
  .route('GET /:id')
  .description('Get a calendar by ID')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'calendar__calendars'
  })
  .callback(({ pb, params: { id } }) =>
    pb.getOne.collection('calendar__calendars').id(id).execute()
  )

const createCalendar = forgeController
  .route('POST /')
  .description('Create a new calendar')
  .input({
    body: SCHEMAS.calendar.calendars
  })
  .statusCode(201)
  .callback(async ({ pb, body }) =>
    pb.create.collection('calendar__calendars').data(body).execute()
  )

const updateCalendar = forgeController
  .route('PATCH /:id')
  .description('Update an existing calendar')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: SCHEMAS.calendar.calendars
  })
  .existenceCheck('params', {
    id: 'calendar__calendars'
  })
  .callback(({ pb, params: { id }, body }) =>
    pb.update.collection('calendar__calendars').id(id).data(body).execute()
  )

const deleteCalendar = forgeController
  .route('DELETE /:id')
  .description('Delete an existing calendar')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'calendar__calendars'
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) =>
    pb.delete.collection('calendar__calendars').id(id).execute()
  )

export default forgeRouter({
  getAllCalendars,
  getCalendarById,
  createCalendar,
  updateCalendar,
  deleteCalendar
})
