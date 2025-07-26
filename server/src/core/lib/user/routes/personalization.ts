import { getAPIKey } from '@functions/database'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import { singleUploadMiddleware } from '@middlewares/uploadMiddleware'
import fs from 'fs'
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
  .input({
    body: z.object({
      url: z.string().optional()
    })
  })
  .middlewares(singleUploadMiddleware)
  .callback(async ({ pb, body: { url }, req }) => {
    let targetFile: File

    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path)

      targetFile = new File(
        [fileBuffer],
        `bgImage.${req.file.originalname.split('.').pop()}`
      )

      fs.unlinkSync(req.file.path)
    }

    if (!url) {
      throw new ClientError('No file uploaded')
    }

    try {
      const response = await fetch(url)

      const fileBuffer = await response.arrayBuffer()

      targetFile = new File([new Uint8Array(fileBuffer)], `bgImage.png`)
    } catch {
      throw new Error('Invalid file')
    }

    await pb.update
      .collection('users__users')
      .id(pb.instance.authStore.record!.id)
      .data({
        bgImage: targetFile
      })
      .execute()
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
