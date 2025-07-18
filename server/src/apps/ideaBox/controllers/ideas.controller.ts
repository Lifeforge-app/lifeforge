import ClientError from '@functions/ClientError'
import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'
import multer from 'multer'

import { IdeaBoxCollectionsSchemas } from 'shared/types/collections'
import { IdeaBoxControllersSchemas } from 'shared/types/controllers'

import * as ideasService from '../services/ideas.service'

const ideaBoxIdeasRouter = express.Router()

const getIdeas = forgeController
  .route('GET /:container/*')
  .description('Get ideas from a folder')
  .schema(IdeaBoxControllersSchemas.Ideas.getIdeas)
  .existenceCheck('params', {
    container: 'idea_box__containers'
  })
  .callback(
    async ({
      pb,
      params: { '0': pathParam, container },
      query: { archived }
    }) => {
      const path = pathParam.split('/').filter(e => e)

      const { folderExists, lastFolder } =
        await ideasService.validateFolderPath(pb, container, path)

      if (!folderExists) {
        throw new ClientError(
          `Folder with path "${pathParam}" does not exist in container "${container}"`
        )
      }
      return await ideasService.getIdeas(pb, container, lastFolder, archived)
    }
  )

const createIdea = forgeController
  .route('POST /')
  .description('Create a new idea')
  .schema(IdeaBoxControllersSchemas.Ideas.createIdea)
  .middlewares(multer().single('image') as any)
  .existenceCheck('body', {
    container: 'idea_box__containers'
  })
  .callback(
    async ({
      pb,
      body: { type, container, folder, title, content, imageLink, tags },
      req
    }) => {
      const { file } = req

      const data: Omit<
        IdeaBoxCollectionsSchemas.IEntry,
        'image' | 'archived' | 'pinned'
      > & {
        image?: File
      } = {
        title: '',
        content: '',
        type,
        container,
        folder,
        tags: tags || null
      }

      switch (type) {
        case 'text':
        case 'link':
          data['title'] = title
          data['content'] = content
          break
        case 'image':
          if (imageLink) {
            const response = await fetch(imageLink)

            const buffer = await response.arrayBuffer()

            data['image'] = new File([buffer], 'image.jpg', {
              type: 'image/jpeg'
            })
            data['title'] = title
          } else {
            if (!file) {
              throw new ClientError(
                'Image file is required for image type ideas'
              )
            }
            data['image'] = new File([file.buffer], file.originalname, {
              type: file.mimetype
            })
            data['title'] = title
          }
          break
      }
      return await ideasService.createIdea(pb, data)
    }
  )
  .statusCode(201)

const updateIdea = forgeController
  .route('PATCH /:id')
  .description('Update an idea')
  .schema(IdeaBoxControllersSchemas.Ideas.updateIdea)
  .existenceCheck('params', {
    id: 'idea_box__entries'
  })
  .callback(
    async ({ pb, params: { id }, body: { title, content, type, tags } }) => {
      let data
      switch (type) {
        case 'text':
        case 'link':
          data = {
            title,
            content,
            type,
            tags: tags || null
          }
          break
        case 'image':
          data = {
            title,
            type,
            tags: tags || null
          }
          break
      }
      return await ideasService.updateIdea(pb, id, data as any)
    }
  )

const deleteIdea = forgeController
  .route('DELETE /:id')
  .description('Delete an idea')
  .schema(IdeaBoxControllersSchemas.Ideas.deleteIdea)
  .existenceCheck('params', {
    id: 'idea_box__entries'
  })
  .callback(
    async ({ pb, params: { id } }) => await ideasService.deleteIdea(pb, id)
  )
  .statusCode(204)

const pinIdea = forgeController
  .route('POST /pin/:id')
  .description('Pin/unpin an idea')
  .schema(IdeaBoxControllersSchemas.Ideas.pinIdea)
  .existenceCheck('params', {
    id: 'idea_box__entries'
  })
  .callback(
    async ({ pb, params: { id } }) => await ideasService.updatePinStatus(pb, id)
  )

const archiveIdea = forgeController
  .route('POST /archive/:id')
  .description('Archive/unarchive an idea')
  .schema(IdeaBoxControllersSchemas.Ideas.archiveIdea)
  .existenceCheck('params', {
    id: 'idea_box__entries'
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await ideasService.updateArchiveStatus(pb, id)
  )

const moveIdea = forgeController
  .route('POST /move/:id')
  .description('Move an idea to a different folder')
  .schema(IdeaBoxControllersSchemas.Ideas.moveIdea)
  .existenceCheck('params', {
    id: 'idea_box__entries'
  })
  .existenceCheck('query', {
    target: 'idea_box__folders'
  })
  .callback(
    async ({ pb, params: { id }, query: { target } }) =>
      await ideasService.moveIdea(pb, id, target)
  )

const removeFromFolder = forgeController
  .route('DELETE /move/:id')
  .description('Remove an idea from its current folder')
  .schema(IdeaBoxControllersSchemas.Ideas.removeFromFolder)
  .existenceCheck('params', {
    id: 'idea_box__entries'
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await ideasService.removeFromFolder(pb, id)
  )

bulkRegisterControllers(ideaBoxIdeasRouter, [
  getIdeas,
  createIdea,
  updateIdea,
  deleteIdea,
  pinIdea,
  archiveIdea,
  moveIdea,
  removeFromFolder
])

export default ideaBoxIdeasRouter
