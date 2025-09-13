import getMedia from '@functions/external/media'
import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import { z } from 'zod/v4'

const validate = forgeController
  .query()
  .description('Check if a container exists')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .callback(
    async ({ pb, query: { id } }) =>
      !!(await pb.getOne
        .collection('idea_box__containers')
        .id(id)
        .execute()
        .catch(() => {}))
  )

const list = forgeController
  .query()
  .description('Get all containers')
  .input({
    query: z.object({
      hidden: z
        .string()
        .optional()
        .transform(val => val === 'true')
    })
  })
  .callback(({ pb, query: { hidden } }) =>
    pb.getFullList
      .collection('idea_box__containers_aggregated')
      .filter([
        !hidden
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

const create = forgeController
  .mutation()
  .description('Create a new container')
  .input({
    body: SCHEMAS.idea_box.containers.omit({
      cover: true,
      hidden: true,
      pinned: true
    })
  })
  .media({
    cover: {
      optional: true
    }
  })
  .statusCode(201)
  .callback(async ({ pb, body, media: { cover } }) =>
    pb.create
      .collection('idea_box__containers')
      .data({
        ...body,
        ...(await getMedia('cover', cover))
      })
      .execute()
  )

const update = forgeController
  .mutation()
  .description('Update a container')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.idea_box.containers.omit({
      cover: true,
      hidden: true,
      pinned: true
    })
  })
  .media({
    cover: {
      optional: true
    }
  })
  .existenceCheck('query', {
    id: 'idea_box__containers'
  })
  .callback(async ({ pb, query: { id }, body, media: { cover } }) =>
    pb.update
      .collection('idea_box__containers')
      .id(id)
      .data({
        ...body,
        ...(await getMedia('cover', cover))
      })
      .execute()
  )

const remove = forgeController
  .mutation()
  .description('Delete a container')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'idea_box__containers'
  })
  .statusCode(204)
  .callback(async ({ pb, query: { id } }) =>
    pb.delete.collection('idea_box__containers').id(id).execute()
  )

const togglePin = forgeController
  .mutation()
  .description('Toggle pin status of a container')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'idea_box__containers'
  })
  .callback(async ({ pb, query: { id } }) => {
    const container = await pb.getOne
      .collection('idea_box__containers')
      .id(id)
      .execute()

    return pb.update
      .collection('idea_box__containers')
      .id(id)
      .data({
        pinned: !container.pinned
      })
      .execute()
  })

const toggleHide = forgeController
  .mutation()
  .description('Toggle hide status of a container')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'idea_box__containers'
  })
  .callback(async ({ pb, query: { id } }) => {
    const container = await pb.getOne
      .collection('idea_box__containers')
      .id(id)
      .execute()

    return pb.update
      .collection('idea_box__containers')
      .id(id)
      .data({
        hidden: !container.hidden,
        pinned: false
      })
      .execute()
  })

export default forgeRouter({
  validate,
  list,
  create,
  update,
  remove,
  togglePin,
  toggleHide
})
