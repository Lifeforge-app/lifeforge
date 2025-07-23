import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import { Location } from '@typescript/location.types'
import { z } from 'zod/v4'

const updateTicket = forgeController
  .route('PATCH /:id')
  .description('Update ticket information for a movie entry')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: SCHEMAS.movies.entries
      .pick({
        ticket_number: true,
        theatre_number: true,
        theatre_seat: true,
        theatre_showtime: true
      })
      .extend({
        theatre_location: Location.optional()
      })
  })
  .existenceCheck('params', {
    id: 'movies__entries'
  })
  .callback(({ pb, params: { id }, body }) => {
    const finalData = {
      ...body,
      theatre_location: body.theatre_location?.name,
      theatre_location_coords: {
        lat: body.theatre_location?.location.latitude || 0,
        lon: body.theatre_location?.location.longitude || 0
      }
    }

    return pb.update
      .collection('movies__entries')
      .id(id)
      .data(finalData)
      .execute()
  })

const clearTicket = forgeController
  .route('DELETE /:id')
  .description('Clear ticket information for a movie entry')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'movies__entries'
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) =>
    pb.update
      .collection('movies__entries')
      .id(id)
      .data({
        ticket_number: '',
        theatre_location: '',
        theatre_number: '',
        theatre_seat: '',
        theatre_showtime: ''
      })
      .execute()
  )

export default forgeRouter({ updateTicket, clearTicket })
