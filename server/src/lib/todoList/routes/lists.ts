import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import { z } from 'zod/v4'

const list = forgeController
  .query()
  .description('Get all todo lists')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('todo_list__lists_aggregated')
      .sort(['name'])
      .execute()
  )

const create = forgeController
  .mutation()
  .description('Create a new todo list')
  .input({
    body: SCHEMAS.todo_list.lists
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('todo_list__lists').data(body).execute()
  )

const update = forgeController
  .mutation()
  .description('Update an existing todo list')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.todo_list.lists
  })
  .existenceCheck('query', {
    id: 'todo_list__lists'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('todo_list__lists').id(id).data(body).execute()
  )

const remove = forgeController
  .mutation()
  .description('Delete a todo list')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'todo_list__lists'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('todo_list__lists').id(id).execute()
  )

export default forgeRouter({
  list,
  create,
  update,
  remove
})
