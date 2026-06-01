import z from 'zod'

import forge from '../forge'

const VALID_FONT_EXTENSIONS = ['.ttf', '.otf', '.woff', '.woff2']

function isValidFontFile(filename: string): boolean {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'))

  return VALID_FONT_EXTENSIONS.includes(ext)
}

export const list = forge
  .query({
    description: 'List all custom uploaded fonts',
    input: {},
    output: {
      OK: z.array(
        z.object({
          id: z.string(),
          displayName: z.string(),
          family: z.string(),
          weight: z.number(),
          file: z.string(),
          collectionId: z.string()
        })
      )
    }
  })
  .callback(async ({ pb, response }) => {
    const records = await pb.getFullList
      .collection('font_family_upload')
      .execute()

    return response.ok(
      records.map(record => ({
        id: record.id,
        displayName: record.displayName,
        family: record.family,
        weight: record.weight,
        file: record.file,
        collectionId: record.collectionId
      }))
    )
  })

export const get = forge
  .query({
    description: 'Get a specific custom font by ID',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: {
        id: 'font_family_upload'
      }
    },
    output: {
      OK: z.object({
        id: z.string(),
        displayName: z.string(),
        family: z.string(),
        weight: z.number(),
        file: z.string(),
        collectionId: z.string()
      }),
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    const record = await pb.getOne
      .collection('font_family_upload')
      .id(id)
      .execute()

    return response.ok({
      id: record.id,
      displayName: record.displayName,
      family: record.family,
      weight: record.weight,
      file: record.file,
      collectionId: record.collectionId
    })
  })

export const upload = forge
  .mutation({
    description: 'Upload a new custom font',
    input: {
      query: z.object({
        id: z.string().optional()
      }),
      body: z.object({
        displayName: z.string().min(1, 'Display name is required'),
        family: z.string().min(1, 'Font family is required'),
        weight: z.number().min(100).max(900).default(400)
      })
    },
    media: {
      file: {
        optional: false
      }
    },
    existenceCheck: {
      query: {
        id: '[font_family_upload]'
      }
    },
    output: {
      OK: z.object({
        id: z.string(),
        displayName: z.string(),
        family: z.string(),
        weight: z.number(),
        file: z.string(),
        collectionId: z.string()
      }),
      BAD_REQUEST: z.string(),
      NOT_FOUND: true
    }
  })
  .callback(
    async ({
      pb,
      query: { id },
      body: { displayName, family, weight },
      media: { file },
      core: {
        media: { retrieveMedia }
      },
      response
    }) => {
      if (file instanceof File) {
        if (!isValidFontFile(file.name)) {
          return response.badRequest(
            'Invalid file type. Only TTF, OTF, WOFF, and WOFF2 files are allowed.'
          )
        }
      }

      const record = id
        ? await pb.update
            .collection('font_family_upload')
            .id(id)
            .data({
              displayName,
              family,
              weight,
              ...(await retrieveMedia('file', file))
            })
            .execute()
        : await pb.create
            .collection('font_family_upload')
            .data({
              displayName,
              family,
              weight,
              ...(await retrieveMedia('file', file))
            })
            .execute()

      return response.ok({
        id: record.id,
        displayName: record.displayName,
        family: record.family,
        weight: record.weight,
        file: record.file,
        collectionId: record.collectionId
      })
    }
  )

export const remove = forge
  .mutation({
    description: 'Delete a custom font',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('font_family_upload').id(id).execute()

    return response.noContent()
  })
