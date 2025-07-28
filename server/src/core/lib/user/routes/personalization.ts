import { getAPIKey } from '@functions/database'
import getMedia from '@functions/external/media'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import { z } from 'zod/v4'

const listGoogleFonts = forgeController.query
  .description('List available Google Fonts')
  .input({})
  .callback(async ({ pb }) => {
    const key = await getAPIKey('gcloud', pb)

    if (!key) {
      return {
        enabled: false,
        items: []
      }
    }

    const target = `https://www.googleapis.com/webfonts/v1/webfonts?key=${key}`

    const response = await fetch(target)

    const data = await response.json()

    return {
      enabled: true,
      items: data.items as any[]
    }
  })

const getGoogleFont = forgeController.query
  .description('Get specific Google Font details')
  .input({
    query: z.object({
      family: z.string()
    })
  })
  .callback(async ({ pb, query: { family } }) => {
    const key = await getAPIKey('gcloud', pb)

    if (!key) {
      return {
        enabled: false
      }
    }

    const target = `https://www.googleapis.com/webfonts/v1/webfonts?family=${encodeURIComponent(family)}&key=${key}`

    const response = await fetch(target)

    const data = await response.json()

    return {
      enabled: true,
      items: data.items
    }
  })

const updateBgImage = forgeController.mutation
  .description('Update background image')
  .input({})
  .media({
    file: {
      optional: false
    }
  })
  .callback(async ({ pb, media: { file } }) => {
    const newRecord = await pb.update
      .collection('users__users')
      .id(pb.instance.authStore.record!.id)
      .data(await getMedia('bgImage', file))
      .execute()

    return `${newRecord.collectionId}/${newRecord.id}/${newRecord.bgImage}`
  })

const deleteBgImage = forgeController.mutation
  .description('Delete background image')
  .input({})
  .statusCode(204)
  .callback(({ pb }) =>
    pb.update
      .collection('users__users')
      .id(pb.instance.authStore.record!.id)
      .data({
        bgImage: null
      })
      .execute()
  )

const updatePersonalization = forgeController.mutation
  .description('Update personalization settings')
  .input({
    body: z.object({
      data: z.object({
        fontFamily: z.string().optional(),
        theme: z.string().optional(),
        color: z.string().optional(),
        bgTemp: z.string().optional(),
        language: z.string().optional(),
        dashboardLayout: z.record(z.string(), z.any()).optional(),
        backdropFilters: z.record(z.string(), z.any()).optional()
      })
    })
  })
  .statusCode(204)
  .callback(async ({ pb, body: { data } }) => {
    const toBeUpdated: { [key: string]: unknown } = {}

    for (const item of [
      'fontFamily',
      'theme',
      'color',
      'bgTemp',
      'language',
      'dashboardLayout',
      'backdropFilters'
    ]) {
      if (data[item as keyof typeof data]) {
        toBeUpdated[item] = data[item as keyof typeof data]
      }
    }

    if (!Object.keys(toBeUpdated).length) {
      throw new ClientError('No data to update')
    }

    await pb.update
      .collection('users__users')
      .id(pb.instance.authStore.record!.id)
      .data(toBeUpdated)
      .execute()
  })

export default forgeRouter({
  listGoogleFonts,
  getGoogleFont,
  updateBgImage,
  deleteBgImage,
  updatePersonalization
})
