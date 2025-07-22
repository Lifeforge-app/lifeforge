import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import * as prioritiesService from '../services/priorities.service'

const getAllPriorities = forgeController
  .route('GET /')
  .description('Get all todo priorities')
  .input({})
  .callback(({ pb }) => prioritiesService.getAllPriorities(pb))

const createPriority = forgeController
  .route('POST /')
  .description('Create a new todo priority')
  .input({})
  .statusCode(201)
  .callback(({ pb, body }) => prioritiesService.createPriority(pb, body))

const updatePriority = forgeController
  .route('PATCH /:id')
  .description('Update an existing todo priority')
  .input({})
  .existenceCheck('params', {
    id: 'todo_list__priorities'
  })
  .callback(({ pb, params: { id }, body }) =>
    prioritiesService.updatePriority(pb, id, body)
  )

const deletePriority = forgeController
  .route('DELETE /:id')
  .description('Delete a todo priority')
  .input({})
  .existenceCheck('params', {
    id: 'todo_list__priorities'
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) =>
    prioritiesService.deletePriority(pb, id)
  )

export default forgeRouter({
  getAllPriorities,
  createPriority,
  updatePriority,
  deletePriority
})
