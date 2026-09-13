import z from 'zod'

import forge from '../forge'
import calendarSchemas from '../schema'

export const list = forge
  .query({
    description: 'Get all event categories',
    output: {
      OK: z.array(calendarSchemas.categories)
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      await pb.getFullList.collection('categories').sort(['name']).execute()
    )
  )

export const getById = forge
  .query({
    description: 'Get a specific event category by ID',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'categories' }
    },
    output: {
      OK: calendarSchemas.categories,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) =>
    response.ok(await pb.getOne.collection('categories').id(id).execute())
  )

export const create = forge
  .mutation({
    description: 'Create a new event category',
    input: {
      body: calendarSchemas.categories.omit({
        id: true,
        collectionId: true,
        collectionName: true
      })
    },
    output: {
      CREATED: calendarSchemas.categories,
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ pb, body, response }) => {
    if (body.name.startsWith('_')) {
      return response.badRequest('Category name cannot start with _')
    }

    return response.created(
      await pb.create.collection('categories').data(body).execute()
    )
  })

export const update = forge
  .mutation({
    description: 'Update event category details',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: calendarSchemas.categories.omit({
        id: true,
        collectionId: true,
        collectionName: true
      })
    },
    existenceCheck: {
      query: { id: 'categories' }
    },
    output: {
      OK: calendarSchemas.categories,
      BAD_REQUEST: z.string(),
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) => {
    if (body.name.startsWith('_')) {
      return response.badRequest('Category name cannot start with _')
    }

    return response.ok(
      await pb.update.collection('categories').id(id).data(body).execute()
    )
  })

export const remove = forge
  .mutation({
    description: 'Delete an event category',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'categories' }
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
