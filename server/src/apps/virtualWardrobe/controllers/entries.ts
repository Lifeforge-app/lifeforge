import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { fieldsUploadMiddleware } from '@middlewares/uploadMiddleware'
import fs from 'fs'

import * as entriesService from '../services/entries.service'
import * as visionService from '../services/vision.service'

const getSidebarData = forgeController
  .route('GET /sidebar-data')
  .description('Get sidebar data for virtual wardrobe')
  .input({})
  .callback(async ({ pb }) => await entriesService.getSidebarData(pb))

const getEntries = forgeController
  .route('GET /')
  .description('Get virtual wardrobe entries with optional filters')
  .input({})
  .callback(async ({ pb, query }) => await entriesService.getEntries(pb, query))

const createEntry = forgeController
  .route('POST /')
  .description('Create a new virtual wardrobe entry')
  .input({})
  .middlewares(
    fieldsUploadMiddleware.bind({
      fields: [
        {
          name: 'backImage',
          maxCount: 1
        },
        {
          name: 'frontImage',
          maxCount: 1
        }
      ]
    })
  )
  .statusCode(201)
  .callback(async ({ pb, body, req }) => {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[]
    }

    const {
      backImage: [backImage],
      frontImage: [frontImage]
    } = files

    if (!frontImage || !backImage) {
      throw new Error('Both front and back images are required')
    }

    try {
      const frontImageBuffer = fs.readFileSync(frontImage.path)

      const backImageBuffer = fs.readFileSync(backImage.path)

      const result = await entriesService.createEntry(pb, {
        ...body,
        front_image: new File([frontImageBuffer], frontImage.originalname),
        back_image: new File([backImageBuffer], backImage.originalname)
      })

      return result
    } finally {
      // Clean up uploaded files
      if (frontImage?.path) fs.unlinkSync(frontImage.path)
      if (backImage?.path) fs.unlinkSync(backImage.path)
    }
  })

const updateEntry = forgeController
  .route('PATCH /:id')
  .description('Update an existing virtual wardrobe entry')
  .input({})
  .existenceCheck('params', {
    id: 'virtual_wardrobe__entries'
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await entriesService.updateEntry(pb, id, body)
  )

const deleteEntry = forgeController
  .route('DELETE /:id')
  .description('Delete a virtual wardrobe entry')
  .input({})
  .existenceCheck('params', {
    id: 'virtual_wardrobe__entries'
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await entriesService.deleteEntry(pb, id)
  )

const toggleFavourite = forgeController
  .route('PATCH /favourite/:id')
  .description('Toggle favourite status of a virtual wardrobe entry')
  .input({})
  .existenceCheck('params', {
    id: 'virtual_wardrobe__entries'
  })
  .callback(
    async ({ pb, params: { id } }) =>
      await entriesService.toggleFavourite(pb, id)
  )

const analyzeVision = forgeController
  .route('POST /vision')
  .description('Analyze clothing images using AI vision')
  .input({})
  .middlewares(
    fieldsUploadMiddleware.bind({
      fields: [
        {
          name: 'frontImage',
          maxCount: 1
        },
        {
          name: 'backImage',
          maxCount: 1
        }
      ]
    })
  )
  .callback(async ({ pb, req }) => {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[]
    }

    const {
      frontImage: [frontImage],
      backImage: [backImage]
    } = files

    if (!frontImage || !backImage) {
      throw new Error('Both front and back images are required')
    }

    try {
      const result = await visionService.analyzeClothingImages(
        pb,
        frontImage.path,
        backImage.path
      )

      return result
    } finally {
      // Clean up uploaded files
      if (frontImage?.path) fs.unlinkSync(frontImage.path)
      if (backImage?.path) fs.unlinkSync(backImage.path)
    }
  })

export default forgeRouter({
  getSidebarData,
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  toggleFavourite,
  analyzeVision
})
