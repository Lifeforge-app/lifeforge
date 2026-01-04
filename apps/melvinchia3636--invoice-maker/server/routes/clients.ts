import { SCHEMAS } from '@schema'
import z from 'zod'

import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'

const list = forgeController
  .query()
  .description('List all clients')
  .input({})
  .callback(async ({ pb }) =>
    pb.getFullList
      .collection('melvinchia3636$invoice_maker__clients')
      .sort(['-created'])
      .execute()
  )

const getById = forgeController
  .query()
  .description('Get client by ID')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'melvinchia3636$invoice_maker__clients'
  })
  .callback(({ pb, query: { id } }) =>
    pb.getOne
      .collection('melvinchia3636$invoice_maker__clients')
      .id(id)
      .execute()
  )

const create = forgeController
  .mutation()
  .description('Create a new client')
  .input({
    body: SCHEMAS.melvinchia3636$invoice_maker.clients.schema.omit({
      created: true,
      updated: true
    })
  })
  .statusCode(201)
  .callback(async ({ pb, body }) =>
    pb.create
      .collection('melvinchia3636$invoice_maker__clients')
      .data(body)
      .execute()
  )

const update = forgeController
  .mutation()
  .description('Update an existing client')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.melvinchia3636$invoice_maker.clients.schema.partial().omit({
      created: true,
      updated: true
    })
  })
  .existenceCheck('query', {
    id: 'melvinchia3636$invoice_maker__clients'
  })
  .callback(async ({ pb, query: { id }, body }) =>
    pb.update
      .collection('melvinchia3636$invoice_maker__clients')
      .id(id)
      .data(body)
      .execute()
  )

const remove = forgeController
  .mutation()
  .description('Delete a client')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'melvinchia3636$invoice_maker__clients'
  })
  .statusCode(204)
  .callback(async ({ pb, query: { id } }) => {
    // Check if client has any invoices
    const invoices = await pb.getFullList
      .collection('melvinchia3636$invoice_maker__invoices')
      .filter([{ field: 'bill_to', operator: '=', value: id }])
      .execute()

    if (invoices.length > 0) {
      throw new ClientError(
        'Cannot delete client with existing invoices. Delete the invoices first.'
      )
    }

    return pb.delete
      .collection('melvinchia3636$invoice_maker__clients')
      .id(id)
      .execute()
  })

export default forgeRouter({ list, getById, create, update, remove })
