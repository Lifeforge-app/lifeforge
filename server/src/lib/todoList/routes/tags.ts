import { forgeController, forgeRouter } from '@functions/routes'
import { SCHEMAS } from '@schema'
import { z } from 'zod/v4'

const list = forgeController
  .query()
  .description('Get all todo tags')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList.collection('todo_list__tags_aggregated').execute()
  )

const create = forgeController
  .mutation()
  .description('Create a new todo tag')
  .input({
    body: SCHEMAS.todo_list.tags
  })
  .statusCode(201)
  .callback(({ pb, body }) =>
    pb.create.collection('todo_list__tags').data(body).execute()
  )

const update = forgeController
  .mutation()
  .description('Update an existing todo tag')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.todo_list.tags
  })
  .existenceCheck('query', {
    id: 'todo_list__tags'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('todo_list__tags').id(id).data(body).execute()
  )

const remove = forgeController
  .mutation()
  .description('Delete a todo tag')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'todo_list__tags'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('todo_list__tags').id(id).execute()
  )

export default forgeRouter({
  list,
  create,
  update,
  remove
})
