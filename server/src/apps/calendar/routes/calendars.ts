import { forgeController, forgeRouter } from '@functions/routes'
import { z } from 'zod/v4'

import { SCHEMAS } from '../../../core/schema'

const getAllCalendars = forgeController.query
  .description('Get all calendars')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList.collection('calendar__calendars').sort(['name']).execute()
  )

const getCalendarById = forgeController.query
  .description('Get a calendar by ID')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'calendar__calendars'
  })
  .callback(({ pb, query: { id } }) =>
    pb.getOne.collection('calendar__calendars').id(id).execute()
  )

const createCalendar = forgeController.mutation
  .description('Create a new calendar')
  .input({
    body: SCHEMAS.calendar.calendars
  })
  .statusCode(201)
  .callback(async ({ pb, body }) =>
    pb.create.collection('calendar__calendars').data(body).execute()
  )

const updateCalendar = forgeController.mutation
  .description('Update an existing calendar')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.calendar.calendars
  })
  .existenceCheck('query', {
    id: 'calendar__calendars'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('calendar__calendars').id(id).data(body).execute()
  )

const deleteCalendar = forgeController.mutation
  .description('Delete an existing calendar')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'calendar__calendars'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('calendar__calendars').id(id).execute()
  )

export default forgeRouter({
  getAllCalendars,
  getCalendarById,
  createCalendar,
  updateCalendar,
  deleteCalendar
})
