import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import { WalletControllersSchemas } from 'shared/types/controllers'

import * as LedgersService from '../services/ledgers.service'

const getAllLedgers = forgeController
  .route('GET /')
  .description('Get all wallet ledgers')
  .schema(WalletControllersSchemas.Ledgers.getAllLedgers)
  .callback(async ({ pb }) => await LedgersService.getAllLedgers(pb))

const createLedger = forgeController
  .route('POST /')
  .description('Create a new wallet ledger')
  .schema(WalletControllersSchemas.Ledgers.createLedger)
  .statusCode(201)
  .callback(async ({ pb, body }) => await LedgersService.createLedger(pb, body))

const updateLedger = forgeController
  .route('PATCH /:id')
  .description('Update an existing wallet ledger')
  .schema(WalletControllersSchemas.Ledgers.updateLedger)
  .existenceCheck('params', {
    id: 'wallet__ledgers'
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await LedgersService.updateLedger(pb, id, body)
  )

const deleteLedger = forgeController
  .route('DELETE /:id')
  .description('Delete a wallet ledger')
  .schema(WalletControllersSchemas.Ledgers.deleteLedger)
  .existenceCheck('params', {
    id: 'wallet__ledgers'
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await LedgersService.deleteLedger(pb, id)
  )

export default forgeRouter({
  getAllLedgers,
  createLedger,
  updateLedger,
  deleteLedger
})
