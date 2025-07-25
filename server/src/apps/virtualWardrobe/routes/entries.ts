import { FilterType } from '@functions/database/PBService/typescript/pb_service'
import { forgeController, forgeRouter } from '@functions/routes'
import { fieldsUploadMiddleware } from '@middlewares/uploadMiddleware'
import fs from 'fs'
import { z } from 'zod/v4'

import { analyzeClothingImages } from '../utils/vision'

const sidebarData = forgeController.query
  .description('Get sidebar data for virtual wardrobe')
  .input({})
  .callback(async ({ pb }) => {
    const allEntries = await pb.getFullList
      .collection('virtual_wardrobe__entries')
      .execute()

    const categories = allEntries.reduce(
      (acc, curr) => {
        if (!acc[curr.category]) {
          acc[curr.category] = 0
        }
        acc[curr.category]++

        return acc
      },
      {} as Record<string, number>
    )

    const subcategories = allEntries.reduce(
      (acc, curr) => {
        if (!acc[curr.subcategory]) {
          acc[curr.subcategory] = 0
        }
        acc[curr.subcategory]++

        return acc
      },
      {} as Record<string, number>
    )

    const brands = allEntries.reduce(
      (acc, curr) => {
        if (!acc[curr.brand]) {
          acc[curr.brand] = 0
        }
        acc[curr.brand]++

        return acc
      },
      {} as Record<string, number>
    )

    const sizes = allEntries.reduce(
      (acc, curr) => {
        if (!acc[curr.size]) {
          acc[curr.size] = 0
        }
        acc[curr.size]++

        return acc
      },
      {} as Record<string, number>
    )

    const colors = allEntries.reduce(
      (acc, curr) => {
        curr.colors.forEach((color: string) => {
          if (!acc[color]) {
            acc[color] = 0
          }
          acc[color]++
        })

        return acc
      },
      {} as Record<string, number>
    )

    return {
      total: allEntries.length,
      favourites: allEntries.filter(entry => entry.is_favourite).length,
      categories,
      subcategories,
      brands,
      sizes,
      colors
    }
  })

const list = forgeController.query
  .description('Get virtual wardrobe entries with optional filters')
  .input({
    query: z.object({
      category: z.string().optional(),
      subcategory: z.string().optional(),
      brand: z.string().optional(),
      size: z.string().optional(),
      color: z.string().optional(),
      favourite: z
        .string()
        .optional()
        .transform(val => val === 'true'),
      q: z.string().optional()
    })
  })
  .callback(
    async ({
      pb,
      query: { category, subcategory, brand, size, color, favourite, q }
    }) => {
      const filterArray = [
        ...(category
          ? [
              {
                field: 'category',
                operator: '=',
                value: category
              }
            ]
          : []),
        ...(subcategory
          ? [
              {
                field: 'subcategory',
                operator: '=',
                value: subcategory
              }
            ]
          : []),
        ...(brand
          ? [
              {
                field: 'brand',
                operator: '=',
                value: brand
              }
            ]
          : []),
        ...(size
          ? [
              {
                field: 'size',
                operator: '=',
                value: size
              }
            ]
          : []),
        ...(color
          ? [
              {
                field: 'colors',
                operator: '~',
                value: color
              }
            ]
          : []),
        ...(favourite
          ? [
              {
                field: 'is_favourite',
                operator: '=',
                value: favourite
              }
            ]
          : []),
        ...(q
          ? [
              {
                combination: '||',
                filters: [
                  { field: 'name', operator: '~', value: q },
                  { field: 'brand', operator: '~', value: q },
                  { field: 'notes', operator: '~', value: q }
                ]
              }
            ]
          : [])
      ]

      const entries = await pb.getFullList
        .collection('virtual_wardrobe__entries')
        .filter(filterArray as FilterType<'virtual_wardrobe__entries'>)
        .sort(['-is_favourite', 'category', 'subcategory', 'brand', 'name'])
        .execute()

      return entries
    }
  )

const create = forgeController.mutation
  .description('Create a new virtual wardrobe entry')
  .input({
    body: z.object({
      name: z.string(),
      category: z.string(),
      subcategory: z.string(),
      brand: z.string(),
      size: z.string(),
      colors: z.array(z.string()),
      price: z.string().transform(val => parseFloat(val)),
      notes: z.string()
    })
  })
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

      return await pb.create
        .collection('virtual_wardrobe__entries')
        .data({
          ...body,
          front_image: new File([frontImageBuffer], frontImage.originalname),
          back_image: new File([backImageBuffer], backImage.originalname)
        })
        .execute()
    } finally {
      if (frontImage?.path) fs.unlinkSync(frontImage.path)
      if (backImage?.path) fs.unlinkSync(backImage.path)
    }
  })

const update = forgeController.mutation
  .description('Update an existing virtual wardrobe entry')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: z.object({
      name: z.string().optional(),
      category: z.string().optional(),
      subcategory: z.string().optional(),
      brand: z.string().optional(),
      size: z.string().optional(),
      colors: z.array(z.string()).optional(),
      price: z.number().optional(),
      notes: z.string().optional()
    })
  })
  .existenceCheck('query', {
    id: 'virtual_wardrobe__entries'
  })
  .callback(({ pb, query: { id }, body }) => {
    return pb.update
      .collection('virtual_wardrobe__entries')
      .id(id)
      .data(body)
      .execute()
  })

const remove = forgeController.mutation
  .description('Delete a virtual wardrobe entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'virtual_wardrobe__entries'
  })
  .statusCode(204)
  .callback(({ pb, query: { id } }) =>
    pb.delete.collection('virtual_wardrobe__entries').id(id).execute()
  )

const toggleFavourite = forgeController.mutation
  .description('Toggle favourite status of a virtual wardrobe entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'virtual_wardrobe__entries'
  })
  .callback(async ({ pb, query: { id } }) => {
    const entry = await pb.getOne
      .collection('virtual_wardrobe__entries')
      .id(id)
      .execute()

    return await pb.update
      .collection('virtual_wardrobe__entries')
      .id(id)
      .data({
        is_favourite: !entry.is_favourite
      })
      .execute()
  })

const analyzeVision = forgeController.mutation
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
      const result = await analyzeClothingImages(
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
  sidebarData,
  list,
  create,
  update,
  remove,
  toggleFavourite,
  analyzeVision
})
