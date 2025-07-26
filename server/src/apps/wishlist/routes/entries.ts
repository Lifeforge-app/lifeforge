import { forgeController, forgeRouter } from '@functions/routes'
import { singleUploadMiddleware } from '@middlewares/uploadMiddleware'
import fs from 'fs'
import { z } from 'zod/v4'

import scrapeProviders from '../helpers/scrapers'

const listByListId = forgeController.query
  .description('Get wishlist entries by list ID')
  .input({
    query: z.object({
      id: z.string(),
      bought: z
        .string()
        .optional()
        .transform(val => val === 'true')
    })
  })
  .existenceCheck('query', {
    id: 'wishlist__lists'
  })
  .callback(async ({ pb, query: { id, bought } }) =>
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

const scrapeExternal = forgeController.mutation
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

const create = forgeController.mutation
  .description('Create a new wishlist entry')
  .input({
    body: z.object({
      name: z.string(),
      url: z.string(),
      price: z.string().transform(val => parseFloat(val) || 0 || 0),
      list: z.string(),
      image: z.union([z.string(), z.file()]).optional()
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

const update = forgeController.mutation
  .description('Update an existing wishlist entry')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: z.object({
      name: z.string(),
      url: z.string(),
      price: z.string().transform(val => parseFloat(val) || 0 || 0),
      list: z.string(),
      image: z.union([z.string(), z.file()]).optional()
    })
  })
  .middlewares(singleUploadMiddleware)
  .existenceCheck('query', {
    id: 'wishlist__entries'
  })
  .existenceCheck('body', {
    list: 'wishlist__lists'
  })
  .callback(
    async ({
      pb,
      query: { id },
      body: { list, name, url, price, image },
      req
    }) => {
      const { file } = req

      let finalFile: null | File = null

      if (image === 'removed') {
        finalFile = null
      }

      if (file) {
        const fileBuffer = fs.readFileSync(file.path)

        finalFile = new File([fileBuffer], file.originalname)
        fs.unlinkSync(file.path)
      }

      return await pb.update
        .collection('wishlist__entries')
        .id(id)
        .data({
          list,
          name,
          url,
          price,
          ...(image === 'removed' || finalFile
            ? {
                image: finalFile
              }
            : {})
        })
        .execute()
    }
  )

const updateBoughtStatus = forgeController.mutation
  .description('Update wishlist entry bought status')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'wishlist__entries'
  })
  .callback(async ({ pb, query: { id } }) => {
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

const remove = forgeController.mutation
  .description('Delete a wishlist entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'wishlist__entries'
  })
  .statusCode(204)
  .callback(
    async ({ pb, query: { id } }) =>
      await pb.delete.collection('wishlist__entries').id(id).execute()
  )

export default forgeRouter({
  listByListId,
  scrapeExternal,
  create,
  update,
  updateBoughtStatus,
  remove
})
