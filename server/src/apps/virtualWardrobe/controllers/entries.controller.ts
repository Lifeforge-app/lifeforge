import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import { fieldsUploadMiddleware } from '@middlewares/uploadMiddleware'
import express from 'express'
import fs from 'fs'

import { VirtualWardrobeControllersSchemas } from 'shared/types/controllers'

import * as entriesService from '../services/entries.service'
import * as visionService from '../services/vision.service'

const virtualWardrobeEntriesRouter = express.Router()

const getSidebarData = forgeController
  .route('GET /sidebar-data')
  .description('Get sidebar data for virtual wardrobe')
  .schema(VirtualWardrobeControllersSchemas.Entries.getSidebarData)
  .callback(async ({ pb }) => await entriesService.getSidebarData(pb))

const getEntries = forgeController
  .route('GET /')
  .description('Get virtual wardrobe entries with optional filters')
  .schema(VirtualWardrobeControllersSchemas.Entries.getEntries)
  .callback(async ({ pb, query }) => await entriesService.getEntries(pb, query))

const createEntry = forgeController
  .route('POST /')
  .description('Create a new virtual wardrobe entry')
  .schema(VirtualWardrobeControllersSchemas.Entries.createEntry)
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
  .schema(VirtualWardrobeControllersSchemas.Entries.updateEntry)
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
  .schema(VirtualWardrobeControllersSchemas.Entries.deleteEntry)
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
  .schema(VirtualWardrobeControllersSchemas.Entries.toggleFavourite)
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
  .schema(VirtualWardrobeControllersSchemas.Entries.analyzeVision)
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

bulkRegisterControllers(virtualWardrobeEntriesRouter, [
  getSidebarData,
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  toggleFavourite,
  analyzeVision
])

export default virtualWardrobeEntriesRouter
