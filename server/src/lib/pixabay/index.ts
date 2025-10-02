import { getAPIKey } from '@functions/database'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import { z } from 'zod'

const verifyAPIKey = forgeController
  .query()
  .description('Check if Pixabay API key exists')
  .input({})
  .callback(async ({ pb }) => !!(await getAPIKey('pixabay', pb)))

const searchImages = forgeController
  .query()
  .description('Search images on Pixabay')
  .input({
    query: z.object({
      q: z.string().min(1),
      page: z
        .string()
        .optional()
        .default('1')
        .transform(val => parseInt(val, 10) || 1),
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
      editors_choice: z
        .enum(['true', 'false'])
        .default('false')
        .transform(val => val === 'true')
    })
  })
  .callback(
    async ({
      query: { q, page, type, category, colors, editors_choice },
      pb
    }) => {
      const key = await getAPIKey('pixabay', pb)

      if (!key) {
        throw new ClientError('Pixabay API key is not set')
      }

      const url = new URL('https://pixabay.com/api/')

      url.searchParams.append('key', key)
      url.searchParams.append('q', q)
      url.searchParams.append('page', page.toString())
      url.searchParams.append('image_type', type)

      if (category) {
        url.searchParams.append('category', category)
      }

      if (colors) {
        url.searchParams.append('colors', colors)
      }
      url.searchParams.append('editors_choice', editors_choice.toString())

      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error(
          `Pixabay API request failed with status ${response.status}`
        )
      }

      const data = await response.json()

      return {
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
      }
    }
  )

export default forgeRouter({ verifyAPIKey, searchImages })
