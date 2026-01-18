
import { SCHEMAS } from '@schema'
import z from 'zod'

export const list = forge
  .query()
  .description('List all entries')
  .input({})
  .callback(({ pb }) => pb.getFullList.collection('{{snake moduleName.en}}__entries').execute())

export const getById = forge
  .query()
  .description('Get entry by ID')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: '{{snake moduleName.en}}__entries'
  })
  .callback(({ pb, query: { id } }) =>
    pb.getOne.collection('{{snake moduleName.en}}__entries').id(id).execute()
  )

export const create = forge
  .mutation()
  .description('Create a new entry')
  .input({
    body: SCHEMAS.{{snake moduleName.en}}.entries.omit({ created: true, updated: true })
  })
  .callback(({ pb, body }) =>
    pb.create.collection('{{snake moduleName.en}}__entries').data(body).execute()
  )

export const update = forge
  .mutation()
  .description('Update an existing entry')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.{{snake moduleName.en}}.entries
      .partial()
      .omit({ created: true, updated: true })
  })
  .existenceCheck('query', {
    id: '{{snake moduleName.en}}__entries'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('{{snake moduleName.en}}__entries').id(id).data(body).execute()
  )

export const remove = forge
  .mutation()
  .description('Delete an entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: '{{snake moduleName.en}}__entries'
  })
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('{{snake moduleName.en}}__entries').id(id).execute()
  )
