import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import { z } from 'zod/v4'

const getAllLedgers = forgeController
  .route('GET /')
  .description('Get all wallet ledgers')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('wallet__ledgers_aggregated')
      .sort(['name'])
      .execute()
  )

const createLedger = forgeController
  .route('POST /')
  .description('Create a new wallet ledger')
  .input({
    body: SCHEMAS.wallet.ledgers
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('wallet__ledgers').data(body).execute()
  )

const updateLedger = forgeController
  .route('PATCH /:id')
  .description('Update an existing wallet ledger')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: SCHEMAS.wallet.ledgers
  })
  .existenceCheck('params', {
    id: 'wallet__ledgers'
  })
  .callback(({ pb, params: { id }, body }) =>
    pb.update.collection('wallet__ledgers').id(id).data(body).execute()
  )

const deleteLedger = forgeController
  .route('DELETE /:id')
  .description('Delete a wallet ledger')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'wallet__ledgers'
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) =>
    pb.delete.collection('wallet__ledgers').id(id).execute()
  )

export default forgeRouter({
  getAllLedgers,
  createLedger,
  updateLedger,
  deleteLedger
})
