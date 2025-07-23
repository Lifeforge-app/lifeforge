import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import { z } from 'zod/v4'

const getAllLists = forgeController
  .route('GET /')
  .description('Get all todo lists')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList.collection('todo_list__lists').sort(['name']).execute()
  )

const createList = forgeController
  .route('POST /')
  .description('Create a new todo list')
  .input({
    body: SCHEMAS.todo_list.lists
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('todo_list__lists').data(body).execute()
  )

const updateList = forgeController
  .route('PATCH /:id')
  .description('Update an existing todo list')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: SCHEMAS.todo_list.lists
  })
  .existenceCheck('params', {
    id: 'todo_list__lists'
  })
  .callback(({ pb, params: { id }, body }) =>
    pb.update.collection('todo_list__lists').id(id).data(body).execute()
  )

const deleteList = forgeController
  .route('DELETE /:id')
  .description('Delete a todo list')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'todo_list__lists'
  })
  .statusCode(204)
  .callback(({ pb, params: { id } }) =>
    pb.delete.collection('todo_list__lists').id(id).execute()
  )

export default forgeRouter({
  getAllLists,
  createList,
  updateList,
  deleteList
})
