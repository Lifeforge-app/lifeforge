import { SchemaWithPB } from '@functions/database/PBService/typescript/pb_service'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import COLLECTION_SCHEMAS, { SCHEMAS } from '@schema'
import fs from 'fs'
import multer from 'multer'
import { z } from 'zod/v4'

import { validateFolderPath } from '../utils/folders'

const list = forgeController.query
  .description('Get ideas from a folder')
  .input({
    query: z.object({
      container: z.string(),
      path: z.string(),
      archived: z
        .string()
        .optional()
        .transform(val => val === 'true')
    })
  })
  .existenceCheck('query', {
    container: 'idea_box__containers'
  })
  .callback(async ({ pb, query: { path: pathParam, container, archived } }) => {
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

    const textIdeas = await pb.getFullList
      .collection('idea_box__entries_text')
      .expand({
        base_entry: 'idea_box__entries'
      })
      .filter([
        {
          field: 'base_entry.container',
          operator: '=',
          value: container
        },
        {
          field: 'base_entry.archived',
          operator: '=',
          value: archived
        },
        {
          field: 'base_entry.folder',
          operator: '=',
          value: lastFolder || ''
        }
      ])
      .sort(['-base_entry.pinned', '-base_entry.created'])
      .execute()

    const imageIdeas = await pb.getFullList
      .collection('idea_box__entries_image')
      .expand({
        base_entry: 'idea_box__entries'
      })
      .filter([
        {
          field: 'base_entry.container',
          operator: '=',
          value: container
        },
        {
          field: 'base_entry.archived',
          operator: '=',
          value: archived
        },
        {
          field: 'base_entry.folder',
          operator: '=',
          value: lastFolder || ''
        }
      ])
      .sort(['-base_entry.pinned', '-base_entry.created'])
      .execute()

    const linkIdeas = await pb.getFullList
      .collection('idea_box__entries_link')
      .expand({
        base_entry: 'idea_box__entries'
      })
      .filter([
        {
          field: 'base_entry.container',
          operator: '=',
          value: container
        },
        {
          field: 'base_entry.archived',
          operator: '=',
          value: archived
        },
        {
          field: 'base_entry.folder',
          operator: '=',
          value: lastFolder || ''
        }
      ])
      .sort(['-base_entry.pinned', '-base_entry.created'])
      .execute()

    const _returnSchema = COLLECTION_SCHEMAS.idea_box__entries
      .omit({
        type: true
      })
      .and(
        z.union([
          COLLECTION_SCHEMAS.idea_box__entries_text.extend({
            type: z.literal('text')
          }),
          COLLECTION_SCHEMAS.idea_box__entries_image.extend({
            type: z.literal('image')
          }),
          COLLECTION_SCHEMAS.idea_box__entries_link.extend({
            type: z.literal('link')
          })
        ])
      )

    return [
      ...textIdeas.map(idea => ({
        ...idea.expand!.base_entry,
        id: idea.id,
        collectionId: idea.collectionId,
        collectionName: idea.collectionName,
        content: idea.content,
        type: 'text'
      })),
      ...imageIdeas.map(idea => ({
        ...idea.expand!.base_entry,
        id: idea.id,
        collectionId: idea.collectionId,
        collectionName: idea.collectionName,
        image: idea.image
      })),
      ...linkIdeas.map(idea => ({
        ...idea.expand!.base_entry,
        id: idea.id,
        collectionId: idea.collectionId,
        collectionName: idea.collectionName,
        link: idea.link
      }))
    ] as Array<SchemaWithPB<z.infer<typeof _returnSchema>>>
  })

const create = forgeController.mutation
  .description('Create a new idea')
  .input({
    body: SCHEMAS.idea_box.entries
      .pick({
        type: true,
        container: true,
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
  .callback(async ({ pb, body: { type, container, imageLink, tags }, req }) => {
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
            throw new ClientError('Image file is required for image type ideas')
          }
          data['image'] = new File(
            [fs.readFileSync(file.path)],
            file.originalname,
            {
              type: file.mimetype
            }
          )
          data['title'] = title
        }
        break
    }

    return pb.create.collection('idea_box__entries').data(data).execute()
  })

const update = forgeController.mutation
  .description('Update an idea')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      type: z.enum(['text', 'link', 'image']),
      tags: z.array(z.string()).optional()
    })
  })
  .existenceCheck('query', {
    id: 'idea_box__entries'
  })
  .callback(
    async ({ pb, query: { id }, body: { title, content, type, tags } }) => {
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

const remove = forgeController.mutation
  .description('Delete an idea')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'idea_box__entries'
  })
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('idea_box__entries').id(id).execute()
  )
  .statusCode(204)

const pin = forgeController.mutation
  .description('Pin/unpin an idea')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'idea_box__entries'
  })
  .callback(async ({ pb, query: { id } }) => {
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

const archive = forgeController.mutation
  .description('Archive/unarchive an idea')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'idea_box__entries'
  })
  .callback(async ({ pb, query: { id } }) => {
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

const moveTo = forgeController.mutation
  .description('Move an idea to a different folder')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: z.object({
      target: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'idea_box__entries'
  })
  .existenceCheck('body', {
    target: 'idea_box__folders'
  })
  .callback(({ pb, query: { id }, body: { target } }) =>
    pb.update
      .collection('idea_box__entries')
      .id(id)
      .data({
        folder: target
      })
      .execute()
  )

const removeFromParent = forgeController.mutation
  .description('Remove an idea from its current folder')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'idea_box__entries'
  })
  .callback(({ pb, query: { id } }) =>
    pb.update
      .collection('idea_box__entries')
      .id(id)
      .data({
        folder: ''
      })
      .execute()
  )

export default forgeRouter({
  list,
  create,
  update,
  remove,
  pin,
  archive,
  moveTo,
  removeFromParent
})
