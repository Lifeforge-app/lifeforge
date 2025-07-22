import { forgeController } from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import {
  singleUploadMiddleware,
  singleUploadMiddlewareOfKey
} from '@middlewares/uploadMiddleware'
import { z } from 'zod/v4'

import {
  ISchemaWithPB,
  LocationsCustomSchemas,
  WalletCollectionsSchemas
} from 'shared/types/collections'

import * as TransactionsService from '../services/transactions.service'

const getAllTransactions = forgeController
  .route('GET /')
  .description('Get all wallet transactions')
  .input({})
  .callback(async ({ pb }) => {
    const incomeExpensesTransactions = await pb
      .collection('wallet__transactions_income_expenses')
      .getFullList<
        ISchemaWithPB<WalletCollectionsSchemas.ITransactionsIncomeExpense> & {
          expand: {
            base_transaction: ISchemaWithPB<WalletCollectionsSchemas.ITransaction>
          }
        }
      >({
        expand: 'base_transaction'
      })

    const transferTransactions = await pb
      .collection('wallet__transactions_transfer')
      .getFullList<
        ISchemaWithPB<WalletCollectionsSchemas.ITransactionsTransfer> & {
          expand: {
            base_transaction: ISchemaWithPB<WalletCollectionsSchemas.ITransaction>
          }
        }
      >({
        expand: 'base_transaction'
      })

    const allTransactions = []

    for (const transaction of incomeExpensesTransactions) {
      const baseTransaction = transaction.expand.base_transaction

      allTransactions.push({
        ...baseTransaction,
        type: transaction.type,
        particulars: transaction.particulars,
        asset: transaction.asset,
        category: transaction.category,
        ledgers: transaction.ledgers,
        location_name: transaction.location_name,
        location_coords: transaction.location_coords
      })
    }

    for (const transaction of transferTransactions) {
      const baseTransaction = transaction.expand.base_transaction

      allTransactions.push({
        ...baseTransaction,
        type: 'transfer',
        from: transaction.from,
        to: transaction.to
      })
    }

    return allTransactions.sort((a, b) => {
      if (new Date(a.date).getTime() === new Date(b.date).getTime()) {
        return new Date(a.created).getTime() - new Date(b.created).getTime()
      }

      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  })

const createTransaction = forgeController
  .route('POST /')
  .description('Create a new wallet transaction')
  .input({
    body: WalletCollectionsSchemas.Transaction.omit({
      type: true,
      receipt: true,
      amount: true
    })
      .extend({
        amount: z
          .string()
          .transform(val => {
            const amount = parseFloat(val)

            return isNaN(amount) ? 0 : amount
          })
          .or(z.number())
      })
      .and(
        z.union([
          WalletCollectionsSchemas.TransactionsIncomeExpense.omit({
            base_transaction: true,
            location_name: true,
            location_coords: true
          }).extend({
            location: LocationsCustomSchemas.Location.optional().nullable(),
            amount: z.string().transform(val => {
              const amount = parseFloat(val)

              return isNaN(amount) ? 0 : amount
            })
          }),
          WalletCollectionsSchemas.TransactionsTransfer.omit({
            base_transaction: true
          }).extend({
            type: z.literal('transfer')
          })
        ])
      )
  })
  .middlewares(singleUploadMiddleware)
  .existenceCheck('body', {
    category: '[wallet__categories]',
    asset: '[wallet__assets]',
    ledger: '[wallet__ledgers]',
    fromAsset: '[wallet__assets]',
    toAsset: '[wallet__assets]'
  })
  .statusCode(201)
  .callback(({ pb, body, req }) =>
    TransactionsService.createTransaction(pb, body, req.file)
  )

const updateTransaction = forgeController
  .route('PATCH /:id')
  .description('Update an existing wallet transaction')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: WalletCollectionsSchemas.Transaction.omit({
      type: true,
      receipt: true,
      amount: true
    })
      .extend({
        amount: z
          .string()
          .transform(val => {
            const amount = parseFloat(val)

            return isNaN(amount) ? 0 : amount
          })
          .or(z.number())
      })
      .and(
        z.union([
          WalletCollectionsSchemas.TransactionsIncomeExpense.omit({
            base_transaction: true,
            location_name: true,
            location_coords: true
          }).extend({
            location: LocationsCustomSchemas.Location.optional().nullable(),
            amount: z.string().transform(val => {
              const amount = parseFloat(val)

              return isNaN(amount) ? 0 : amount
            })
          }),
          WalletCollectionsSchemas.TransactionsTransfer.omit({
            base_transaction: true
          }).extend({
            type: z.literal('transfer')
          })
        ])
      )
  })
  .middlewares(singleUploadMiddlewareOfKey('receipt'))
  .existenceCheck('params', {
    id: 'wallet__transactions'
  })
  .existenceCheck('body', {
    category: '[wallet__categories]',
    asset: '[wallet__assets]',
    from: '[wallet__assets]',
    to: '[wallet__assets]',
    ledger: '[wallet__ledgers]'
  })
  .callback(({ pb, params: { id }, body, req }) =>
    TransactionsService.updateTransaction(pb, id, body, req.file)
  )

const deleteTransaction = forgeController
  .route('DELETE /:id')
  .description('Delete a wallet transaction')
  .input({})
  .existenceCheck('params', {
    id: 'wallet__transactions'
  })
  .statusCode(204)
  .callback(async ({ pb, params: { id } }) =>
    TransactionsService.deleteTransaction(pb, id)
  )

const scanReceipt = forgeController
  .route('POST /scan-receipt')
  .description('Scan receipt to extract transaction data')
  .input({})
  .middlewares(singleUploadMiddleware)
  .callback(async ({ pb, req }) => {
    if (!req.file) {
      throw new Error('No file uploaded')
    }

    return await TransactionsService.scanReceipt(pb, req.file)
  })

export default forgeRouter({
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  scanReceipt
})
