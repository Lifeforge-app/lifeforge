import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import { SCHEMAS } from '@schema'
import { z } from 'zod'

import { validateFolderPath } from '../utils/folders'

const list = forgeController
  .query()
  .description('List folders from a container path')
  .input({
    query: z.object({
      container: z.string(),
      path: z.string()
    })
  })
  .existenceCheck('query', {
    container: 'idea_box__containers'
  })
  .callback(async ({ pb, query }) => {
    const { container, path } = query

    const pathSegments = path.split('/').filter(p => p !== '')

    const { folderExists, lastFolder } = await validateFolderPath(
      pb,
      container,
      pathSegments
    )

    if (!folderExists) {
      throw new ClientError(
        `Folder with path "${path}" does not exist in container "${container}"`
      )
    }

    return await pb.getFullList
      .collection('idea_box__folders')
      .filter([
        {
          field: 'container',
          operator: '=',
          value: container
        },
        {
          field: 'parent',
          operator: '=',
          value: lastFolder
        }
      ])
      .sort(['name'])
      .execute()
  })

const create = forgeController
  .mutation()
  .description('Create a new folder')
  .input({
    body: SCHEMAS.idea_box.folders.schema
  })
  .existenceCheck('body', {
    container: 'idea_box__containers',
    parent: 'idea_box__folders'
  })
  .callback(
    async ({ pb, body }) =>
      await pb.create.collection('idea_box__folders').data(body).execute()
  )
  .statusCode(201)

const update = forgeController
  .mutation()
  .description('Update a folder')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.idea_box.folders.schema.omit({
      container: true,
      parent: true
    })
  })
  .existenceCheck('query', {
    id: 'idea_box__folders'
  })
  .callback(
    async ({ pb, query: { id }, body }) =>
      await pb.update
        .collection('idea_box__folders')
        .id(id)
        .data(body)
        .execute()
  )

const moveTo = forgeController
  .mutation()
  .description('Move a folder to a different parent')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: z.object({
      target: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'idea_box__folders'
  })
  .existenceCheck('body', {
    target: 'idea_box__folders'
  })
  .callback(
    async ({ pb, query: { id }, body: { target } }) =>
      await pb.update
        .collection('idea_box__folders')
        .id(id)
        .data({
          parent: target
        })
        .execute()
  )

const removeFromParent = forgeController
  .mutation()
  .description('Remove a folder from its parent')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'idea_box__folders'
  })
  .callback(
    async ({ pb, query: { id } }) =>
      await pb.update
        .collection('idea_box__folders')
        .id(id)
        .data({
          parent: ''
        })
        .execute()
  )

const remove = forgeController
  .mutation()
  .description('Delete a folder')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'idea_box__folders'
  })
  .callback(async ({ pb, query: { id } }) => {
    await pb.delete.collection('idea_box__folders').id(id).execute()
  })
  .statusCode(204)

export default forgeRouter({
  list,
  create,
  update,
  moveTo,
  removeFromParent,
  remove
})
