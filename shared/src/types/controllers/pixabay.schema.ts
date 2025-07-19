import { z } from 'zod/v4'

import { PixabayCustomSchemas } from '../collections'
import type { InferApiESchemaDynamic } from '../utils/inferSchema'

const Pixabay = {
  /**
   * @route       GET /key-exists
   * @description Check if Pixabay API key exists
   */
  checkKeyExists: {
    response: z.boolean()
  },

  /**
   * @route       GET /search
   * @description Search images on Pixabay
   */
  searchImages: {
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
    }),
    response: PixabayCustomSchemas.PixabaySearchResultSchema
  }
}

type IPixabay = InferApiESchemaDynamic<typeof Pixabay>

export type { IPixabay }

export { Pixabay }
