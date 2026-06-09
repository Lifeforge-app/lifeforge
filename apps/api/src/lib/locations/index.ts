import searchLocations from '@functions/external/location'
import z from 'zod'

import { createForge, forgeRouter } from '@lifeforge/server-utils'

const forge = createForge({}, 'locations')

const search = forge
  .query({
    description: 'Search for locations using Google Places API',
    input: {
      query: z.object({
        q: z.string()
      })
    },
    output: {
      OK: z.array(
        z.object({
          name: z.string(),
          formattedAddress: z.string(),
          location: z.object({
            latitude: z.number(),
            longitude: z.number()
          })
        })
      ),
      BAD_REQUEST: z.string()
    }
  })
  .callback(
    async ({
      query: { q },
      pb,
      core: {
        api: { getAPIKey }
      },
      response
    }) => {
      const key = await getAPIKey('gcloud', pb)

      if (!key) {
        return response.badRequest('API key not found')
      }

      return response.ok(await searchLocations(key, q))
    }
  )

export default forgeRouter({ search })
