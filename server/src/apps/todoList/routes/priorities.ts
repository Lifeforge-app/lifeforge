import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import { z } from 'zod/v4'

const getAllPriorities = forgeController.query
  .description('Get all todo priorities')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList.collection('todo_list__priorities').execute()
  )

const createPriority = forgeController.mutation
  .description('Create a new todo priority')
  .input({
    body: SCHEMAS.todo_list.priorities
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('todo_list__priorities').data(body).execute()
  )

const updatePriority = forgeController.mutation
  .description('Update an existing todo priority')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.todo_list.priorities
  })
  .existenceCheck('query', {
    id: 'todo_list__priorities'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('todo_list__priorities').id(id).data(body).execute()
  )

const deletePriority = forgeController.mutation
  .description('Delete a todo priority')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'todo_list__priorities'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('todo_list__priorities').id(id).execute()
  )

export default forgeRouter({
  getAllPriorities,
  createPriority,
  updatePriority,
  deletePriority
})
