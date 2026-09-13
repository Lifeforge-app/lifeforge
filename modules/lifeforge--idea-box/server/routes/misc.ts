import ogs from 'open-graph-scraper'
import z from 'zod'

import forge from '../forge'
import ideaBoxSchemas from '../schema'
import { recursivelySearchFolder } from '../utils/folders'

const OGCache = new Map<string, any>()

export const getPath = forge
  .query({
    description: 'Get path information for a container or folder',
    input: {
      query: z.object({
        container: z.string(),
        folder: z.string().optional()
      })
    },
    existenceCheck: {
      query: {
        container: 'containers',
        folder: '[folders]'
      }
    },
    output: {
      OK: z.object({
        container: ideaBoxSchemas.containers,
        route: z.array(ideaBoxSchemas.folders)
      }),
      BAD_REQUEST: z.string(),
      NOT_FOUND: true
    }
  })
  .callback(
    async ({
      pb,
      query: { container, folder },
      core: {
        validation: { checkRecordExistence }
      },
      response
    }) => {
      const containerEntry = await pb.getOne
        .collection('containers')
        .id(container)
        .execute()

      if (!folder) {
        return response.ok({
          container: containerEntry,
          route: []
        })
      }

      let lastFolder = folder

      const fullPath = []

      while (lastFolder) {
        if (!(await checkRecordExistence(pb, 'folders', lastFolder))) {
          return response.badRequest(
            `Folder with ID "${lastFolder}" does not exist`
          )
        }

        const folderEntry = await pb.getOne
          .collection('folders')
          .id(lastFolder)
          .execute()

        if (folderEntry.container !== container) {
          return response.badRequest('Invalid path')
        }

        lastFolder = folderEntry.parent
        fullPath.unshift(folderEntry)
      }

      return response.ok({
        container: containerEntry,
        route: fullPath
      })
    }
  )

export const checkValid = forge
  .query({
    description: 'Validate if a folder path exists',
    input: {
      query: z.object({
        container: z.string(),
        path: z.string()
      })
    },
    output: {
      OK: z.boolean()
    }
  })
  .callback(
    async ({
      pb,
      query: { container, path },
      core: {
        validation: { checkRecordExistence }
      },
      response
    }) => {
      const containerExists = await checkRecordExistence(
        pb,
        'containers',
        container
      )

      if (!containerExists) {
        return response.ok(false)
      }

      let folderExists = true
      let lastFolder = ''

      for (const folder of path.split('/').filter(e => e)) {
        if (!(await checkRecordExistence(pb, 'folders', folder))) {
          folderExists = false
          break
        }

        const folderEntry = await pb.getOne
          .collection('folders')
          .id(folder)
          .execute()

        if (
          folderEntry.parent !== lastFolder ||
          folderEntry.container !== container
        ) {
          folderExists = false
          break
        }

        lastFolder = folder
      }

      return response.ok(containerExists && folderExists)
    }
  )

export const getOgData = forge
  .query({
    description: 'Get Open Graph metadata for a link entry',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'entries' }
    },
    output: {
      OK: z.any(),
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, core: { logging }, response }) => {
    const data = await pb.getFirstListItem
      .collection('entries_link')
      .filter([
        {
          field: 'base_entry',
          operator: '=',
          value: id
        }
      ])
      .execute()

    if (OGCache.has(id) && OGCache.get(id)?.requestUrl === data.link) {
      return response.ok(OGCache.get(id))
    }

    const { result } = await ogs({
      url: data.link,
      fetchOptions: {
        headers: {
          'User-Agent':
            'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
        }
      }
    }).catch(() => {
      logging.error(`Error fetching Open Graph data: ${data.link}`)

      return { result: null }
    })

    OGCache.set(id, { ...result, requestUrl: data.link })

    return response.ok(result)
  })

export const search = forge
  .query({
    description: 'Search entries in a container',
    input: {
      query: z.object({
        q: z.string(),
        container: z.string(),
        tags: z.string().optional(),
        folder: z.string().optional()
      })
    },
    existenceCheck: {
      query: { container: '[containers]' }
    },
    output: {
      OK: z.array(
        ideaBoxSchemas.entries.extend({
          content: z.string(),
          type: z.literal('text'),
          fullPath: z.string(),
          expand: z.object({
            folder: ideaBoxSchemas.folders.optional()
          })
        })
      ),
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { q, container, tags, folder }, response }) => {
    const results = await recursivelySearchFolder(
      folder || '',
      q,
      container,
      tags,
      '',
      pb
    )

    return response.ok(results)
  })
