import { forgeController, forgeRouter } from '@functions/routes'
import { singleUploadMiddleware } from '@middlewares/uploadMiddleware'
import fs from 'fs'
import { z } from 'zod/v4'

import scrapeProviders from '../helpers/scrapers'

const getEntriesByListId = forgeController
  .route('GET /:id')
  .description('Get wishlist entries by list ID')
  .input({
    params: z.object({
      id: z.string()
    }),
    query: z.object({
      bought: z
        .string()
        .optional()
        .transform(val => val === 'true')
    })
  })
  .existenceCheck('params', {
    id: 'wishlist__lists'
  })
  .callback(async ({ pb, params: { id }, query: { bought } }) =>
    pb.getFullList
      .collection('wishlist__entries')
      .filter([
        {
          field: 'list',
          operator: '=',
          value: id
        },
        ...(bought
          ? ([
              {
                field: 'bought',
                operator: '=',
                value: bought
              }
            ] as const)
          : [])
      ])
      .execute()
  )

const scrapeExternal = forgeController
  .route('POST /external')
  .description('Scrape external website for wishlist entry data')
  .input({
    body: z.object({
      url: z.string(),
      provider: z.string()
    })
  })
  .callback(async ({ pb, body: { url, provider } }) => {
    const result = await scrapeProviders[
      provider as keyof typeof scrapeProviders
    ]?.(pb, url)

    if (!result) {
      throw new Error('Error scraping provider')
    }

    return result
  })

const createEntry = forgeController
  .route('POST /')
  .description('Create a new wishlist entry')
  .input({
    body: z.object({
      name: z.string(),
      url: z.string(),
      price: z.string().transform(val => parseFloat(val) || 0 || 0),
      list: z.string(),
      image: z.any().optional()
    })
  })
  .middlewares(singleUploadMiddleware)
  .existenceCheck('body', {
    list: 'wishlist__lists'
  })
  .statusCode(201)
  .callback(async ({ pb, body, req }) => {
    const { file } = req

    let imageFile: File | undefined

    if (file) {
      const fileBuffer = fs.readFileSync(file.path)

      imageFile = new File([fileBuffer], file.originalname)
      fs.unlinkSync(file.path)
    } else if (typeof body.image === 'string' && body.image) {
      const response = await fetch(body.image)

      const buffer = await response.arrayBuffer()

      imageFile = new File([buffer], 'image.jpg')
    }

    const data = {
      ...body,
      bought: false,
      image: imageFile
    }

    return await pb.create.collection('wishlist__entries').data(data).execute()
  })

const updateEntry = forgeController
  .route('PATCH /:id')
  .description('Update an existing wishlist entry')
  .input({
    params: z.object({
      id: z.string()
    }),
    body: z.object({
      name: z.string(),
      url: z.string(),
      price: z.string().transform(val => parseFloat(val) || 0 || 0),
      list: z.string(),
      imageRemoved: z.string().optional()
    })
  })
  .middlewares(singleUploadMiddleware)
  .existenceCheck('params', {
    id: 'wishlist__entries'
  })
  .existenceCheck('body', {
    list: 'wishlist__lists'
  })
  .callback(
    async ({
      pb,
      params: { id },
      body: { list, name, url, price, imageRemoved },
      req
    }) => {
      const { file } = req

      let finalFile: null | File = null

      if (imageRemoved === 'true') {
        finalFile = null
      }

      if (file) {
        const fileBuffer = fs.readFileSync(file.path)

        finalFile = new File([fileBuffer], file.originalname)
        fs.unlinkSync(file.path)
      }

      const oldEntry = await pb.getOne
        .collection('wishlist__entries')
        .id(id)
        .execute()

      const entry = await pb.update
        .collection('wishlist__entries')
        .id(id)
        .data({
          list,
          name,
          url,
          price,
          ...(imageRemoved === 'true' || finalFile
            ? {
                image: finalFile
              }
            : {})
        })
        .execute()

      return oldEntry.list === list ? entry : 'removed'
    }
  )

const updateEntryBoughtStatus = forgeController
  .route('PATCH /bought/:id')
  .description('Update wishlist entry bought status')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'wishlist__entries'
  })
  .callback(async ({ pb, params: { id } }) => {
    const oldEntry = await pb.getOne
      .collection('wishlist__entries')
      .id(id)
      .execute()

    return await pb.update
      .collection('wishlist__entries')
      .id(id)
      .data({
        bought: !oldEntry.bought,
        bought_at: oldEntry.bought ? null : new Date().toISOString()
      })
      .execute()
  })

const deleteEntry = forgeController
  .route('DELETE /:id')
  .description('Delete a wishlist entry')
  .input({
    params: z.object({
      id: z.string()
    })
  })
  .existenceCheck('params', {
    id: 'wishlist__entries'
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) =>
      await pb.delete.collection('wishlist__entries').id(id).execute()
  )

export default forgeRouter({
  getEntriesByListId,
  scrapeExternal,
  createEntry,
  updateEntry,
  updateEntryBoughtStatus,
  deleteEntry
})
