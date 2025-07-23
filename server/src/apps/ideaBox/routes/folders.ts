import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import { SCHEMAS } from '@schema'
import { z } from 'zod/v4'

import { validateFolderPath } from '../utils/folders'

const getFolders = forgeController
  .route('GET /:container/*')
  .description('Get folders from a container path')
  .input({
    params: z.object({
      container: z.string(),
      '0': z.string()
    })
  })
  .existenceCheck('params', {
    container: 'idea_box__containers'
  })
  .callback(async ({ pb, params }) => {
    const { container } = params

    const path = params['0'].split('/').filter(p => p !== '')

    const { folderExists, lastFolder } = await validateFolderPath(
      pb,
      container,
      path
    )

    if (!folderExists) {
      throw new ClientError(
        `Folder with path "${params['0']}" does not exist in container "${container}"`
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

const createFolder = forgeController
  .route('POST /')
  .description('Create a new folder')
  .input({
    body: SCHEMAS.idea_box.folders
  })
  .existenceCheck('query', {
    container: 'idea_box__containers'
  })
  .callback(
    async ({ pb, body }) =>
      await pb.create.collection('idea_box__folders').data(body).execute()
  )
  .statusCode(201)

const updateFolder = forgeController
  .route('PATCH /:id')
  .description('Update a folder')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: SCHEMAS.idea_box.folders.omit({
      container: true,
      parent: true
    })
  })
  .existenceCheck('params', {
    id: 'idea_box__folders'
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await pb.update
        .collection('idea_box__folders')
        .id(id)
        .data(body)
        .execute()
  )

const moveFolder = forgeController
  .route('POST /move/:id')
  .description('Move a folder to a different parent')
  .input({
    params: z.object({
      id: z.string()
    }),
    query: z.object({
      target: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'idea_box__folders'
  })
  .existenceCheck('query', {
    target: 'idea_box__folders'
  })
  .callback(
    async ({ pb, params: { id }, query: { target } }) =>
      await pb.update
        .collection('idea_box__folders')
        .id(id)
        .data({
          parent: target
        })
        .execute()
  )

const removeFromFolder = forgeController
  .route('DELETE /move/:id')
  .description('Remove a folder from its parent')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'idea_box__folders'
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await pb.update
        .collection('idea_box__folders')
        .id(id)
        .data({
          parent: ''
        })
        .execute()
  )

const deleteFolder = forgeController
  .route('DELETE /:id')
  .description('Delete a folder')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'idea_box__folders'
  })
  .callback(async ({ pb, params: { id } }) => {
    await pb.delete.collection('idea_box__folders').id(id).execute()
  })
  .statusCode(204)

export default forgeRouter({
  getFolders,
  createFolder,
  updateFolder,
  moveFolder,
  removeFromFolder,
  deleteFolder
})
