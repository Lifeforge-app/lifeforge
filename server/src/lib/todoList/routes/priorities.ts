import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import { z } from 'zod'

const list = forgeController
  .query()
  .description('Get all todo priorities')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList.collection('todo_list__priorities_aggregated').execute()
  )

const create = forgeController
  .mutation()
  .description('Create a new todo priority')
  .input({
    body: SCHEMAS.todo_list.priorities.schema
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('todo_list__priorities').data(body).execute()
  )

const update = forgeController
  .mutation()
  .description('Update an existing todo priority')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.todo_list.priorities.schema
  })
  .existenceCheck('query', {
    id: 'todo_list__priorities'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('todo_list__priorities').id(id).data(body).execute()
  )

const remove = forgeController
  .mutation()
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
  list,
  create,
  update,
  remove
})
