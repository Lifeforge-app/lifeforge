import z from 'zod'

import { getAPIKey } from '@functions/database'
import searchLocations from '@functions/external/location'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'

const search = forgeController
  .query()
  .description({
    en: 'Search for locations using Google Places API',
    ms: 'Cari lokasi menggunakan API Tempat Google',
    'zh-CN': '使用Google Places API搜索位置',
    'zh-TW': '使用Google Places API搜尋位置'
  })
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

export default forgeRouter({ search })
