import z from 'zod'

import { createForge } from '@lifeforge/server-utils'

const forge = createForge({}, 'cors_anywhere')

const corsAnywhere = forge
  .query({
    description: 'CORS Anywhere - Fetch external URL content',
    input: {
      query: z.object({
        url: z.url()
      })
    },
    output: {
      OK: z.any(),
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ query: { url }, core: { logging }, response }) => {
    const r = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    }).catch(() => {
      logging.error(`Failed to fetch URL: ${url}`)
    })

    if (!r) {
      return response.badRequest('Failed to fetch URL')
    }

    if (!r.ok) {
      return response.badRequest(`Failed to fetch URL: ${url}`)
    }

    if (r.headers.get('content-type')?.includes('application/json')) {
      const json = await r.json()

      return response.ok(json)
    }

    return response.ok(await r.text())
  })

export default corsAnywhere
