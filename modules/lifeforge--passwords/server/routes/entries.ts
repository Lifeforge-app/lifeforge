import dayjs from 'dayjs'
import z from 'zod'

import forge from '../forge'
import passwordsSchemas from '../schema'

export const list = forge
  .query({
    description: 'Get all password entries with sorting',
    output: {
      OK: z.array(passwordsSchemas.entries)
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      await pb.getFullList
        .collection('entries')
        .sort(['-pinned', 'name'])
        .execute()
    )
  )

export const create = forge
  .mutation({
    description: 'Create a new password entry with pre-encrypted password',
    input: {
      body: passwordsSchemas.entries.omit({
        pinned: true,
        created: true,
        updated: true,
        last_password_updated: true,
        collectionId: true,
        id: true,
        collectionName: true
      })
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ pb, body, response }) => {
    await pb.create
      .collection('entries')
      .data({ ...body, last_password_updated: dayjs().toDate() })
      .execute()

    return response.noContent()
  })

export const update = forge
  .mutation({
    description: 'Update an existing password entry',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: passwordsSchemas.entries
        .omit({
          pinned: true,
          created: true,
          updated: true,
          collectionId: true,
          last_password_updated: true,
          id: true,
          collectionName: true
        })
        .extend({
          password_changed: z.boolean().optional()
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
  .callback(async ({ pb, query: { id }, body, response }) => {
    const { password_changed, ...rest } = body

    const data: Record<string, unknown> = { ...rest }

    if (password_changed) {
      data.last_password_updated = new Date().toISOString()
    }

    await pb.update.collection('entries').id(id).data(data).execute()

    return response.noContent()
  })

export const remove = forge
  .mutation({
    description: 'Delete a password entry',
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

export const togglePin = forge
  .mutation({
    description: 'Toggle pin status of a password entry',
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
    const entry = await pb.getOne.collection('entries').id(id).execute()

    await pb.update
      .collection('entries')
      .id(id)
      .data({
        pinned: !entry.pinned
      })
      .execute()

    return response.noContent()
  })
