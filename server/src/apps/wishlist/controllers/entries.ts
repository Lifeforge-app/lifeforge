import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { singleUploadMiddleware } from '@middlewares/uploadMiddleware'
import fs from 'fs'

import { WishlistControllersSchemas } from 'shared/types/controllers'

import * as entriesService from '../services/entries.service'

const getCollectionId = forgeController
  .route('GET /collection-id')
  .description('Get wishlist entries collection ID')
  .schema(WishlistControllersSchemas.Entries.getCollectionId)
  .callback(async ({ pb }) => await entriesService.getCollectionId(pb))

const getEntriesByListId = forgeController
  .route('GET /:id')
  .description('Get wishlist entries by list ID')
  .schema(WishlistControllersSchemas.Entries.getEntriesByListId)
  .existenceCheck('params', {
    id: 'wishlist__lists'
  })
  .callback(
    async ({ pb, params: { id }, query: { bought } }) =>
      await entriesService.getEntriesByListId(pb, id, bought)
  )

const scrapeExternal = forgeController
  .route('POST /external')
  .description('Scrape external website for wishlist entry data')
  .schema(WishlistControllersSchemas.Entries.scrapeExternal)
  .callback(
    async ({ pb, body: { url, provider } }) =>
      await entriesService.scrapeExternal(pb, provider, url)
  )

const createEntry = forgeController
  .route('POST /')
  .description('Create a new wishlist entry')
  .schema(WishlistControllersSchemas.Entries.createEntry)
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

    return await entriesService.createEntry(pb, data)
  })

const updateEntry = forgeController
  .route('PATCH /:id')
  .description('Update an existing wishlist entry')
  .schema(WishlistControllersSchemas.Entries.updateEntry)
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

      const oldEntry = await entriesService.getEntry(pb, id)

      const entry = await entriesService.updateEntry(pb, id, {
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

      return oldEntry.list === list ? entry : 'removed'
    }
  )

const updateEntryBoughtStatus = forgeController
  .route('PATCH /bought/:id')
  .description('Update wishlist entry bought status')
  .schema(WishlistControllersSchemas.Entries.updateEntryBoughtStatus)
  .existenceCheck('params', {
    id: 'wishlist__entries'
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await entriesService.updateEntryBoughtStatus(pb, id)
  )

const deleteEntry = forgeController
  .route('DELETE /:id')
  .description('Delete a wishlist entry')
  .schema(WishlistControllersSchemas.Entries.deleteEntry)
  .existenceCheck('params', {
    id: 'wishlist__entries'
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await entriesService.deleteEntry(pb, id)
  )

export default forgeRouter({
  getCollectionId,
  getEntriesByListId,
  scrapeExternal,
  createEntry,
  updateEntry,
  updateEntryBoughtStatus,
  deleteEntry
})
