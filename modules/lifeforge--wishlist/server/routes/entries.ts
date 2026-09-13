import z from 'zod'

import forge from '../forge'
import scrapeProviders from '../helpers/scrapers'
import wishlistSchemas from '../schema'

export const listByListId = forge
  .query({
    description: 'Get wishlist entries by list ID',
    input: {
      query: z.object({
        id: z.string(),
        bought: z
          .string()
          .optional()
          .transform(val => val === 'true')
      })
    },
    existenceCheck: {
      query: { id: 'wishlist__lists' }
    },
    output: {
      OK: z.array(wishlistSchemas.entries.schema)
    }
  })
  .callback(async ({ pb, query: { id, bought }, response }) =>
    response.ok(
      await pb.getFullList
        .collection('wishlist__entries')
        .filter([
          {
            field: 'list',
            operator: '=',
            value: id
          },
          {
            field: 'bought',
            operator: '=',
            value: bought
          }
        ])
        .execute()
    )
  )

export const scrapeExternal = forge
  .mutation({
    description: 'Scrape external website for wishlist entry data',
    input: {
      body: z.object({
        url: z.string(),
        provider: z.string()
      })
    },
    output: {
      OK: z.any()
    }
  })
  .callback(async ({ pb, body: { url, provider }, core, response }) => {
    const result = await scrapeProviders[
      provider as keyof typeof scrapeProviders
    ]?.(pb, url, core)

    if (!result) {
      throw new Error('Error scraping provider')
    }

    return response.ok(result)
  })

export const create = forge
  .mutation({
    description: 'Create a new wishlist entry',
    input: {
      body: z.object({
        name: z.string(),
        url: z.string(),
        price: z.number().min(0),
        list: z.string()
      })
    },
    media: {
      image: {
        optional: true
      }
    },
    existenceCheck: {
      body: { list: 'wishlist__lists' }
    },
    output: {
      CREATED: wishlistSchemas.entries.schema
    }
  })
  .callback(
    async ({
      pb,
      body,
      media: { image },
      core: {
        media: { retrieveMedia }
      },
      response
    }) => {
      const imageData = await retrieveMedia('image', image)

      return response.created(
        await pb.create
          .collection('wishlist__entries')
          .data({
            ...body,
            bought: false,
            ...imageData
          })
          .execute()
      )
    }
  )

export const update = forge
  .mutation({
    description: 'Update an existing wishlist entry',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: z.object({
        name: z.string(),
        url: z.string(),
        price: z.number().min(0),
        list: z.string()
      })
    },
    media: {
      image: {
        optional: true
      }
    },
    existenceCheck: {
      query: { id: 'wishlist__entries' },
      body: { list: 'wishlist__lists' }
    },
    output: {
      OK: wishlistSchemas.entries.schema
    }
  })
  .callback(
    async ({
      pb,
      query: { id },
      body: { list, name, url, price },
      media: { image },
      core: {
        media: { retrieveMedia }
      },
      response
    }) => {
      const imageData = await retrieveMedia('image', image)

      return response.ok(
        await pb.update
          .collection('wishlist__entries')
          .id(id)
          .data({
            list,
            name,
            url,
            price,
            ...imageData
          })
          .execute()
      )
    }
  )

export const updateBoughtStatus = forge
  .mutation({
    description: 'Update wishlist entry bought status',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'wishlist__entries' }
    },
    output: {
      OK: wishlistSchemas.entries.schema
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    const oldEntry = await pb.getOne
      .collection('wishlist__entries')
      .id(id)
      .execute()

    return response.ok(
      await pb.update
        .collection('wishlist__entries')
        .id(id)
        .data({
          bought: !oldEntry.bought,
          bought_at: oldEntry.bought ? null : new Date().toISOString()
        })
        .execute()
    )
  })

export const remove = forge
  .mutation({
    description: 'Delete a wishlist entry',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'wishlist__entries' }
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('wishlist__entries').id(id).execute()

    return response.noContent()
  })
