import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import * as tagsService from '../services/tags.service'

const getAllTags = forgeController
  .route('GET /')
  .description('Get all todo tags')
  .input({})
  .callback(({ pb }) => tagsService.getAllTags(pb))

const createTag = forgeController
  .route('POST /')
  .description('Create a new todo tag')
  .input({})
  .statusCode(201)
  .callback(({ pb, body }) => tagsService.createTag(pb, body))

const updateTag = forgeController
  .route('PATCH /:id')
  .description('Update an existing todo tag')
  .input({})
  .existenceCheck('params', {
    id: 'todo_list__tags'
  })
  .callback(({ pb, params: { id }, body }) =>
    tagsService.updateTag(pb, id, body)
  )

const deleteTag = forgeController
  .route('DELETE /:id')
  .description('Delete a todo tag')
  .input({})
  .existenceCheck('params', {
    id: 'todo_list__tags'
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) => tagsService.deleteTag(pb, id))

export default forgeRouter({
  getAllTags,
  createTag,
  updateTag,
  deleteTag
})
