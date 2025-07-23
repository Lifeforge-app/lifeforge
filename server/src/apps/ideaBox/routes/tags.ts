import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import { z } from 'zod/v4'

const getTags = forgeController
  .route('GET /:container')
  .description('Get tags for a container')
  .input({
    params: z.object({
      container: z.string()
    })
  })
  .existenceCheck('params', {
    container: 'idea_box__containers'
  })
  .callback(
    async ({ pb, params: { container } }) =>
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

const createTag = forgeController
  .route('POST /:container')
  .description('Create a new tag')
  .input({
    body: SCHEMAS.idea_box.tags
  })
  .existenceCheck('params', {
    container: 'idea_box__containers'
  })
  .statusCode(201)
  .callback(
    async ({ pb, body }) =>
      await pb.create.collection('idea_box__tags').data(body).execute()
  )

const updateTag = forgeController
  .route('PATCH /:id')
  .description('Update a tag')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: SCHEMAS.idea_box.tags.omit({
      container: true
    })
  })
  .existenceCheck('params', {
    id: 'idea_box__tags'
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await pb.update.collection('idea_box__tags').id(id).data(body).execute()
  )

const deleteTag = forgeController
  .route('DELETE /:id')
  .description('Delete a tag')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'idea_box__tags'
  })
  .statusCode(204)
  .callback(async ({ pb, params: { id } }) => {
    await pb.delete.collection('idea_box__tags').id(id).execute()
  })

export default forgeRouter({
  getTags,
  createTag,
  updateTag,
  deleteTag
})
