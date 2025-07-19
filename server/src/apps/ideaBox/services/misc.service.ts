import ClientError from '@functions/ClientError'
import { checkExistence } from '@functions/PBRecordValidator'
import { clientError } from '@functions/response'
import { Request, Response } from 'express'
import ogs from 'open-graph-scraper'
import PocketBase from 'pocketbase'

import { ISchemaWithPB } from 'shared/types/collections'
import { IdeaBoxCollectionsSchemas } from 'shared/types/collections'

const OGCache = new Map<string, any>()

export const getPath = async (
  pb: PocketBase,
  container: string,
  path: string[],
  req: Request,
  res: Response
): Promise<{
  container: ISchemaWithPB<IdeaBoxCollectionsSchemas.IContainer>
  path: ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>[]
} | null> => {
  const containerExists = await checkExistence(
    req,
    res,
    'idea_box__containers',
    container
  )

  if (!containerExists) return null

  const containerEntry = await pb
    .collection('idea_box__containers')
    .getOne<ISchemaWithPB<IdeaBoxCollectionsSchemas.IContainer>>(container)

  containerEntry.cover = pb.files
    .getURL(containerEntry, containerEntry.cover)
    .replace(`${pb.baseURL}/api/files`, '')

  let lastFolder = ''

  const fullPath: ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>[] = []

  for (const folder of path) {
    if (!(await checkExistence(req, res, 'idea_box__folders', folder))) {
      return null
    }

    const folderEntry = await pb
      .collection('idea_box__folders')
      .getOne<ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>>(folder)

    if (
      folderEntry.parent !== lastFolder ||
      folderEntry.container !== container
    ) {
      clientError(res, 'Invalid path')

      return null
    }

    lastFolder = folder
    fullPath.push(folderEntry)
  }

  return {
    container: containerEntry,
    path: fullPath
  }
}

export const checkValid = async (
  pb: PocketBase,
  container: string,
  path: string[],
  req: Request,
  res: Response
): Promise<boolean> => {
  const containerExists = await checkExistence(
    req,
    res,
    'idea_box__containers',
    container,
    false
  )

  if (!containerExists) {
    return false
  }

  let folderExists = true
  let lastFolder = ''

  for (const folder of path) {
    if (!(await checkExistence(req, res, 'idea_box__folders', folder, false))) {
      folderExists = false
      break
    }

    const folderEntry = await pb
      .collection('idea_box__folders')
      .getOne<IdeaBoxCollectionsSchemas.IFolder>(folder)

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
}

export const getOgData = async (
  pb: PocketBase,
  id: string
): Promise<any | null> => {
  const data = await pb
    .collection('idea_box__entries')
    .getOne<IdeaBoxCollectionsSchemas.IEntry>(id)

  if (data.type !== 'link') {
    throw new ClientError(
      "Open Graph data can only be fetched for entries of type 'link'"
    )
  }

  if (OGCache.has(id) && OGCache.get(id)?.requestUrl === data.content) {
    return OGCache.get(id)
  }

  const { result } = await ogs({
    url: data.content,
    fetchOptions: {
      headers: {
        'User-Agent':
          'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
      }
    }
  }).catch(() => {
    console.error('Error fetching Open Graph data:', data.content)

    return { result: null }
  })

  OGCache.set(id, result)

  return result
}

async function recursivelySearchFolder(
  folderId: string,
  q: string,
  container: string,
  tags: string,
  req: Request,
  parents: string,
  pb: PocketBase
): Promise<
  (Omit<ISchemaWithPB<IdeaBoxCollectionsSchemas.IEntry>, 'folder'> & {
    folder: ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>
    fullPath: string
  })[]
> {
  const folderInsideFolder = await pb
    .collection('idea_box__folders')
    .getFullList<ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>>({
      filter: `parent = "${folderId}"`
    })

  const allResults = (
    await pb.collection('idea_box__entries').getFullList<
      Omit<ISchemaWithPB<IdeaBoxCollectionsSchemas.IEntry>, 'folder'> & {
        folder: ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>
        expand?: {
          folder: ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>
        }
      }
    >({
      filter: `(content ~ "${q}" || title ~ "${q}") && container = "${container}" && archived = false ${
        tags
          ? '&& ' +
            tags
              .split(',')
              .map(tag => `tags ~ "${tag}"`)
              .join(' && ')
          : ''
      } && folder = "${folderId}"`,
      expand: 'folder'
    })
  ).map(result => ({ ...result, fullPath: parents }))

  if (folderInsideFolder.length === 0) {
    return allResults
  }

  for (const folder of folderInsideFolder) {
    const results = await recursivelySearchFolder(
      folder.id,
      q,
      container,
      tags,
      req,
      parents + '/' + folder.id,
      pb
    )

    allResults.push(...results)
  }

  for (const result of allResults) {
    if (result.expand?.folder) {
      result.folder = result.expand.folder
      delete result.expand
    }
  }

  return allResults
}

export const search = async (
  pb: PocketBase,
  q: string,
  container: string,
  tags: string,
  folder: string,
  req: Request,
  res: Response
): Promise<
  | (Omit<ISchemaWithPB<IdeaBoxCollectionsSchemas.IEntry>, 'folder'> & {
      folder: ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder>
      fullPath: string
    })[]
  | null
> => {
  if (container) {
    const containerExists = await checkExistence(
      req,
      res,
      'idea_box__containers',
      container,
      false
    )

    if (!containerExists) return null
  }

  const results = await recursivelySearchFolder(
    folder,
    q,
    container,
    tags,
    req,
    '',
    pb
  )

  return results
}
