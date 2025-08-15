import parseOCR from '@functions/external/ocr'
import { forgeController, forgeRouter } from '@functions/routes'
import { Location } from '@lib/locations/typescript/location.types'
import { SCHEMAS } from '@schema'
import fs from 'fs'
import z from 'zod/v4'

import { convertPDFToImage, getTransactionDetails } from '../utils/transactions'

const list = forgeController.query
  .description('Get all wallet transactions')
  .input({})
  .callback(async ({ pb }) => {
    const incomeExpensesTransactions = await pb.getFullList
      .collection('wallet__transactions_income_expenses')
      .expand({
        base_transaction: 'wallet__transactions'
      })
      .execute()

    const transferTransactions = await pb.getFullList
      .collection('wallet__transactions_transfer')
      .expand({
        base_transaction: 'wallet__transactions'
      })
      .execute()

    const allTransactions = []

    for (const transaction of incomeExpensesTransactions) {
      const baseTransaction = transaction.expand!.base_transaction!

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
      const baseTransaction = transaction.expand!.base_transaction!

      allTransactions.push({
        ...baseTransaction,
        type: 'transfer' as const,
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

const CreateTransactionInputSchema = SCHEMAS.wallet.transactions
  .omit({
    type: true,
    receipt: true,
    created: true,
    updated: true
  })
  .and(
    z.union([
      SCHEMAS.wallet.transactions_income_expenses
        .omit({
          base_transaction: true,
          location_name: true,
          location_coords: true
        })
        .extend({
          location: Location.optional().nullable()
        }),
      SCHEMAS.wallet.transactions_transfer
        .omit({
          base_transaction: true
        })
        .extend({
          type: z.literal('transfer')
        })
    ])
  )

const create = forgeController.mutation
  .description('Create a new wallet transaction')
  .input({
    body: CreateTransactionInputSchema
  })
  .media({
    receipt: {
      optional: true
    }
  })
  .existenceCheck('body', {
    category: '[wallet__categories]',
    asset: '[wallet__assets]',
    ledger: '[wallet__ledgers]',
    fromAsset: '[wallet__assets]',
    toAsset: '[wallet__assets]'
  })
  .statusCode(201)
  .callback(async ({ pb, body, media: { receipt: rawReceipt } }) => {
    const data = body as z.infer<typeof CreateTransactionInputSchema>

    const receipt =
      rawReceipt && typeof rawReceipt !== 'string'
        ? rawReceipt.originalname.endsWith('.pdf')
          ? await convertPDFToImage(rawReceipt.path)
          : new File([fs.readFileSync(rawReceipt.path)], 'receipt.jpg', {
              type: rawReceipt.mimetype
            })
        : undefined

    const baseTransaction = await pb.create
      .collection('wallet__transactions')
      .data({
        type: data.type === 'transfer' ? 'transfer' : 'income_expenses',
        amount: data.amount,
        date: data.date,
        receipt
      })
      .execute()

    if (data.type === 'transfer') {
      await pb.create
        .collection('wallet__transactions_transfer')
        .data({
          from: data.from,
          to: data.to,
          base_transaction: baseTransaction.id
        })
        .execute()
    } else {
      await pb.create
        .collection('wallet__transactions_income_expenses')
        .data({
          base_transaction: baseTransaction.id,
          type: data.type,
          particulars: data.particulars,
          asset: data.asset,
          category: data.category,
          ledgers: data.ledgers,
          location_name: data.location?.name ?? '',
          location_coords: {
            lon: data.location?.location.longitude ?? 0,
            lat: data.location?.location.latitude ?? 0
          }
        })
        .execute()
    }
  })

const update = forgeController.mutation
  .description('Update an existing wallet transaction')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: CreateTransactionInputSchema
  })
  .media({
    receipt: {
      optional: true
    }
  })
  .existenceCheck('query', {
    id: 'wallet__transactions'
  })
  .existenceCheck('body', {
    category: '[wallet__categories]',
    asset: '[wallet__assets]',
    from: '[wallet__assets]',
    to: '[wallet__assets]',
    ledger: '[wallet__ledgers]'
  })
  .callback(
    async ({ pb, query: { id }, body, media: { receipt: rawReceipt } }) => {
      const data = body as z.infer<typeof CreateTransactionInputSchema>

      const receipt =
        rawReceipt && typeof rawReceipt !== 'string'
          ? rawReceipt.originalname.endsWith('.pdf')
            ? await convertPDFToImage(rawReceipt.path)
            : new File([fs.readFileSync(rawReceipt.path)], 'receipt.jpg', {
                type: rawReceipt.mimetype
              })
          : undefined

      const baseTransaction = await pb.update
        .collection('wallet__transactions')
        .id(id)
        .data({
          type: data.type === 'transfer' ? 'transfer' : 'income_expenses',
          amount: data.amount,
          date: data.date,
          ...(rawReceipt !== 'keep' && {
            receipt: rawReceipt === 'removed' ? null : receipt
          })
        })
        .execute()

      if (data.type === 'transfer') {
        const target = await pb.getFirstListItem
          .collection('wallet__transactions_transfer')
          .filter([
            {
              field: 'base_transaction',
              operator: '=',
              value: id
            }
          ])
          .execute()

        await pb.update
          .collection('wallet__transactions_transfer')
          .id(target.id)
          .data({
            from: data.from,
            to: data.to,
            base_transaction: baseTransaction.id
          })
          .execute()
      } else {
        const target = await pb.getFirstListItem
          .collection('wallet__transactions_income_expenses')
          .filter([
            {
              field: 'base_transaction',
              operator: '=',
              value: id
            }
          ])
          .execute()

        await pb.update
          .collection('wallet__transactions_income_expenses')
          .id(target.id)
          .data({
            type: data.type,
            particulars: data.particulars,
            asset: data.asset,
            category: data.category,
            ledgers: data.ledgers,
            location_name: data.location?.name ?? '',
            location_coords: {
              lon: data.location?.location.longitude ?? 0,
              lat: data.location?.location.latitude ?? 0
            }
          })
          .execute()
      }
    }
  )

const remove = forgeController.mutation
  .description('Delete a wallet transaction')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'wallet__transactions'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('wallet__transactions').id(id).execute()
  )

const scanReceipt = forgeController.mutation
  .description('Scan receipt to extract transaction data')
  .input({})
  .media({
    file: {
      optional: false
    }
  })
  .callback(async ({ pb, media: { file } }) => {
    if (!file || typeof file === 'string') {
      throw new Error('No file uploaded')
    }

    if (file.originalname.endsWith('.pdf')) {
      const image = await convertPDFToImage(file.path)

      if (!image) {
        throw new Error('Failed to convert PDF to image')
      }

      const buffer = await image.arrayBuffer()

      fs.writeFileSync('medium/receipt.png', Buffer.from(buffer))
    } else {
      fs.renameSync(file.path, 'medium/receipt.png')
    }

    if (!fs.existsSync('medium/receipt.png')) {
      throw new Error('Receipt image not found')
    }

    const OCRResult = await parseOCR('medium/receipt.png')

    if (!OCRResult) {
      throw new Error('OCR parsing failed')
    }

    fs.unlinkSync('medium/receipt.png')

    return await getTransactionDetails(OCRResult, pb)
  })

export default forgeRouter({
  list,
  create,
  update,
  remove,
  scanReceipt
})
