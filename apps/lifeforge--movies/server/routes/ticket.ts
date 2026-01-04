import { forgeController, forgeRouter } from '@functions/routes'
import { Location } from '@lib/locations/typescript/location.types'
import { SCHEMAS } from '@schema'
import z from 'zod'

const update = forgeController
  .mutation()
  .description({
    en: 'Update ticket information for a movie entry',
    ms: 'Kemas kini maklumat tiket untuk catatan filem',
    'zh-CN': '更新电影条目的票务信息',
    'zh-TW': '更新電影條目的票務資訊'
  })
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.movies.entries.schema
      .pick({
        ticket_number: true,
        theatre_number: true,
        theatre_seat: true
      })
      .extend({
        theatre_showtime: z.string().optional(),
        theatre_location: Location.optional()
      })
  })
  .existenceCheck('query', {
    id: 'movies__entries'
  })
  .callback(({ pb, query: { id }, body }) => {
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

const clear = forgeController
  .mutation()
  .description({
    en: 'Clear ticket information for a movie entry',
    ms: 'Kosongkan maklumat tiket untuk catatan filem',
    'zh-CN': '清除电影条目的票务信息',
    'zh-TW': '清除電影條目的票務資訊'
  })
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'movies__entries'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
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

export default forgeRouter({ update, clear })
