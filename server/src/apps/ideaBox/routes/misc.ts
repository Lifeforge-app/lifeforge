import { checkExistence } from '@functions/database'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import ogs from 'open-graph-scraper'
import { z } from 'zod/v4'

import { recursivelySearchFolder } from '../utils/folders'

const OGCache = new Map<string, any>()

const getPath = forgeController.query
  .description('Get path information for a container')
  .input({
    query: z.object({
      container: z.string(),
      path: z.string()
    })
  })
  .existenceCheck('query', {
    container: 'idea_box__containers'
  })
  .callback(async ({ pb, query: { container, path } }) => {
    const containerEntry = await pb.getOne
      .collection('idea_box__containers')
      .id(container)
      .execute()

    let lastFolder = ''

    const fullPath = []

    for (const folder of path.split('/').filter(e => e)) {
      if (!(await checkExistence(pb, 'idea_box__folders', folder))) {
        throw new ClientError(
          `Folder with ID "${folder}" does not exist in container "${container}"`
        )
      }

      const folderEntry = await pb.getOne
        .collection('idea_box__folders')
        .id(folder)
        .execute()

      if (
        folderEntry.parent !== lastFolder ||
        folderEntry.container !== container
      ) {
        throw new ClientError('Invalid path')
      }

      lastFolder = folder
      fullPath.push(folderEntry)
    }

    return {
      container: containerEntry,
      path: fullPath
    }
  })

const checkValid = forgeController.query
  .description('Check if a path is valid')
  .input({
    query: z.object({
      container: z.string(),
      path: z.string()
    })
  })
  .callback(async ({ pb, query: { container, path } }) => {
    const containerExists = await checkExistence(
      pb,
      'idea_box__containers',
      container
    )

    if (!containerExists) {
      return false
    }

    let folderExists = true
    let lastFolder = ''

    for (const folder of path.split('/').filter(e => e)) {
      if (!(await checkExistence(pb, 'idea_box__folders', folder))) {
        folderExists = false
        break
      }

      const folderEntry = await pb.getOne
        .collection('idea_box__folders')
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

    return containerExists && folderExists
  })

const getOgData = forgeController.query
  .description('Get Open Graph data for an entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'idea_box__entries_link'
  })
  .callback(async ({ pb, query: { id } }) => {
    const data = await pb.getFirstListItem
      .collection('idea_box__entries_link')
      .filter([
        {
          field: 'base_entry',
          operator: '=',
          value: id
        }
      ])
      .execute()

    if (OGCache.has(id) && OGCache.get(id)?.requestUrl === data.link) {
      return OGCache.get(id)
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
      console.error('Error fetching Open Graph data:', data.link)

      return { result: null }
    })

    OGCache.set(id, result)

    return result
  })

const search = forgeController.query
  .description('Search entries')
  .input({
    query: z.object({
      q: z.string(),
      container: z.string(),
      tags: z.string().optional(),
      folder: z.string().optional()
    })
  })
  .existenceCheck('query', {
    container: '[idea_box__containers]'
  })
  .callback(async ({ pb, query: { q, container, tags, folder } }) => {
    const results = await recursivelySearchFolder(
      folder || '',
      q,
      container,
      tags,
      '',
      pb
    )

    return results
  })

export default forgeRouter({
  getPath,
  checkValid,
  getOgData,
  search
})
