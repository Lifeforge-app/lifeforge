import z from 'zod'

import forge from '../forge'
import wishlistSchemas from '../schema'

export const getById = forge
  .query({
    description: 'Get wishlist by ID',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'wishlist__lists' }
    },
    output: {
      OK: wishlistSchemas.lists_aggregated.schema
    }
  })
  .callback(async ({ pb, query: { id }, response }) =>
    response.ok(
      await pb.getOne.collection('wishlist__lists_aggregated').id(id).execute()
    )
  )

export const validate = forge
  .query({
    description: 'Check if wishlist exists',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    output: {
      OK: z.boolean()
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    const exists = !!(await pb.getOne
      .collection('wishlist__lists')
      .id(id)
      .execute()
      .catch(() => null))

    return response.ok(exists)
  })

export const list = forge
  .query({
    description: 'Get all wishlists with statistics',
    output: {
      OK: z.array(wishlistSchemas.lists_aggregated.schema)
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      await pb.getFullList.collection('wishlist__lists_aggregated').execute()
    )
  )

export const create = forge
  .mutation({
    description: 'Create a new wishlist',
    input: {
      body: wishlistSchemas.lists.schema
    },
    output: {
      CREATED: wishlistSchemas.lists.schema
    }
  })
  .callback(async ({ pb, body, response }) =>
    response.created(
      await pb.create.collection('wishlist__lists').data(body).execute()
    )
  )

export const update = forge
  .mutation({
    description: 'Update an existing wishlist',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: wishlistSchemas.lists.schema
    },
    existenceCheck: {
      query: { id: 'wishlist__lists' }
    },
    output: {
      OK: wishlistSchemas.lists.schema
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) =>
    response.ok(
      await pb.update.collection('wishlist__lists').id(id).data(body).execute()
    )
  )

export const remove = forge
  .mutation({
    description: 'Delete a wishlist',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'wishlist__lists' }
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('wishlist__lists').id(id).execute()

    return response.noContent()
  })
