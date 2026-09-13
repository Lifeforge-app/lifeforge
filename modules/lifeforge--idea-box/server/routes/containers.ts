import z from 'zod'

import forge from '../forge'
import ideaBoxSchemas from '../schema'

export const validate = forge
  .query({
    description: 'Validate if a container exists',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    output: {
      OK: z.boolean()
    }
  })
  .callback(async ({ pb, query: { id }, response }) =>
    response.ok(
      !!(await pb.getOne
        .collection('containers')
        .id(id)
        .execute()
        .catch(() => {}))
    )
  )

export const list = forge
  .query({
    description: 'Get all containers with stats',
    input: {
      query: z.object({
        hidden: z.string().optional()
      })
    },
    output: {
      OK: z.array(ideaBoxSchemas.containers_aggregated)
    }
  })
  .callback(async ({ pb, query: { hidden }, response }) => {
    const parsedHidden = hidden === 'true'

    return response.ok(
      await pb.getFullList
        .collection('containers_aggregated')
        .filter([
          !parsedHidden
            ? {
                field: 'hidden',
                operator: '=',
                value: false
              }
            : undefined
        ])
        .sort(['hidden', '-pinned', 'name'])
        .execute()
    )
  })

export const create = forge
  .mutation({
    description: 'Create a new container',
    input: {
      body: ideaBoxSchemas.containers.omit({
        cover: true,
        hidden: true,
        pinned: true
      })
    },
    media: {
      cover: {
        optional: true
      }
    },
    output: {
      CREATED: ideaBoxSchemas.containers
    }
  })
  .callback(
    async ({
      pb,
      body,
      media: { cover },
      core: {
        media: { retrieveMedia }
      },
      response
    }) =>
      response.created(
        await pb.create
          .collection('containers')
          .data({
            ...body,
            ...(await retrieveMedia('cover', cover))
          })
          .execute()
      )
  )

export const update = forge
  .mutation({
    description: 'Update an existing container',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: ideaBoxSchemas.containers.omit({
        cover: true,
        hidden: true,
        pinned: true
      })
    },
    media: {
      cover: {
        optional: true
      }
    },
    existenceCheck: {
      query: { id: 'containers' }
    },
    output: {
      OK: ideaBoxSchemas.containers,
      NOT_FOUND: true
    }
  })
  .callback(
    async ({
      pb,
      query: { id },
      body,
      media: { cover },
      core: {
        media: { retrieveMedia }
      },
      response
    }) =>
      response.ok(
        await pb.update
          .collection('containers')
          .id(id)
          .data({
            ...body,
            ...(await retrieveMedia('cover', cover))
          })
          .execute()
      )
  )

export const remove = forge
  .mutation({
    description: 'Delete a container',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'containers' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('containers').id(id).execute()

    return response.noContent()
  })

export const togglePin = forge
  .mutation({
    description: 'Toggle pin status of a container',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'containers' }
    },
    output: {
      OK: ideaBoxSchemas.containers,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    const container = await pb.getOne.collection('containers').id(id).execute()

    return response.ok(
      await pb.update
        .collection('containers')
        .id(id)
        .data({
          pinned: !container.pinned
        })
        .execute()
    )
  })

export const toggleHide = forge
  .mutation({
    description: 'Toggle visibility of a container',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'containers' }
    },
    output: {
      OK: ideaBoxSchemas.containers,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    const container = await pb.getOne.collection('containers').id(id).execute()

    return response.ok(
      await pb.update
        .collection('containers')
        .id(id)
        .data({
          hidden: !container.hidden,
          pinned: false
        })
        .execute()
    )
  })
