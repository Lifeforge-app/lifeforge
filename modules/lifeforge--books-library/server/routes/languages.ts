import z from 'zod'

import forge from '../forge'
import schema from '../schema'

export const list = forge
  .query({
    description: 'Get all book languages',
    output: {
      OK: z.array(schema.languages_aggregated)
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      await pb.getFullList.collection('languages_aggregated').execute()
    )
  )

export const create = forge
  .mutation({
    description: 'Create a new book language',
    input: {
      body: schema.languages.omit({
        id: true,
        collectionName: true,
        collectionId: true
      })
    },
    output: {
      CREATED: schema.languages
    }
  })
  .callback(async ({ pb, body, response }) =>
    response.created(
      await pb.create.collection('languages').data(body).execute()
    )
  )

export const update = forge
  .mutation({
    description: 'Update an existing book language',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: schema.languages.omit({
        id: true,
        collectionName: true,
        collectionId: true
      })
    },
    existenceCheck: {
      query: { id: 'languages' }
    },
    output: {
      OK: schema.languages,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) =>
    response.ok(
      await pb.update.collection('languages').id(id).data(body).execute()
    )
  )

export const remove = forge
  .mutation({
    description: 'Delete a book language',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'languages' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('languages').id(id).execute()

    return response.noContent()
  })
