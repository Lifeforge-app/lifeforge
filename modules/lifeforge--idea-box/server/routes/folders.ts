import z from 'zod'

import forge from '../forge'
import ideaBoxSchemas from '../schema'
import { validateFolderPath } from '../utils/folders'

export const list = forge
  .query({
    description: 'Get all folders in a path',
    input: {
      query: z.object({
        container: z.string(),
        path: z.string()
      })
    },
    existenceCheck: {
      query: { container: 'containers' }
    },
    output: {
      OK: z.array(ideaBoxSchemas.folders),
      BAD_REQUEST: z.string(),
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { container, path }, response }) => {
    const pathSegments = path.split('/').filter(p => p !== '')

    const { folderExists } = await validateFolderPath(
      pb,
      container,
      pathSegments
    )

    if (!folderExists) {
      return response.badRequest(
        `Folder with path "${path}" does not exist in container "${container}"`
      )
    }

    const lastFolder =
      pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : ''

    return response.ok(
      await pb.getFullList
        .collection('folders')
        .filter([
          {
            field: 'container',
            operator: '=',
            value: container
          },
          {
            field: 'parent',
            operator: '=',
            value: lastFolder
          }
        ])
        .sort(['name'])
        .execute()
    )
  })

export const create = forge
  .mutation({
    description: 'Create a new folder',
    input: {
      body: ideaBoxSchemas.folders
    },
    existenceCheck: {
      body: {
        container: 'containers',
        parent: '[folders]'
      }
    },
    output: {
      CREATED: ideaBoxSchemas.folders,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, body, response }) =>
    response.created(await pb.create.collection('folders').data(body).execute())
  )

export const update = forge
  .mutation({
    description: 'Update folder details',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: ideaBoxSchemas.folders.omit({
        container: true,
        parent: true
      })
    },
    existenceCheck: {
      query: { id: 'folders' }
    },
    output: {
      OK: ideaBoxSchemas.folders,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) =>
    response.ok(
      await pb.update.collection('folders').id(id).data(body).execute()
    )
  )

export const moveTo = forge
  .mutation({
    description: 'Move folder to another parent',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: z.object({
        target: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'folders' },
      body: { target: 'folders' }
    },
    output: {
      OK: ideaBoxSchemas.folders,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body: { target }, response }) =>
    response.ok(
      await pb.update
        .collection('folders')
        .id(id)
        .data({
          parent: target
        })
        .execute()
    )
  )

export const removeFromParent = forge
  .mutation({
    description: 'Move folder to parent folder',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'folders' }
    },
    output: {
      OK: ideaBoxSchemas.folders,
      BAD_REQUEST: z.string(),
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    const currentFolder = await pb.getOne.collection('folders').id(id).execute()

    if (!currentFolder.parent) {
      return response.badRequest('Folder is already at root level')
    }

    const parentFolder = await pb.getOne
      .collection('folders')
      .id(currentFolder.parent)
      .execute()

    return response.ok(
      await pb.update
        .collection('folders')
        .id(id)
        .data({
          parent: parentFolder.parent || null
        })
        .execute()
    )
  })

export const remove = forge
  .mutation({
    description: 'Delete a folder',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'folders' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('folders').id(id).execute()

    return response.noContent()
  })
