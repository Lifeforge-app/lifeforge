import dayjs from 'dayjs'
import fs from 'fs'
import z from 'zod'

import { LocationSchema } from '@lifeforge/server-utils'

import forge from '../forge'
import walletSchemas from '../schema'
import { getTransactionDetails } from '../utils/transactions'

const BaseFields = walletSchemas.transactions
  .omit({ receipt: true })
  .extend({ receipt: z.string().optional() })

const IncomeExpensesFields = walletSchemas.transactions_income_expenses.omit({
  base_transaction: true
})

const DbTransactionOutput = z.discriminatedUnion('type', [
  BaseFields.extend({
    type: z.literal('transfer'),
    from: z.string(),
    to: z.string()
  }),
  BaseFields.extend({
    type: z.literal('income_expenses')
  })
])

const EnrichedTransactionOutput = z.discriminatedUnion('type', [
  BaseFields.extend({
    type: z.literal('transfer'),
    from: z.string(),
    to: z.string()
  }),
  BaseFields.merge(IncomeExpensesFields).extend({
    type: z.literal('income')
  }),
  BaseFields.merge(IncomeExpensesFields).extend({
    type: z.literal('expenses')
  })
])

const MutateTransactionInputSchema = walletSchemas.transactions
  .omit({
    type: true,
    receipt: true,
    created: true,
    updated: true,
    id: true,
    collectionId: true,
    collectionName: true
  })
  .and(
    z.union([
      walletSchemas.transactions_income_expenses
        .omit({
          base_transaction: true,
          location_name: true,
          location_coords: true,
          id: true,
          collectionId: true,
          collectionName: true
        })
        .extend({
          location: LocationSchema.optional().nullable()
        }),
      walletSchemas.transactions_transfer
        .omit({
          base_transaction: true,
          id: true,
          collectionId: true,
          collectionName: true
        })
        .extend({
          type: z.literal('transfer')
        })
    ])
  )

export const list = forge
  .query({
    description: 'Get all wallet transactions',
    input: {
      query: z.object({
        q: z.string().optional(),
        type: z.enum(['income', 'expenses', 'transfer']).optional(),
        year: z.string().optional(),
        month: z.string().optional()
      })
    },
    output: {
      OK: z.array(EnrichedTransactionOutput)
    }
  })
  .callback(async ({ pb, query: { q, type, year, month }, response }) => {
    const parsedYear = year ? parseInt(year) : undefined

    const parsedMonth = month ? parseInt(month) : undefined

    const dateFilters =
      parsedYear !== undefined && parsedMonth !== undefined
        ? ([
            {
              field: 'base_transaction.date' as const,
              operator: '>=' as const,
              value: dayjs()
                .year(parsedYear)
                .month(parsedMonth - 1)
                .startOf('month')
                .format('YYYY-MM-DD')
            },
            {
              field: 'base_transaction.date' as const,
              operator: '<=' as const,
              value: dayjs()
                .year(parsedYear)
                .month(parsedMonth - 1)
                .endOf('month')
                .format('YYYY-MM-DD')
            }
          ] as const)
        : []

    const incomeExpensesTransactions = await pb.getFullList
      .collection('transactions_income_expenses')
      .expand({ base_transaction: 'transactions' })
      .filter([
        q
          ? { field: 'particulars' as const, operator: '~' as const, value: q }
          : null,
        ...dateFilters
      ])
      .execute()

    const transferTransactions = await pb.getFullList
      .collection('transactions_transfer')
      .expand({ base_transaction: 'transactions' })
      .filter([...dateFilters])
      .execute()

    const allTransactions: z.infer<typeof EnrichedTransactionOutput>[] = []

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

    return response.ok(
      allTransactions
        .filter(transaction => !type || transaction.type === type)
        .sort((a, b) => {
          const aDate = new Date(a.date).getTime()

          const bDate = new Date(b.date).getTime()

          if (aDate === bDate) {
            return new Date(b.created).getTime() - new Date(a.created).getTime()
          }

          return bDate - aDate
        })
    )
  })

