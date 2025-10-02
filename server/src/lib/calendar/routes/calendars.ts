import { forgeController, forgeRouter } from '@functions/routes'
import ical from 'node-ical'
import { z } from 'zod'

import { SCHEMAS } from '../../../core/schema'
import { ICalSyncService } from '../functions/icalSyncing'

const list = forgeController
  .query()
  .description('Get all calendars')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('calendar__calendars')
      .sort(['link', 'name'])
      .execute()
  )

const getById = forgeController
  .query()
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

const create = forgeController
  .mutation()
  .description('Create a new calendar')
  .input({
    body: SCHEMAS.calendar.calendars.schema
      .pick({
        name: true,
        color: true
      })
      .extend({
        icsUrl: z.url().optional()
      })
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => {
    const newCalendar = await pb.create
      .collection('calendar__calendars')
      .data({
        name: body.name,
        color: body.color,
        link: body.icsUrl ? body.icsUrl : null
      })
      .execute()

    if (body.icsUrl) {
      const icalService = new ICalSyncService(pb)

      await icalService
        .syncCalendar(newCalendar.id, body.icsUrl)
        .catch(console.error)
    }

    return newCalendar
  })

const update = forgeController
  .mutation()
  .description('Update an existing calendar')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.calendar.calendars.schema.pick({
      name: true,
      color: true
    })
  })
  .existenceCheck('query', {
    id: 'calendar__calendars'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('calendar__calendars').id(id).data(body).execute()
  )

const remove = forgeController
  .mutation()
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

const validateICS = forgeController
  .mutation()
  .description('Validate an ICS URL')
  .input({
    body: z.object({
      icsUrl: z.url()
    })
  })
  .callback(async ({ body: { icsUrl } }) => {
    try {
      const response = await fetch(icsUrl).then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch ICS URL')
        }

        return res.text()
      })

      const parsed = ical.sync.parseICS(response)

      console.log(parsed)

      if (Object.keys(parsed).length === 0) {
        throw new Error('No events found in ICS file')
      }

      return true
    } catch {
      return false
    }
  })

export default forgeRouter({
  list,
  getById,
  create,
  update,
  remove,
  validateICS
})
