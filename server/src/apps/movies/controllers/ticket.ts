import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import * as TicketService from '../services/ticket.service'

const updateTicket = forgeController
  .route('PATCH /:id')
  .description('Update ticket information for a movie entry')
  .input({})
  .existenceCheck('params', {
    id: 'movies__entries'
  })
  .callback(({ pb, params: { id }, body }) =>
    TicketService.updateTicket(pb, id, body)
  )

const clearTicket = forgeController
  .route('DELETE /:id')
  .description('Clear ticket information for a movie entry')
  .input({})
  .existenceCheck('params', {
    id: 'movies__entries'
  })
  .callback(({ pb, params: { id } }) => TicketService.clearTicket(pb, id))
  .statusCode(204)

export default forgeRouter({ updateTicket, clearTicket })
