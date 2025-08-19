import { createGateway } from '@ai-sdk/gateway'
import { getAPIKey } from '@functions/database'
import { forgeController, forgeRouter } from '@functions/routes'
import { streamText } from 'ai'

const callTool = forgeController.query
  .input({})
  .noDefaultResponse()
  .callback(async ({ pb, res }) => {
    const apiKey = await getAPIKey('openai', pb)

    const gateway = createGateway({
      apiKey
    })

    const result = streamText({
      model: gateway('openai/gpt-4o'),
      prompt: 'Invent a new holiday and describe its traditions.'
    })

    result.pipeUIMessageStreamToResponse(res)
  })

export default forgeRouter({
  callTool
})
