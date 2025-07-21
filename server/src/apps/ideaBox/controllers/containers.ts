import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { singleUploadMiddlewareOfKey } from '@middlewares/uploadMiddleware'
import fs from 'fs'

import { IdeaBoxControllersSchemas } from 'shared/types/controllers'

import * as containersService from '../services/containers.service'

const checkContainerExists = forgeController
  .route('GET /valid/:id')
  .description('Check if a container exists')
  .schema(IdeaBoxControllersSchemas.Containers.checkContainerExists)
  .callback(
    async ({ pb, params: { id } }) =>
      await containersService.checkContainerExists(pb, id)
  )

const getContainers = forgeController
  .route('GET /')
  .description('Get all containers')
  .schema(IdeaBoxControllersSchemas.Containers.getContainers)
  .callback(async ({ pb }) => await containersService.getContainers(pb))

const createContainer = forgeController
  .route('POST /')
  .description('Create a new container')
  .schema(IdeaBoxControllersSchemas.Containers.createContainer)
  .middlewares(singleUploadMiddlewareOfKey('cover'))
  .callback(async ({ pb, body: { name, color, icon, cover }, req }) => {
    const container = await containersService.createContainer(
      pb,
      name,
      color,
      icon,
      await (async () => {
        if (req.file) {
          return new File([fs.readFileSync(req.file.path)], req.file.filename)
        }

        if (cover) {
          const response = await fetch(cover as string) //TODO

          const fileBuffer = await response.arrayBuffer()

          return new File([fileBuffer], 'cover.jpg')
        }

        return undefined
      })()
    )

    if (container.cover) {
      container.cover = pb.files
        .getURL(container, container.cover)
        .replace(`${pb.baseURL}/api/files`, '')
    }

    if (req.file) {
      fs.unlinkSync(req.file.path)
    }

    return container
  })
  .statusCode(201)

const updateContainer = forgeController
  .route('PATCH /:id')
  .description('Update a container')
  .schema(IdeaBoxControllersSchemas.Containers.updateContainer)
  .middlewares(singleUploadMiddlewareOfKey('cover'))
  .existenceCheck('params', {
    id: 'idea_box__containers'
  })
  .callback(
    async ({ pb, params: { id }, body: { name, icon, color, cover }, req }) => {
      const container = await containersService.updateContainer(
        pb,
        id,
        name,
        color,
        icon,
        await (async () => {
          if (req.file) {
            return new File([fs.readFileSync(req.file.path)], req.file.filename)
          }

          if (cover === 'keep') {
            return 'keep'
          }

          if (cover) {
            const response = await fetch(cover)

            const fileBuffer = await response.arrayBuffer()

            return new File([fileBuffer], 'cover.jpg')
          }

          return undefined
        })()
      )

      if (container.cover) {
        container.cover = pb.files
          .getURL(container, container.cover)
          .replace(`${pb.baseURL}/api/files`, '')
      }

      if (req.file) {
        fs.unlinkSync(req.file.path)
      }

      return container
    }
  )

const deleteContainer = forgeController
  .route('DELETE /:id')
  .description('Delete a container')
  .schema(IdeaBoxControllersSchemas.Containers.deleteContainer)
  .existenceCheck('params', {
    id: 'idea_box__containers'
  })
  .callback(async ({ pb, params: { id } }) =>
    containersService.deleteContainer(pb, id)
  )
  .statusCode(204)

export default forgeRouter({
  checkContainerExists,
  getContainers,
  createContainer,
  updateContainer,
  deleteContainer
})
