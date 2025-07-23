import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import { SCHEMAS } from '@schema'
import multer from 'multer'
import { z } from 'zod/v4'

import { validateFolderPath } from '../utils/folders'

const getIdeas = forgeController
  .route('GET /:container/*')
  .description('Get ideas from a folder')
  .input({
    params: z.object({
      container: z.string(),
      '0': z.string()
    }),
    query: z.object({
      archived: z
        .string()
        .optional()
        .transform(val => val === 'true')
    })
  })
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

      const { folderExists, lastFolder } = await validateFolderPath(
        pb,
        container,
        path
      )

      if (!folderExists) {
        throw new ClientError(
          `Folder with path "${pathParam}" does not exist in container "${container}"`
        )
      }

      return await pb.getFullList
        .collection('idea_box__entries')
        .filter([
          {
            field: 'container',
            operator: '=',
            value: container
          },
          {
            field: 'archived',
            operator: '=',
            value: archived
          },
          {
            field: 'folder',
            operator: '=',
            value: lastFolder || ''
          }
        ])
        .sort(['-pinned', '-created'])
        .execute()
    }
  )

const createIdea = forgeController
  .route('POST /')
  .description('Create a new idea')
  .input({
    body: SCHEMAS.idea_box.entries
      .pick({
        type: true,
        container: true,
        folder: true,
        title: true,
        content: true,
        tags: true
      })
      .extend({
        imageLink: z.string().optional(),
        tags: z.string().transform(val => JSON.parse(val))
      })
  })
  .middlewares(multer().single('image'))
  .existenceCheck('body', {
    container: 'idea_box__containers'
  })
  .statusCode(201)
  .callback(
    async ({
      pb,
      body: { type, container, folder, title, content, imageLink, tags },
      req
    }) => {
      const { file } = req

      const data = {
        title: '',
        content: '',
        type,
        container,
        folder,
        tags: tags || null,
        image: null as File | null
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

      return pb.create.collection('idea_box__entries').data(data).execute()
    }
  )

const updateIdea = forgeController
  .route('PATCH /:id')
  .description('Update an idea')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      type: z.enum(['text', 'link', 'image']),
      tags: z.array(z.string()).optional()
    })
  })
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

      return pb.update
        .collection('idea_box__entries')
        .id(id)
        .data(data)
        .execute()
    }
  )

const deleteIdea = forgeController
  .route('DELETE /:id')
  .description('Delete an idea')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'idea_box__entries'
  })
  .callback(({ pb, params: { id } }) =>
    pb.delete.collection('idea_box__entries').id(id).execute()
  )
  .statusCode(204)

const pinIdea = forgeController
  .route('POST /pin/:id')
  .description('Pin/unpin an idea')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'idea_box__entries'
  })
  .callback(async ({ pb, params: { id } }) => {
    const idea = await pb.getOne
      .collection('idea_box__entries')
      .id(id)
      .execute()

    return await pb.update
      .collection('idea_box__entries')
      .id(id)
      .data({
        pinned: !idea.pinned
      })
      .execute()
  })

const archiveIdea = forgeController
  .route('POST /archive/:id')
  .description('Archive/unarchive an idea')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'idea_box__entries'
  })
  .callback(async ({ pb, params: { id } }) => {
    const idea = await pb.getOne
      .collection('idea_box__entries')
      .id(id)
      .execute()

    return await pb.update
      .collection('idea_box__entries')
      .id(id)
      .data({
        archived: !idea.archived,
        pinned: false
      })
      .execute()
  })

const moveIdea = forgeController
  .route('POST /move/:id')
  .description('Move an idea to a different folder')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: z.object({
      target: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'idea_box__entries'
  })
  .existenceCheck('body', {
    target: 'idea_box__folders'
  })
  .callback(({ pb, params: { id }, body: { target } }) =>
    pb.update
      .collection('idea_box__entries')
      .id(id)
      .data({
        folder: target
      })
      .execute()
  )

const removeFromFolder = forgeController
  .route('DELETE /move/:id')
  .description('Remove an idea from its current folder')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'idea_box__entries'
  })
  .callback(({ pb, params: { id } }) =>
    pb.update
      .collection('idea_box__entries')
      .id(id)
      .data({
        folder: ''
      })
      .execute()
  )

export default forgeRouter({
  getIdeas,
  createIdea,
  updateIdea,
  deleteIdea,
  pinIdea,
  archiveIdea,
  moveIdea,
  removeFromFolder
})
