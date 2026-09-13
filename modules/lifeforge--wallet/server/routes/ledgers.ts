import z from 'zod'

import forge from '../forge'
import walletSchemas from '../schema'

export const list = forge
  .query({
    description: 'Get all ledgers',
    output: {
      OK: z.array(walletSchemas.ledgers_aggregated)
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      await pb.getFullList
        .collection('ledgers_aggregated')
        .sort(['name'])
        .execute()
    )
  )

export const create = forge
  .mutation({
    description: 'Create a new ledger',
    input: {
      body: walletSchemas.ledgers.pick({
        name: true,
        icon: true,
        color: true
      })
    },
    output: {
      CREATED: walletSchemas.ledgers,
      CONFLICT: true
    }
  })
  .callback(async ({ pb, body, response }) =>
    response.created(await pb.create.collection('ledgers').data(body).execute())
  )

export const update = forge
  .mutation({
    description: 'Update ledger details',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: walletSchemas.ledgers.pick({
        name: true,
        icon: true,
        color: true
      })
    },
    existenceCheck: {
      query: {
        id: 'ledgers'
      }
    },
    output: {
      OK: walletSchemas.ledgers,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) =>
    response.ok(
      await pb.update.collection('ledgers').id(id).data(body).execute()
    )
  )

export const remove = forge
  .mutation({
    description: 'Delete a ledger',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: {
        id: 'ledgers'
      }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('ledgers').id(id).execute()

    return response.noContent()
  })