export const getById = forge
  .query({
    description: 'Get wallet transaction by ID',
    input: {
      query: z.object({ id: z.string() })
    },
    existenceCheck: {
      query: { id: 'transactions' }
    },
    output: {
      OK: EnrichedTransactionOutput,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    const baseTransaction = await pb.getOne
      .collection('transactions')
      .id(id)
      .execute()

    if (baseTransaction.type === 'transfer') {
      const transferTransaction = await pb.getFirstListItem
        .collection('transactions_transfer')
        .filter([{ field: 'base_transaction', operator: '=', value: id }])
        .execute()

      return response.ok({
        ...baseTransaction,
        type: 'transfer' as const,
        from: transferTransaction.from,
        to: transferTransaction.to
      })
    } else {
      const incomeExpensesTransaction = await pb.getFirstListItem
        .collection('transactions_income_expenses')
        .filter([{ field: 'base_transaction', operator: '=', value: id }])
        .execute()

      return response.ok({
        ...baseTransaction,
        type: incomeExpensesTransaction.type,
        particulars: incomeExpensesTransaction.particulars,
        asset: incomeExpensesTransaction.asset,
        category: incomeExpensesTransaction.category,
        ledgers: incomeExpensesTransaction.ledgers,
        location_name: incomeExpensesTransaction.location_name,
        location_coords: incomeExpensesTransaction.location_coords
      })
    }
  })

export const create = forge
  .mutation({
    description: 'Create a new transaction with receipt',
    input: {
      body: MutateTransactionInputSchema
    },
    media: {
      receipt: {
        optional: true
      }
    },
    existenceCheck: {
      body: {
        category: '[categories]',
        asset: '[assets]',
        ledgers: '[ledgers]',
        from: '[assets]',
        to: '[assets]'
      }
    },
    output: {
      CREATED: DbTransactionOutput,
      NOT_FOUND: true
    }
  })
  .callback(
    async ({
      pb,
      body,
      media: { receipt: rawReceipt },
      core: {
        media: { convertPDFToImage }
      },
      response
    }) => {
      const data = body as z.infer<typeof MutateTransactionInputSchema>

      const receipt =
        rawReceipt && typeof rawReceipt !== 'string'
          ? rawReceipt.originalname.endsWith('.pdf')
            ? await convertPDFToImage(rawReceipt.path)
            : new File([fs.readFileSync(rawReceipt.path)], 'receipt.jpg', {
                type: rawReceipt.mimetype
              })
          : undefined

      const baseTransaction = await pb.create
        .collection('transactions')
        .data({
          type: data.type === 'transfer' ? 'transfer' : 'income_expenses',
          amount: data.amount,
          date: data.date,
          receipt
        })
        .execute()

      if (data.type === 'transfer') {
        await pb.create
          .collection('transactions_transfer')
          .data({
            from: data.from,
            to: data.to,
            base_transaction: baseTransaction.id
          })
          .execute()
      } else {
        await pb.create
          .collection('transactions_income_expenses')
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

      return response.created(
        baseTransaction as z.infer<typeof DbTransactionOutput>
      )
    }
  )

export const update = forge
  .mutation({
    description: 'Update transaction details',
    input: {
      query: z.object({ id: z.string() }),
      body: MutateTransactionInputSchema
    },
    media: {
      receipt: {
        optional: true
      }
    },
    existenceCheck: {
      query: { id: 'transactions' },
      body: {
        category: '[categories]',
        asset: '[assets]',
        from: '[assets]',
        to: '[assets]',
        ledgers: '[ledgers]'
      }
    },
    output: {
      OK: DbTransactionOutput,
      NOT_FOUND: true
    }
  })
  .callback(
    async ({
      pb,
      query: { id },
      body,
      media: { receipt: rawReceipt },
      core: {
        media: { convertPDFToImage }
      },
      response
    }) => {
      const data = body as z.infer<typeof MutateTransactionInputSchema>

      const receipt =
        rawReceipt && typeof rawReceipt !== 'string'
          ? rawReceipt.originalname.endsWith('.pdf')
            ? await convertPDFToImage(rawReceipt.path)
            : new File([fs.readFileSync(rawReceipt.path)], 'receipt.jpg', {
                type: rawReceipt.mimetype
              })
          : undefined

      const baseTransaction = await pb.update
        .collection('transactions')
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
          .collection('transactions_transfer')
          .filter([{ field: 'base_transaction', operator: '=', value: id }])
          .execute()

        await pb.update
          .collection('transactions_transfer')
          .id(target.id)
          .data({
            from: data.from,
            to: data.to,
            base_transaction: baseTransaction.id
          })
          .execute()
      } else {
        const target = await pb.getFirstListItem
          .collection('transactions_income_expenses')
          .filter([{ field: 'base_transaction', operator: '=', value: id }])
          .execute()

        await pb.update
          .collection('transactions_income_expenses')
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

      return response.ok(baseTransaction as z.infer<typeof DbTransactionOutput>)
    }
  )

export const remove = forge
  .mutation({
    description: 'Delete a transaction',
    input: {
      query: z.object({ id: z.string() })
    },
    existenceCheck: {
      query: { id: 'transactions' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('transactions').id(id).execute()

    return response.noContent()
  })

export const scanReceipt = forge
  .mutation({
    description: 'Extract transaction data from receipt using OCR',
    input: {},
    media: {
      file: {
        optional: false
      }
    },
    output: {
      OK: z.object({
        date: z.string(),
        amount: z.number(),
        type: z.enum(['income', 'expenses']),
        category: z.string(),
        particulars: z.string(),
        location_coords: z.object({
          lon: z.number(),
          lat: z.number()
        }),
        location_name: z.string()
      }),
      BAD_REQUEST: z.string()
    }
  })
  .callback(
    async ({
      pb,
      media: { file },
      core: {
        media: { convertPDFToImage, parseOCR },
        api: { fetchAI, getAPIKey, searchLocations }
      },
      response
    }) => {
      if (!file || typeof file === 'string') {
        return response.badRequest('No file uploaded')
      }

      if (file.originalname.endsWith('.pdf')) {
        const image = await convertPDFToImage(file.path)

        if (!image) {
          return response.badRequest('Failed to convert PDF to image')
        }

        const buffer = await image.arrayBuffer()

        fs.writeFileSync('medium/receipt.png', Buffer.from(buffer))
      } else {
        fs.renameSync(file.path, 'medium/receipt.png')
      }

      if (!fs.existsSync('medium/receipt.png')) {
        return response.badRequest('Receipt image not found')
      }

      const OCRResult = await parseOCR('medium/receipt.png')

      if (!OCRResult) {
        return response.badRequest('OCR parsing failed')
      }

      fs.unlinkSync('medium/receipt.png')

      return response.ok(
        await getTransactionDetails(
          OCRResult,
          pb,
          fetchAI,
          getAPIKey,
          searchLocations
        )
      )
    }
  )

export const createMultiple = forge
  .mutation({
    description: 'Create multiple new transactions',
    input: {
      body: z.object({
        transactions: z.array(MutateTransactionInputSchema)
      })
    },
    output: {
      CREATED: z.null()
    }
  })
  .callback(async ({ pb, body: { transactions }, response }) => {
    const results = []

    for (const data of transactions) {
      const baseTransaction = await pb.create
        .collection('transactions')
        .data({
          type: data.type === 'transfer' ? 'transfer' : 'income_expenses',
          amount: data.amount,
          date: data.date
        })
        .execute()

      if (data.type === 'transfer') {
        await pb.create
          .collection('transactions_transfer')
          .data({
            from: data.from,
            to: data.to,
            base_transaction: baseTransaction.id
          })
          .execute()
      } else {
        await pb.create
          .collection('transactions_income_expenses')
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

      results.push(baseTransaction)
    }

    return response.created(null)
  })
