import { forgeController, forgeRouter } from '@functions/routes'
import z from 'zod'

const list = forgeController
  .query()
  .description('Get all music entries')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('music__entries')
      .sort(['-is_favourite', 'name'])
      .execute()
  )

const update = forgeController
  .mutation()
  .description('Update a music entry')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: z.object({
      name: z.string(),
      author: z.string()
    })
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('music__entries').id(id).data(body).execute()
  )

const remove = forgeController
  .mutation()
  .description('Delete a music entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'music__entries'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('music__entries').id(id).execute()
  )

const toggleFavourite = forgeController
  .mutation()
  .description('Toggle favourite status of a music entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'music__entries'
  })
  .statusCode(200)
  .callback(async ({ pb, query: { id } }) => {
    const entry = await pb.getOne.collection('music__entries').id(id).execute()

    return pb.update
      .collection('music__entries')
      .id(id)
      .data({ is_favourite: !entry.is_favourite })
      .execute()
  })

export default forgeRouter({
  list,
  update,
  remove,
  toggleFavourite
})
