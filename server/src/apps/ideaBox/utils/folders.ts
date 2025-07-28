import { PBService } from '@functions/database'

export const validateFolderPath = async (
  pb: PBService,
  container: string,
  path: string[]
): Promise<{ folderExists: boolean; lastFolder: string }> => {
  let folderExists = true
  let lastFolder = ''

  for (const folder of path) {
    if (!folder) continue

    try {
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
    } catch {
      folderExists = false
      break
    }
  }

  return { folderExists, lastFolder }
}

export async function recursivelySearchFolder(
  folderId: string,
  q: string,
  container: string,
  tags: string = '',
  parents: string,
  pb: PBService
) {
  const folderInsideFolder = await pb.getFullList
    .collection('idea_box__folders')
    .filter([
      {
        field: 'parent',
        operator: '=',
        value: folderId
      }
    ])
    .execute()

  const allResults = (
    await pb.getFullList
      .collection('idea_box__entries_text')
      .expand({ base_entry: 'idea_box__entries' })
      .filter([
        {
          combination: '||',
          filters: [
            {
              field: 'content',
              operator: '~',
              value: q
            }
          ]
        },
        {
          field: 'base_entry.container',
          operator: '=',
          value: container
        },
        {
          field: 'base_entry.archived',
          operator: '=',
          value: false
        },
        {
          field: 'base_entry.folder',
          operator: '=',
          value: folderId
        },
        ...(tags
          ? tags.split(',').map(
              tag =>
                ({
                  field: 'base_entry.tags',
                  operator: '~',
                  value: tag
                }) as const
            )
          : [])
      ])
      .execute()
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
      parents + '/' + folder.id,
      pb
    )

    allResults.push(...results)
  }

  return allResults
}
