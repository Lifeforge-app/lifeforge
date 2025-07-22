import { forgeController } from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { z } from 'zod/v4'

import {
  CalendarCollectionsSchemas,
  ISchemaWithPB
} from 'shared/types/collections'

const getAllCalendars = forgeController
  .route('GET /')
  .description('Get all calendars')
  .input({})
  .callback(({ pb }) =>
    pb
      .collection('calendar__calendars')
      .getFullList<ISchemaWithPB<CalendarCollectionsSchemas.ICalendar>>({
        sort: '+name'
      })
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
    pb
      .collection('calendar__calendars')
      .getOne<ISchemaWithPB<CalendarCollectionsSchemas.ICalendar>>(id)
  )

const createCalendar = forgeController
  .route('POST /')
  .description('Create a new calendar')
  .input({
    body: CalendarCollectionsSchemas.Calendar
  })
  .statusCode(201)
  .callback(async ({ pb, body }) =>
    pb
      .collection('calendar__calendars')
      .create<ISchemaWithPB<CalendarCollectionsSchemas.ICalendar>>(body)
  )

const updateCalendar = forgeController
  .route('PATCH /:id')
  .description('Update an existing calendar')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: CalendarCollectionsSchemas.Calendar
  })
  .existenceCheck('params', {
    id: 'calendar__calendars'
  })
  .callback(({ pb, params: { id }, body }) =>
    pb
      .collection('calendar__calendars')
      .update<ISchemaWithPB<CalendarCollectionsSchemas.ICalendar>>(id, body)
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
    pb.collection('calendar__calendars').delete(id)
  )

export default forgeRouter({
  getAllCalendars,
  getCalendarById,
  createCalendar,
  updateCalendar,
  deleteCalendar
})
