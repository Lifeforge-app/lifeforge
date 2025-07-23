import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import { z } from 'zod/v4'

const getAllPriorities = forgeController
  .route('GET /')
  .description('Get all todo priorities')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList.collection('todo_list__priorities').execute()
  )

const createPriority = forgeController
  .route('POST /')
  .description('Create a new todo priority')
  .input({
    body: SCHEMAS.todo_list.priorities
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('todo_list__priorities').data(body).execute()
  )

const updatePriority = forgeController
  .route('PATCH /:id')
  .description('Update an existing todo priority')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: SCHEMAS.todo_list.priorities
  })
  .existenceCheck('params', {
    id: 'todo_list__priorities'
  })
  .callback(({ pb, params: { id }, body }) =>
    pb.update.collection('todo_list__priorities').id(id).data(body).execute()
  )

const deletePriority = forgeController
  .route('DELETE /:id')
  .description('Delete a todo priority')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'todo_list__priorities'
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) =>
    pb.delete.collection('todo_list__priorities').id(id).execute()
  )

export default forgeRouter({
  getAllPriorities,
  createPriority,
  updatePriority,
  deletePriority
})
