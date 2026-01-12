import z from 'zod'

import { forgeController } from '@functions/routes'

const corsAnywhere = forgeController
  .query()
  .description({
    en: 'CORS Anywhere - Fetch external URL content',
    ms: 'CORS Anywhere - Dapatkan kandungan URL luaran',
    'zh-CN': 'CORS Anywhere - 获取外部URL内容',
    'zh-TW': 'CORS Anywhere - 獲取外部URL內容'
  })
  .input({
    query: z.object({
      url: z.url()
    })
  })
  .callback(async ({ query: { url }, core: { logging } }) => {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    }).catch(() => {
      logging.error(`Failed to fetch URL: ${url}`)
    })

    if (!response) {
      return
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${url}`)
    }

    if (response.headers.get('content-type')?.includes('application/json')) {
      const json = await response.json()

      return json
    }

    return response.text()
  })

export default corsAnywhere
