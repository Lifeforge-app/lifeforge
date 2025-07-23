import { getAPIKey } from '@functions/database'
import searchLocations from '@functions/external/location'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import { z } from 'zod/v4'

const getLocation = forgeController
  .route('GET /')
  .description('Search for locations')
  .input({
    query: z.object({
      q: z.string()
    })
  })
  .callback(async ({ query: { q }, pb }) => {
    const key = await getAPIKey('gcloud', pb)

    if (!key) {
      throw new ClientError('API key not found')
    }

    return await searchLocations(key, q)
  })

const checkIsEnabled = forgeController
  .route('GET /enabled')
  .description('Check if Google Cloud API key exists')
  .input({})
  .callback(async ({ pb }) => {
    const key = await getAPIKey('gcloud', pb)

    return !!key
  })

export default forgeRouter({ getLocation, checkIsEnabled })
