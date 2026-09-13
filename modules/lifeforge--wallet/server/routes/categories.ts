import z from 'zod'

import forge from '../forge'
import walletSchemas from '../schema'

export const list = forge
  .query({
    description: 'Get all transaction categories',
    output: {
      OK: z.array(walletSchemas.categories_aggregated)
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      await pb.getFullList
        .collection('categories_aggregated')
        .sort(['name'])
        .execute()
    )
  )

export const create = forge
  .mutation({
    description: 'Create a new transaction category',
    input: {
      body: walletSchemas.categories.pick({
        name: true,
        icon: true,
        color: true,
        type: true
      })
    },
    output: {
      CREATED: walletSchemas.categories,
      CONFLICT: true
    }
  })
  .callback(async ({ pb, body, response }) =>
    response.created(
      await pb.create.collection('categories').data(body).execute()
    )
  )

export const update = forge
  .mutation({
    description: 'Update category details',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: walletSchemas.categories.pick({
        name: true,
        icon: true,
        color: true,
        type: true
      })
    },
    existenceCheck: {
      query: {
        id: 'categories'
      }
    },
    output: {
      OK: walletSchemas.categories,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) =>
    response.ok(
      await pb.update.collection('categories').id(id).data(body).execute()
    )
  )

export const remove = forge
  .mutation({
    description: 'Delete a transaction category',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: {
        id: 'categories'
      }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('categories').id(id).execute()

    return response.noContent()
  })
