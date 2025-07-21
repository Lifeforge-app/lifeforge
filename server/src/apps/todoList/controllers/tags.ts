import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import { TodoListControllersSchemas } from 'shared/types/controllers'

import * as tagsService from '../services/tags.service'

const getAllTags = forgeController
  .route('GET /')
  .description('Get all todo tags')
  .schema(TodoListControllersSchemas.Tags.getAllTags)
  .callback(({ pb }) => tagsService.getAllTags(pb))

const createTag = forgeController
  .route('POST /')
  .description('Create a new todo tag')
  .schema(TodoListControllersSchemas.Tags.createTag)
  .statusCode(201)
  .callback(({ pb, body }) => tagsService.createTag(pb, body))

const updateTag = forgeController
  .route('PATCH /:id')
  .description('Update an existing todo tag')
  .schema(TodoListControllersSchemas.Tags.updateTag)
  .existenceCheck('params', {
    id: 'todo_list__tags'
  })
  .callback(({ pb, params: { id }, body }) =>
    tagsService.updateTag(pb, id, body)
  )

const deleteTag = forgeController
  .route('DELETE /:id')
  .description('Delete a todo tag')
  .schema(TodoListControllersSchemas.Tags.deleteTag)
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
