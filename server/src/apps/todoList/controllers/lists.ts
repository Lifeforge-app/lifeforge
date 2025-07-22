import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import * as listsService from '../services/lists.service'

const getAllLists = forgeController
  .route('GET /')
  .description('Get all todo lists')
  .input({})
  .callback(({ pb }) => listsService.getAllLists(pb))

const createList = forgeController
  .route('POST /')
  .description('Create a new todo list')
  .input({})
  .statusCode(201)
  .callback(({ pb, body }) => listsService.createList(pb, body))

const updateList = forgeController
  .route('PATCH /:id')
  .description('Update an existing todo list')
  .input({})
  .existenceCheck('params', {
    id: 'todo_list__lists'
  })
  .callback(({ pb, params: { id }, body }) =>
    listsService.updateList(pb, id, body)
  )

const deleteList = forgeController
  .route('DELETE /:id')
  .description('Delete a todo list')
  .input({})
  .existenceCheck('params', {
    id: 'todo_list__lists'
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) => listsService.deleteList(pb, id))

export default forgeRouter({
  getAllLists,
  createList,
  updateList,
  deleteList
})
