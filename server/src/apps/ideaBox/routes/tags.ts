import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import { z } from 'zod/v4'

const getTags = forgeController.query
  .description('Get tags for a container')
  .input({
    query: z.object({
      container: z.string()
    })
  })
  .existenceCheck('query', {
    container: 'idea_box__containers'
  })
  .callback(
    async ({ pb, query: { container } }) =>
      await pb.getFullList
        .collection('idea_box__tags_aggregated')
        .filter([
          {
            field: 'container',
            operator: '=',
            value: container
          }
        ])
        .sort(['-amount'])
        .execute()
  )

const createTag = forgeController.mutation
  .description('Create a new tag')
  .input({
    body: SCHEMAS.idea_box.tags
  })
  .existenceCheck('query', {
    container: 'idea_box__containers'
  })
  .statusCode(201)
  .callback(
    async ({ pb, body }) =>
      await pb.create.collection('idea_box__tags').data(body).execute()
  )

const updateTag = forgeController.mutation
  .description('Update a tag')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.idea_box.tags.omit({
      container: true
    })
  })
  .existenceCheck('query', {
    id: 'idea_box__tags'
  })
  .callback(
    async ({ pb, query: { id }, body }) =>
      await pb.update.collection('idea_box__tags').id(id).data(body).execute()
  )

const deleteTag = forgeController.mutation
  .description('Delete a tag')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'idea_box__tags'
  })
  .statusCode(204)
  .callback(async ({ pb, query: { id } }) => {
    await pb.delete.collection('idea_box__tags').id(id).execute()
  })

export default forgeRouter({
  getTags,
  createTag,
  updateTag,
  deleteTag
})
