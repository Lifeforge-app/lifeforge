import z from 'zod'

import forge from '../forge'
import musicSchemas from '../schema'

export const list = forge
  .query({
    description: 'Retrieve all music entries',
    output: {
      OK: z.array(musicSchemas.entries)
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      await pb.getFullList
        .collection('entries')
        .sort(['-is_favourite', 'name'])
        .execute()
    )
  )

export const update = forge
  .mutation({
    description: 'Update music entry details',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: z.object({
        name: z.string(),
        author: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'entries' }
    },
    output: {
      OK: musicSchemas.entries,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) =>
    response.ok(
      await pb.update.collection('entries').id(id).data(body).execute()
    )
  )

export const remove = forge
  .mutation({
    description: 'Delete a music entry',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'entries' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('entries').id(id).execute()

    return response.noContent()
  })

export const toggleFavourite = forge
  .mutation({
    description: 'Toggle favourite status of a music entry',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'entries' }
    },
    output: {
      OK: musicSchemas.entries,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    const entry = await pb.getOne.collection('entries').id(id).execute()

    return response.ok(
      await pb.update
        .collection('entries')
        .id(id)
        .data({ is_favourite: !entry.is_favourite })
        .execute()
    )
  })
