import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { MoviesControllersSchemas } from 'shared/types/controllers'

import * as TicketService from '../services/ticket.service'

const moviesTicketRouter = express.Router()

const updateTicket = forgeController
  .route('POST /:id')
  .description('Update ticket information for a movie entry')
  .schema(MoviesControllersSchemas.Ticket.updateTicket)
  .existenceCheck('params', {
    id: 'movies__entries'
  })
  .callback(({ pb, params: { id }, body }) =>
    TicketService.updateTicket(pb, id, body)
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

bulkRegisterControllers(moviesTicketRouter, [updateTicket, clearTicket])

export default moviesTicketRouter
