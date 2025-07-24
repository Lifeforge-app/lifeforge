import { forgeController, forgeRouter } from '@functions/routes'
import { singleUploadMiddlewareOfKey } from '@middlewares/uploadMiddleware'
import { SCHEMAS } from '@schema'
import fs from 'fs'
import { z } from 'zod/v4'

const validate = forgeController.query
  .description('Check if a container exists')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .callback(
    async ({ pb, query: { id } }) =>
      !!(await pb.getOne
        .collection('idea_box__containers')
        .id(id)
        .execute()
        .catch(() => {}))
  )

const list = forgeController.query
  .description('Get all containers')
  .input({})
  .callback(({ pb }) =>
    pb.getFullList
      .collection('idea_box__containers_aggregated')
      .sort(['name'])
      .execute()
  )

const create = forgeController.mutation
  .description('Create a new container')
  .input({
    body: SCHEMAS.idea_box.containers
      .omit({
        cover: true
      })
      .extend({
        cover: z.union([z.string(), z.file()])
      })
  })
  .middlewares(singleUploadMiddlewareOfKey('cover'))
  .statusCode(201)
  .callback(async ({ pb, body, req }) => {
    const coverFile = await (async () => {
      const cover = body.cover

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

    const containerData: Record<string, string | File> = body

    if (coverFile) {
      containerData.cover = coverFile
    } else {
      containerData.cover = ''
    }

    const container = await pb.create
      .collection('idea_box__containers')
      .data(containerData)
      .execute()

    if (req.file) {
      fs.unlinkSync(req.file.path)
    }

    return container
  })

const update = forgeController.mutation
  .description('Update a container')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.idea_box.containers
      .omit({
        cover: true
      })
      .extend({
        cover: z.union([z.string(), z.file()])
      })
  })
  .middlewares(singleUploadMiddlewareOfKey('cover'))
  .existenceCheck('query', {
    id: 'idea_box__containers'
  })
  .callback(async ({ pb, query: { id }, body, req }) => {
    const coverFile = await (async () => {
      const cover = body.cover

      if (req.file) {
        return new File([fs.readFileSync(req.file.path)], req.file.filename)
      }

      if (cover === 'keep') {
        return 'keep'
      }

      if (typeof cover === 'string') {
        const response = await fetch(cover)

        const fileBuffer = await response.arrayBuffer()

        return new File([fileBuffer], 'cover.jpg')
      }

      return undefined
    })()

    const containerData: Record<string, string | File> = body

    if (coverFile !== 'keep') {
      containerData.cover = coverFile ?? ''
    }

    const container = await pb.update
      .collection('idea_box__containers')
      .id(id)
      .data(containerData)
      .execute()

    if (req.file) {
      fs.unlinkSync(req.file.path)
    }

    return container
  })

const remove = forgeController.mutation
  .description('Delete a container')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'idea_box__containers'
  })
  .statusCode(204)
  .callback(async ({ pb, query: { id } }) =>
    pb.delete.collection('idea_box__containers').id(id).execute()
  )

export default forgeRouter({
  validate,
  list,
  create,
  update,
  remove
})
