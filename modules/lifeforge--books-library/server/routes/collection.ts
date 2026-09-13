import z from 'zod'

import forge from '../forge'
import schema from '../schema'

export const list = forge
  .query({
    description:
      'Get all book collections. If the user asks to list books in a specific collection, call this tool first to get the collection ID.',
    output: {
      OK: z.array(schema.collections_aggregated)
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      await pb.getFullList
        .collection('collections_aggregated')
        .sort(['name'])
        .execute()
    )
  )

export const create = forge
  .mutation({
    description: 'Create a new book collection',
    input: {
      body: schema.collections.omit({
        id: true,
        collectionName: true,
        collectionId: true
      })
    },
    output: {
      CREATED: schema.collections
    }
  })
  .callback(async ({ pb, body, response }) =>
    response.created(
      await pb.create.collection('collections').data(body).execute()
    )
  )

export const update = forge
  .mutation({
    description: 'Update an existing book collection',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: schema.collections.omit({
        id: true,
        collectionName: true,
        collectionId: true
      })
    },
    existenceCheck: {
      query: { id: 'collections' }
    },
    output: {
      OK: schema.collections,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) =>
    response.ok(
      await pb.update.collection('collections').id(id).data(body).execute()
    )
  )

export const remove = forge
  .mutation({
    description: 'Delete a book collection',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'collections' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('collections').id(id).execute()

    return response.noContent()
  })
