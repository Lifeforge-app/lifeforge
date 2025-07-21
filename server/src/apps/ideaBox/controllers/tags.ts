import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import { IdeaBoxControllersSchemas } from 'shared/types/controllers'

import * as tagsService from '../services/tags.service'

const getTags = forgeController
  .route('GET /:container')
  .description('Get tags for a container')
  .schema(IdeaBoxControllersSchemas.Tags.getTags)
  .existenceCheck('params', {
    container: 'idea_box__containers'
  })
  .callback(
    async ({ pb, params: { container } }) =>
      await tagsService.getTags(pb, container)
  )

const createTag = forgeController
  .route('POST /:container')
  .description('Create a new tag')
  .schema(IdeaBoxControllersSchemas.Tags.createTag)
  .existenceCheck('params', {
    container: 'idea_box__containers'
  })
  .callback(
    async ({ pb, params: { container }, body }) =>
      await tagsService.createTag(pb, container, body)
  )
  .statusCode(201)

const updateTag = forgeController
  .route('PATCH /:id')
  .description('Update a tag')
  .schema(IdeaBoxControllersSchemas.Tags.updateTag)
  .existenceCheck('params', {
    id: 'idea_box__tags'
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await tagsService.updateTag(pb, id, body)
  )

const deleteTag = forgeController
  .route('DELETE /:id')
  .description('Delete a tag')
  .schema(IdeaBoxControllersSchemas.Tags.deleteTag)
  .existenceCheck('params', {
    id: 'idea_box__tags'
  })
  .callback(
    async ({ pb, params: { id } }) => await tagsService.deleteTag(pb, id)
  )
  .statusCode(204)

export default forgeRouter({
  getTags,
  createTag,
  updateTag,
  deleteTag
})
