import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { MoviesControllersSchemas } from 'shared/types/controllers'

import * as TicketService from '../services/ticket.service'

const moviesTicketRouter = express.Router()

const updateTicket = forgeController
  .route('POST /')
  .description('Update ticket information for a movie entry')
  .schema(MoviesControllersSchemas.Ticket.updateTicket)
  .existenceCheck('body', {
    entry_id: 'movies__entries'
  })
  .callback(({ pb, body }) => TicketService.updateTicket(pb, body))

const updateTicketPatch = forgeController
  .route('PATCH /:id')
  .description('Update ticket information for a movie entry (PATCH)')
  .schema(MoviesControllersSchemas.Ticket.updateTicketPatch)
  .existenceCheck('params', {
    id: 'movies__entries'
  })
  .callback(({ pb, params: { id }, body }) =>
    TicketService.updateTicket(pb, {
      ...body,
      entry_id: id
    })
  )

const clearTicket = forgeController
  .route('DELETE /:id')
  .description('Clear ticket information for a movie entry')
  .schema(MoviesControllersSchemas.Ticket.clearTicket)
  .existenceCheck('params', {
    id: 'movies__entries'
  })
  .callback(({ pb, params: { id } }) => TicketService.clearTicket(pb, id))
  .statusCode(204)

bulkRegisterControllers(moviesTicketRouter, [
  updateTicket,
  updateTicketPatch,
  clearTicket
])

export default moviesTicketRouter
