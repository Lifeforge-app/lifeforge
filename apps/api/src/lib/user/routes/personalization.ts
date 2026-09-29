import z from 'zod'

import forge from '../forge'

export const updateBgImage = forge
  .mutation({
    description: 'Upload new background image',
    input: {},
    media: {
      file: {
        optional: false
      }
    },
    output: {
      OK: z.object({
        collectionId: z.string(),
        recordId: z.string(),
        fieldId: z.string()
      })
    }
  })
  .callback(
    async ({
      pb,
      media: { file },
      core: {
        media: { retrieveMedia }
      },
      response
    }) => {
      const userRecord = await pb.getFirstListItem.collection('users').execute()

      const newRecord = await pb.update
        .collection('users')
        .id(userRecord.id)
        .data({
          ...(await retrieveMedia('bgImage', file)),
          backdropFilters: {
            brightness: 100,
            blur: 'none',
            contrast: 100,
            saturation: 100,
            overlayOpacity: 50
          }
        })
        .execute()

      return response.ok({
        collectionId: newRecord.collectionId,
        recordId: newRecord.id,
        fieldId: newRecord.bgImage
      })
    }
  )

export const deleteBgImage = forge
  .mutation({
    description: 'Remove background image',
    input: {},
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ pb, response }) => {
    const userRecord = await pb.getFirstListItem.collection('users').execute()

    await pb.update
      .collection('users')
      .id(userRecord.id)
      .data({
        bgImage: null
      })
      .execute()

    return response.noContent()
  })

export const updatePersonalization = forge
  .mutation({
    description: 'Update user personalization preferences',
    input: {
      body: z.object({
        data: z.object({
          fontFamily: z.string().optional(),
          theme: z.string().optional(),
          color: z.string().optional(),
          bgTemp: z.string().optional(),
          language: z.string().optional(),
          fontScale: z.number().optional(),
          borderRadiusMultiplier: z.number().optional(),
          bordered: z.boolean().optional(),
          dashboardLayout: z.record(z.string(), z.any()).optional(),
          backdropFilters: z.record(z.string(), z.any()).optional()
        })
      })
    },
    output: {
      NO_CONTENT: true,
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ pb, body: { data }, response }) => {
    const toBeUpdated: { [key: string]: unknown } = {}

    for (const item of [
      'fontFamily',
      'theme',
      'color',
      'bgTemp',
      'language',
      'fontScale',
      'borderRadiusMultiplier',
      'bordered',
      'dashboardLayout',
      'backdropFilters'
    ]) {
      if (data[item as keyof typeof data] !== undefined) {
        toBeUpdated[item] = data[item as keyof typeof data]
      }
    }

    if (!Object.keys(toBeUpdated).length) {
      return response.badRequest('No data to update')
    }

    const userRecord = await pb.getFirstListItem.collection('users').execute()

    await pb.update
      .collection('users')
      .id(userRecord.id)
      .data(toBeUpdated)
      .execute()

    return response.noContent()
  })
