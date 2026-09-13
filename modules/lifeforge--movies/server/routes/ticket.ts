import dayjs from 'dayjs'
import z from 'zod'

import { LocationSchema } from '@lifeforge/server-utils'

import forge from '../forge'
import moviesSchemas from '../schema'

export const update = forge
  .mutation({
    description: 'Update ticket information for a movie entry',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: moviesSchemas.entries
        .pick({
          ticket_number: true,
          theatre_number: true,
          theatre_seat: true
        })
        .extend({
          theatre_showtime: z.string().optional(),
          theatre_location: LocationSchema.optional()
        })
    },
    existenceCheck: {
      query: { id: 'entries' }
    },
    output: {
      OK: moviesSchemas.entries,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) => {
    const finalData = {
      ...body,
      theatre_showtime: dayjs(body.theatre_showtime),
      theatre_location: body.theatre_location?.name,
      theatre_location_coords: {
        lat: body.theatre_location?.location.latitude || 0,
        lon: body.theatre_location?.location.longitude || 0
      }
    }

    return response.ok(
      await pb.update.collection('entries').id(id).data(finalData).execute()
    )
  })

export const clear = forge
  .mutation({
    description: 'Clear ticket information for a movie entry',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'entries' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.update
      .collection('entries')
      .id(id)
      .data({
        ticket_number: '',
        theatre_location: '',
        theatre_number: '',
        theatre_seat: '',
        theatre_showtime: ''
      })
      .execute()

    return response.noContent()
  })
