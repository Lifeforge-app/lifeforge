import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import {
  addToTaskPool,
  updateTaskInPool
} from '@middlewares/taskPoolMiddleware'
import { SCHEMAS } from '@schema'
import { z } from 'zod/v4'

import { processFiles } from '../utils/uploadFiles'

export let left = 0

export function setLeft(value: number) {
  left = value
}

const sidebarData = forgeController.query
  .description('Get sidebar data for scores library')
  .input({})
  .callback(async ({ pb }) => {
    const allScores = await pb.getList
      .collection('scores_library__entries')
      .page(1)
      .perPage(1)
      .execute()

    const favourites = await pb.getList
      .collection('scores_library__entries')
      .page(1)
      .perPage(1)
      .filter([
        {
          field: 'isFavourite',
          operator: '=',
          value: true
        }
      ])
      .execute()

    const allAuthors = await pb.getFullList
      .collection('scores_library__authors_aggregated')
      .execute()

    const allTypes = await pb.getFullList
      .collection('scores_library__types_aggregated')
      .sort(['amount', 'name'])
      .execute()

    return {
      total: allScores.totalItems,
      favourites: favourites.totalItems,
      types: allTypes,
      authors: Object.fromEntries(
        allAuthors.map(author => [author.name, author.amount])
      )
    }
  })

const list = forgeController.query
  .description('Get scores library entries')
  .input({
    query: z.object({
      page: z
        .string()
        .optional()
        .transform(val => parseInt(val ?? '1', 10) || 1),
      query: z.string().optional(),
      category: z.string().optional(),
      author: z.string().optional(),
      collection: z.string().optional(),
      starred: z
        .string()
        .optional()
        .transform(val => val === 'true'),
      sort: z
        .enum(['name', 'author', 'newest', 'oldest'])
        .optional()
        .default('newest')
    })
  })
  .callback(
    ({
      pb,
      query: { page, query = '', category, author, collection, starred, sort }
    }) => {
      return pb.getList
        .collection('scores_library__entries')
        .page(page)
        .perPage(20)
        .filter([
          {
            combination: '||',
            filters: [
              { field: 'name', operator: '~', value: query || '' },
              { field: 'author', operator: '~', value: query || '' }
            ]
          },
          ...(category
            ? ([
                {
                  field: 'type',
                  operator: '=',
                  value: category === 'uncategorized' ? '' : category
                }
              ] as const)
            : []),
          ...(author
            ? ([
                {
                  field: 'author',
                  operator: '=',
                  value: author === '[na]' ? '' : author
                }
              ] as const)
            : []),
          ...(collection
            ? ([
                { field: 'collection', operator: '=', value: collection }
              ] as const)
            : []),
          ...(starred
            ? ([
                { field: 'isFavourite', operator: '=', value: starred }
              ] as const)
            : [])
        ])
        .sort([
          '-isFavourite',
          (
            {
              name: 'name',
              author: 'author',
              newest: '-created',
              oldest: 'created'
            } as const
          )[sort]
        ])
        .execute()
    }
  )

const random = forgeController.query
  .description('Get a random score entry')
  .input({})
  .callback(async ({ pb }) => {
    const allScores = await pb.getFullList
      .collection('scores_library__entries')
      .execute()

    return allScores[Math.floor(Math.random() * allScores.length)]
  })

const upload = forgeController.mutation
  .description('Upload score files')
  .input({})
  .statusCode(202)
  .media({
    files: {
      optional: false,
      multiple: true
    }
  })
  .callback(async ({ io, pb, media: { files } }) => {
    if (!files) {
      throw new ClientError('No files provided')
    }

    const taskId = addToTaskPool(io, {
      module: 'scoresLibrary',
      description: 'Uploading music scores from local',
      progress: {
        left: 0,
        total: 0
      },
      status: 'pending'
    })

    ;(async () => {
      try {
        let groups: Record<
          string,
          {
            pdf: Express.Multer.File | null
            mscz: Express.Multer.File | null
            mp3: Express.Multer.File | null
          }
        > = {}

        for (const file of files as Express.Multer.File[]) {
          const decodedName = decodeURIComponent(file.originalname)

          const extension = decodedName.split('.').pop()

          if (!extension || !['mscz', 'mp3', 'pdf'].includes(extension))
            continue

          const name = decodedName.split('.').slice(0, -1).join('.')

          if (!groups[name]) {
            groups[name] = {
              pdf: null,
              mscz: null,
              mp3: null
            }
          }

          groups[name][extension as 'pdf' | 'mscz' | 'mp3'] = file
        }

        for (const group of Object.values(groups)) {
          if (group.pdf) continue
        }

        groups = Object.fromEntries(
          Object.entries(groups).filter(([_, group]) => group.pdf)
        )

        updateTaskInPool(io, taskId, {
          status: 'running',
          progress: {
            left: Object.keys(groups).length,
            total: Object.keys(groups).length
          }
        })

        left = Object.keys(groups).length

        processFiles(pb, groups, io, taskId)

        return { status: 'success' }
      } catch (error) {
        updateTaskInPool(io, taskId, {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        })

        return { status: 'error', message: 'Failed to process files' }
      }
    })()

    return taskId
  })

const update = forgeController.mutation
  .description('Update a score entry')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: SCHEMAS.scores_library.entries
      .pick({
        name: true,
        author: true,
        type: true
      })
      .extend({
        collection: z.string().optional()
      })
  })
  .existenceCheck('query', {
    id: 'scores_library__entries'
  })
  .existenceCheck('body', {
    collection: '[scores_library__collections]'
  })
  .callback(({ pb, query: { id }, body }) =>
    pb.update.collection('scores_library__entries').id(id).data(body).execute()
  )

const remove = forgeController.mutation
  .description('Delete a score entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'scores_library__entries'
  })
  .statusCode(204)
  .callback(async ({ pb, query: { id } }) =>
    pb.delete.collection('scores_library__entries').id(id).execute()
  )

const toggleFavourite = forgeController.mutation
  .description('Toggle favourite status of a score entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'scores_library__entries'
  })
  .callback(async ({ pb, query: { id } }) => {
    const entry = await pb.getOne
      .collection('scores_library__entries')
      .id(id)
      .execute()

    return await pb.update
      .collection('scores_library__entries')
      .id(id)
      .data({
        isFavourite: !entry.isFavourite
      })
      .execute()
  })

export default forgeRouter({
  sidebarData,
  list,
  random,
  upload,
  update,
  remove,
  toggleFavourite
})
