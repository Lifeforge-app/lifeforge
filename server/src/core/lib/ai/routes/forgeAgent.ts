import { createOpenAI } from '@ai-sdk/openai'
import { getAPIKey } from '@functions/database'
import { forgeController, forgeRouter } from '@functions/routes'
import COLLECTION_SCHEMAS from '@schema'
import { convertToModelMessages, streamText } from 'ai'
import { z } from 'zod/v4'

const callTool = forgeController.mutation
  .input({
    body: z.object({
      messages: z.any()
    })
  })
  .noDefaultResponse()
  .callback(async ({ pb, res, body: { messages } }) => {
    const apiKey = await getAPIKey('openai', pb)

    const openai = createOpenAI({
      apiKey
    })

    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: convertToModelMessages(messages),
      tools: {
        wallet__listAssets: {
          description:
            'list all the assets available in the wallet. When user ask for details about an asset, provide the asset information, call this tool to check whether there are any assets that match the user query. Then, respond with the relevant asset details.',
          inputSchema: z.object({}),
          execute: () =>
            pb.getFullList.collection('wallet__assets_aggregated').execute(),
          outputSchema: COLLECTION_SCHEMAS.wallet__assets_aggregated.pick({
            name: true,
            current_balance: true,
            transaction_count: true
          })
        }
      }
    })

    result.pipeUIMessageStreamToResponse(res)
  })

export default forgeRouter({
  callTool
})
