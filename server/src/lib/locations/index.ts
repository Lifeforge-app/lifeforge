import { ClientError, createForge, forgeRouter } from '@lifeforge/server-utils'
import z from 'zod'

import searchLocations from '@functions/external/location'

const forge = createForge({}, 'locations')

const search = forge
  .query()
  .description('Search for locations using Google Places API')
  .input({
    query: z.object({
      q: z.string()
    })
  })
  .callback(
    async ({
      query: { q },
      pb,
      core: {
        api: { getAPIKey }
      }
    }) => {
      const key = await getAPIKey('gcloud', pb)

      if (!key) {
        throw new ClientError('API key not found')
      }

      return await searchLocations(key, q)
    }
  )

export default forgeRouter({ search })
