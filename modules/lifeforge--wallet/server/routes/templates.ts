import z from 'zod'

import { LocationSchema } from '@lifeforge/server-utils'

import forge from '../forge'
import walletSchemas from '../schema'

export const list = forge
  .query({
    description: 'Get all transaction templates',
    output: {
      OK: z.record(
        z.enum(['income', 'expenses']),
        z.array(walletSchemas.transaction_templates)
      )
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      (
        await pb.getFullList
          .collection('transaction_templates')
          .sort(['type', 'name'])
          .execute()
      ).reduce(
        (acc, template) => {
          const type = template.type as 'income' | 'expenses'

          if (!acc[type]) {
            acc[type] = []
          }
          acc[type].push(template)

          return acc
        },
        {
          income: [],
          expenses: []
        } as Record<
          'income' | 'expenses',
          z.infer<typeof walletSchemas.transaction_templates>[]
        >
      )
    )
  )

export const create = forge
  .mutation({
    description: 'Create a new transaction template',
    input: {
      body: walletSchemas.transaction_templates
        .omit({
          id: true,
          collectionId: true,
          collectionName: true,
          location_coords: true,
          location_name: true
        })
        .extend({
          location: LocationSchema.optional()
        })
    },
    existenceCheck: {
      body: {
        asset: 'assets',
        category: 'categories',
        ledgers: '[ledgers]'
      }
    },
    output: {
      CREATED: walletSchemas.transaction_templates,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, body, response }) =>
    response.created(
      await pb.create
        .collection('transaction_templates')
        .data({
          ...body,
          location_coords: {
            lon: body.location?.location.longitude || 0,
            lat: body.location?.location.latitude || 0
          },
          location_name: body.location?.name || ''
        })
        .execute()
    )
  )

export const update = forge
  .mutation({
    description: 'Update transaction template',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: walletSchemas.transaction_templates
        .omit({
          id: true,
          collectionId: true,
          collectionName: true,
          location_coords: true,
          location_name: true
        })
        .extend({
          location: LocationSchema.optional()
        })
    },
    existenceCheck: {
      query: {
        id: 'transaction_templates'
      },
      body: {
        asset: 'assets',
        category: 'categories',
        ledgers: '[ledgers]'
      }
    },
    output: {
      OK: walletSchemas.transaction_templates,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) =>
    response.ok(
      await pb.update
        .collection('transaction_templates')
        .id(id)
        .data({
          ...body,
          location_coords: {
            lon: body.location?.location.longitude || 0,
            lat: body.location?.location.latitude || 0
          },
          location_name: body.location?.name || ''
        })
        .execute()
    )
  )

export const remove = forge
  .mutation({
    description: 'Delete a transaction template',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: {
        id: 'transaction_templates'
      }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('transaction_templates').id(id).execute()

    return response.noContent()
  })
