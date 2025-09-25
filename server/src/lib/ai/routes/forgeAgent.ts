import { createOpenAI } from '@ai-sdk/openai'
import { getAPIKey } from '@functions/database'
import { forgeController, forgeRouter } from '@functions/routes'
import flattenRoutes from '@functions/routes/utils/flattenRoutes'
import { convertToModelMessages, stepCountIs, streamText } from 'ai'
import { z } from 'zod'

// Factory function to create the controller with routes dependency injection
export const createForgeAgentRouter = (appRoutes: Record<string, unknown>) => {
  const callTool = forgeController
    .mutation()
    .input({
      body: z.object({
        messages: z.any()
      })
    })
    .noDefaultResponse()
    .callback(async ({ pb, io, req, res, body: { messages } }) => {
      const apiKey = await getAPIKey('openai', pb)

      const openai = createOpenAI({
        apiKey
      })

      const result = streamText({
        model: openai('gpt-4o'),
        messages: convertToModelMessages(messages),
        tools: {
          ...Object.fromEntries(
            Object.entries(flattenRoutes(appRoutes))
              .filter(([_, value]) => value?.isAIToolCallingEnabled)
              .map(([key, value]) => [
                key,
                value.getToolConfig({ req, res, pb, io })
              ])
          )
        },
        stopWhen: stepCountIs(5)
      })

      result.pipeUIMessageStreamToResponse(res)
    })

  return forgeRouter({
    callTool
  })
}
