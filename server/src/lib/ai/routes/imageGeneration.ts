import { ClientError, createForge } from '@lifeforge/server-utils'
import OpenAI from 'openai'
import z from 'zod'

const forge = createForge({}, 'ai')

export const generateImage = forge
  .mutation()
  .description('Generate image from text prompt using AI')
  .input({
    body: z.object({
      prompt: z.string().min(1, 'Prompt cannot be empty')
    })
  })
  .callback(
    async ({
      pb,
      body: { prompt },
      core: {
        api: { getAPIKey }
      }
    }) => {
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
    }
  )
