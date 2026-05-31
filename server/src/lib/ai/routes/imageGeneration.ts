import OpenAI from 'openai'
import z from 'zod'

import { createForge } from '@lifeforge/server-utils'

const forge = createForge({}, 'ai')

export const generateImage = forge
  .mutation({
    description: 'Generate image from text prompt using AI',
    input: {
      body: z.object({
        prompt: z.string().min(1, 'Prompt cannot be empty')
      })
    },
    output: {
      OK: z.string(),
      BAD_REQUEST: z.string()
    }
  })
  .callback(
    async ({
      pb,
      body: { prompt },
      core: {
        api: { getAPIKey }
      },
      response
    }) => {
      const key = await getAPIKey('openai', pb)

      if (!key) {
        return response.badRequest('OpenAI API key not found')
      }

      const openai = new OpenAI({
        apiKey: key
      })

      const r = await openai.images.generate({
        model: 'gpt-image-1',
        prompt,
        size: '1536x1024'
      })

      const image_base64 = r.data?.[0].b64_json

      if (!image_base64) {
        return response.badRequest('No image generated')
      }

      return response.ok(`data:image/png;base64,${image_base64}`)
    }
  )
