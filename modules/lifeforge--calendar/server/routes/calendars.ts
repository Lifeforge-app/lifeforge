import ical from 'node-ical'
import z from 'zod'

import forge from '../forge'
import { ICalSyncService } from '../functions/icalSyncing'
import calendarSchemas from '../schema'

export const list = forge
  .query({
    description: 'Get all calendars',
    output: {
      OK: z.array(calendarSchemas.calendars)
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      await pb.getFullList
        .collection('calendars')
        .sort(['link', 'name'])
        .execute()
    )
  )

export const getById = forge
  .query({
    description: 'Get a specific calendar by ID',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'calendars' }
    },
    output: {
      OK: calendarSchemas.calendars,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) =>
    response.ok(await pb.getOne.collection('calendars').id(id).execute())
  )

export const create = forge
  .mutation({
    description: 'Create a new calendar with optional ICS sync',
    input: {
      body: calendarSchemas.calendars
        .pick({
          name: true,
          color: true
        })
        .extend({
          icsUrl: z.url().optional()
        })
    },
    output: {
      CREATED: calendarSchemas.calendars
    }
  })
  .callback(async ({ pb, body, response }) => {
    const newCalendar = await pb.create
      .collection('calendars')
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

    return response.created(newCalendar)
  })

export const update = forge
  .mutation({
    description: 'Update calendar name and color',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: calendarSchemas.calendars.pick({
        name: true,
        color: true
      })
    },
    existenceCheck: {
      query: { id: 'calendars' }
    },
    output: {
      OK: calendarSchemas.calendars,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) =>
    response.ok(
      await pb.update.collection('calendars').id(id).data(body).execute()
    )
  )

export const remove = forge
  .mutation({
    description: 'Delete a calendar',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'calendars' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.getOne.collection('calendars').id(id).execute()

    return response.noContent()
  })

export const validateICS = forge
  .mutation({
    description: 'Validate if an ICS URL is accessible',
    input: {
      body: z.object({
        icsUrl: z.url()
      })
    },
    output: {
      OK: z.boolean()
    }
  })
  .callback(async ({ body: { icsUrl }, response }) => {
    try {
      const res = await fetch(icsUrl)

      if (!res.ok) {
        return response.ok(false)
      }

      const text = await res.text()

      const parsed = ical.sync.parseICS(text)

      if (Object.keys(parsed).length === 0) {
        return response.ok(false)
      }

      return response.ok(true)
    } catch {
      return response.ok(false)
    }
  })
