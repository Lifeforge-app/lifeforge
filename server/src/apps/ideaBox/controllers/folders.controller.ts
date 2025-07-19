import ClientError from '@functions/ClientError'
import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { IdeaBoxControllersSchemas } from 'shared/types/controllers'

import * as foldersService from '../services/folders.service'

const ideaBoxFoldersRouter = express.Router()

const getFolders = forgeController
  .route('GET /:container/*')
  .description('Get folders from a container path')
  .schema(IdeaBoxControllersSchemas.Folders.getFolders)
  .existenceCheck('params', {
    container: 'idea_box__containers'
  })
  .callback(async ({ pb, params }) => {
    const { container } = params

    const path = params[0].split('/').filter(p => p !== '')

    const { folderExists, lastFolder } =
      await foldersService.validateFolderPath(pb, container, path)

    if (!folderExists) {
      throw new ClientError(
        `Folder with path "${params[0]}" does not exist in container "${container}"`
      )
    }

    return await foldersService.getFolders(pb, container, lastFolder)
  })

const createFolder = forgeController
  .route('POST /')
  .description('Create a new folder')
  .schema(IdeaBoxControllersSchemas.Folders.createFolder)
  .existenceCheck('query', {
    container: 'idea_box__containers'
  })
  .callback(
    async ({ pb, query: { container, parent }, body }) =>
      await foldersService.createFolder(pb, { ...body, container, parent })
  )
  .statusCode(201)

const updateFolder = forgeController
  .route('PATCH /:id')
  .description('Update a folder')
  .schema(IdeaBoxControllersSchemas.Folders.updateFolder)
  .existenceCheck('params', {
    id: 'idea_box__folders'
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await foldersService.updateFolder(pb, id, body)
  )

const moveFolder = forgeController
  .route('POST /move/:id')
  .description('Move a folder to a different parent')
  .schema(IdeaBoxControllersSchemas.Folders.moveFolder)
  .existenceCheck('params', {
    id: 'idea_box__folders'
  })
  .existenceCheck('query', {
    target: 'idea_box__folders'
  })
  .callback(
    async ({ pb, params: { id }, query: { target } }) =>
      await foldersService.moveFolder(pb, id, target)
  )

const removeFromFolder = forgeController
  .route('DELETE /move/:id')
  .description('Remove a folder from its parent')
  .schema(IdeaBoxControllersSchemas.Folders.removeFromFolder)
  .existenceCheck('params', {
    id: 'idea_box__folders'
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await foldersService.removeFromFolder(pb, id)
  )

const deleteFolder = forgeController
  .route('DELETE /:id')
  .description('Delete a folder')
  .schema(IdeaBoxControllersSchemas.Folders.deleteFolder)
  .existenceCheck('params', {
    id: 'idea_box__folders'
  })
  .callback(
    async ({ pb, params: { id } }) => await foldersService.deleteFolder(pb, id)
  )
  .statusCode(204)

bulkRegisterControllers(ideaBoxFoldersRouter, [
  getFolders,
  createFolder,
  updateFolder,
  moveFolder,
  removeFromFolder,
  deleteFolder
])

export default ideaBoxFoldersRouter
