import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import z from 'zod'

const list = forgeController
  .query()
  .description('Get all wallet ledgers')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('wallet__ledgers_aggregated')
      .sort(['name'])
      .execute()
  )

const create = forgeController
  .mutation()
  .description('Create a new wallet ledger')
  .input({
    body: SCHEMAS.wallet.ledgers.schema
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('wallet__ledgers').data(body).execute()
  )

const update = forgeController
  .mutation()
  .description('Update an existing wallet ledger')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.wallet.ledgers.schema
  })
  .existenceCheck('query', {
    id: 'wallet__ledgers'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('wallet__ledgers').id(id).data(body).execute()
  )

const remove = forgeController
  .mutation()
  .description('Delete a wallet ledger')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'wallet__ledgers'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('wallet__ledgers').id(id).execute()
  )

export default forgeRouter({
  list,
  create,
  update,
  remove
})
