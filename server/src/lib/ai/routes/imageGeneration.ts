import OpenAI from 'openai'
import z from 'zod'

import { getAPIKey } from '@functions/database'
import { forgeController, forgeRouter } from '@functions/routes'
import { ClientError } from '@functions/routes/utils/response'

const generateImage = forgeController
  .mutation()
  .description({
    en: 'Generate image from text prompt using AI',
    ms: 'Jana imej daripada gesaan teks menggunakan AI',
    'zh-CN': '使用AI从文本提示生成图片',
    'zh-TW': '使用AI從文本提示生成圖片'
  })
  .input({
    body: z.object({
      prompt: z.string().min(1, 'Prompt cannot be empty')
    })
  })
  .callback(async ({ pb, body: { prompt } }) => {
    const key = await getAPIKey('openai', pb)

    if (!key) {
      throw new ClientError('OpenAI API key not found')
    }

    const openai = new OpenAI({
      apiKey: key
    })

    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt,
      size: '1536x1024'
    })

    const image_base64 = response.data?.[0].b64_json

    if (!image_base64) {
      throw new Error('No image generated')
    }

    return `data:image/png;base64,${image_base64}`
  })

export default forgeRouter({ generateImage })
