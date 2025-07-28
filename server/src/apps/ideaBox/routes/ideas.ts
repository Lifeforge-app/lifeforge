import { SchemaWithPB } from '@functions/database/PBService/typescript/pb_service'
import getMedia from '@functions/external/media'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import COLLECTION_SCHEMAS, { SCHEMAS } from '@schema'
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
        content: idea.content,
        type: 'text'
      })),
      ...imageIdeas.map(idea => ({
        ...idea.expand!.base_entry,
        child: {
          id: idea.id,
          collectionId: idea.collectionId
        },
        image: idea.image
      })),
      ...linkIdeas.map(idea => ({
        ...idea.expand!.base_entry,
        link: idea.link
      }))
    ] as Array<SchemaWithPB<z.infer<typeof _returnSchema>>>
  })

const createSchema = SCHEMAS.idea_box.entries
  .omit({
    created: true,
    updated: true,
    type: true,
    archived: true,
    pinned: true
  })
  .and(
    z.union([
      SCHEMAS.idea_box.entries_text
        .omit({
          base_entry: true
        })
        .extend({
          type: z.literal('text')
        }),
      SCHEMAS.idea_box.entries_image
        .omit({
          base_entry: true,
          image: true
        })
        .extend({
          type: z.literal('image')
        }),
      SCHEMAS.idea_box.entries_link
        .omit({
          base_entry: true
        })
        .extend({
          type: z.literal('link')
        })
    ])
  )

const create = forgeController.mutation
  .description('Create a new idea')
  .input({
    body: createSchema
  })
  .media({
    image: {
      optional: true
    }
  })
  .existenceCheck('body', {
    container: 'idea_box__containers',
    folder: '[idea_box__folders]'
  })
  .statusCode(201)
  .callback(async ({ pb, body: rawBody, media: { image } }) => {
    const body = rawBody as z.infer<typeof createSchema>

    const baseEntry = await pb.create
      .collection('idea_box__entries')
      .data({
        container: body.container,
        folder: body.folder,
        type: body.type,
        tags: body.tags
      })
      .execute()

    if (body.type === 'text') {
      await pb.create
        .collection('idea_box__entries_text')
        .data({
          base_entry: baseEntry.id,
          content: body.content
        })
        .execute()
    } else if (body.type === 'image') {
      if (!image) {
        throw new ClientError('Image is required for image entries')
      }

      const imageData = await getMedia('image', image)

      await pb.create
        .collection('idea_box__entries_image')
        .data({
          base_entry: baseEntry.id,
          ...imageData
        })
        .execute()
    } else if (body.type === 'link') {
      await pb.create
        .collection('idea_box__entries_link')
        .data({
          base_entry: baseEntry.id,
          link: body.link
        })
        .execute()
    }
  })

const updateSchema = SCHEMAS.idea_box.entries
  .omit({
    created: true,
    updated: true,
    type: true,
    folder: true,
    container: true,
    archived: true,
    pinned: true
  })
  .and(
    z.union([
      SCHEMAS.idea_box.entries_text
        .omit({
          base_entry: true
        })
        .extend({
          type: z.literal('text')
        }),
      SCHEMAS.idea_box.entries_image
        .omit({
          base_entry: true,
          image: true
        })
        .extend({
          type: z.literal('image')
        }),
      SCHEMAS.idea_box.entries_link
        .omit({
          base_entry: true
        })
        .extend({
          type: z.literal('link')
        })
    ])
  )

const update = forgeController.mutation
  .description('Update an idea')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: updateSchema
  })
  .media({
    image: {
      optional: true
    }
  })
  .existenceCheck('query', {
    id: 'idea_box__entries'
  })
  .callback(async ({ pb, query: { id }, body: rawBody, media: { image } }) => {
    const body = rawBody as z.infer<typeof createSchema>

    const baseIdea = await pb.update
      .collection('idea_box__entries')
      .id(id)
      .data({
        type: body.type,
        tags: body.tags
      })
      .execute()

    if (body.type === 'text') {
      const existingText = await pb.getFirstListItem
        .collection('idea_box__entries_text')
        .filter([
          {
            field: 'base_entry',
            operator: '=',
            value: baseIdea.id
          }
        ])
        .execute()

      await pb.update
        .collection('idea_box__entries_text')
        .id(existingText.id)
        .data({
          content: body.content
        })
        .execute()
    } else if (body.type === 'image') {
      if (!image) {
        throw new ClientError('Image is required for image entries')
      }

      const existingImage = await pb.getFirstListItem
        .collection('idea_box__entries_image')
        .filter([
          {
            field: 'base_entry',
            operator: '=',
            value: baseIdea.id
          }
        ])
        .execute()

      const imageData = await getMedia('image', image)

      await pb.update
        .collection('idea_box__entries_image')
        .id(existingImage.id)
        .data({
          ...imageData
        })
        .execute()
    } else if (body.type === 'link') {
      const existingLink = await pb.getFirstListItem
        .collection('idea_box__entries_link')
        .filter([
          {
            field: 'base_entry',
            operator: '=',
            value: baseIdea.id
          }
        ])
        .execute()

      await pb.update
        .collection('idea_box__entries_link')
        .id(existingLink.id)
        .data({
          link: body.link
        })
        .execute()
    } else {
      throw new ClientError('Invalid idea type')
    }
  })

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
  .callback(async ({ pb, query: { id } }) => {
    const currentIdea = await pb.getOne
      .collection('idea_box__entries')
      .id(id)
      .execute()

    if (!currentIdea.folder) {
      throw new ClientError('Idea is not in any folder')
    }

    const currentFolder = await pb.getOne
      .collection('idea_box__folders')
      .id(currentIdea.folder)
      .execute()

    if (!currentFolder) {
      throw new ClientError('Current folder does not exist')
    }

    await pb.update
      .collection('idea_box__entries')
      .id(id)
      .data({
        folder: currentFolder.parent || ''
      })
      .execute()
  })

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
