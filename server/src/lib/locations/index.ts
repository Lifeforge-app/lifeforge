import { getAPIKey } from '@functions/database'
import searchLocations from '@functions/external/location'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'
import z from 'zod'

const search = forgeController
  .query()
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

const verifyAPIKey = forgeController
  .query()
  .description('Check if Google Cloud API key exists')
  .input({})
  .callback(async ({ pb }) => {
    try {
      await getAPIKey('gcloud', pb)

      return true
    } catch {
      return false
    }
  })

export default forgeRouter({ search, verifyAPIKey })
