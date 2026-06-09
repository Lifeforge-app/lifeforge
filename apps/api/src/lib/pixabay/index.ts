import z from 'zod'

import { createForge, forgeRouter } from '@lifeforge/server-utils'

const forge = createForge({}, 'pixabay')

const searchImages = forge
  .query({
    description: 'Search for images on Pixabay',
    input: {
      query: z.object({
        q: z.string().min(1),
        page: z.string().optional().default('1'),
        type: z.enum(['all', 'photo', 'illustration', 'vector']).default('all'),
        category: z
          .enum([
            'backgrounds',
            'fashion',
            'nature',
            'science',
            'education',
            'feelings',
            'health',
            'people',
            'religion',
            'places',
            'animals',
            'industry',
            'computer',
            'food',
            'sports',
            'transportation',
            'travel',
            'buildings',
            'business',
            'music'
          ])
          .optional(),
        colors: z
          .enum([
            'grayscale',
            'transparent',
            'red',
            'orange',
            'yellow',
            'green',
            'turquoise',
            'blue',
            'lilac',
            'pink',
            'white',
            'gray',
            'black',
            'brown'
          ])
          .optional()
          .nullable(),
        editors_choice: z.enum(['true', 'false']).default('false')
      })
    },
    output: {
      OK: z.object({
        total: z.number(),
        hits: z.array(
          z.object({
            id: z.string(),
            thumbnail: z.object({
              url: z.string(),
              width: z.number(),
              height: z.number()
            }),
            imageURL: z.string()
          })
        )
      }),
      BAD_REQUEST: z.string()
    }
  })
  .callback(
    async ({
      query: { q, page, type, category, colors, editors_choice },
      pb,
      core: {
        api: { getAPIKey }
      },
      response
    }) => {
      const key = await getAPIKey('pixabay', pb)

      if (!key) {
        return response.badRequest('Pixabay API key is not set')
      }

      const url = new URL('https://pixabay.com/api/')

      url.searchParams.append('key', key)
      url.searchParams.append('q', q)
      url.searchParams.append('page', page)
      url.searchParams.append('image_type', type)

      if (category) {
        url.searchParams.append('category', category)
      }

      if (colors) {
        url.searchParams.append('colors', colors)
      }
      url.searchParams.append('editors_choice', editors_choice)

      const r = await fetch(url.toString())

      if (!r.ok) {
        return response.badRequest(
          `Pixabay API request failed with status ${r.status}`
        )
      }

      const data = await r.json()

      return response.ok({
        total: data.totalHits,
        hits: data.hits.map((hit: any) => ({
          id: hit.id,
          thumbnail: {
            url: hit.webformatURL,
            width: hit.webformatWidth,
            height: hit.webformatHeight
          },
          imageURL: hit.largeImageURL
        }))
      })
    }
  )

export default forgeRouter({ searchImages })
