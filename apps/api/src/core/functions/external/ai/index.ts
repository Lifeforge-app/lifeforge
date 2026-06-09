import { getAPIKey } from '@functions/database'
import { validateCallerAccess } from '@functions/database/getAPIKey'
import { createServiceLogger } from '@functions/logging'
import chalk from 'chalk'
import OpenAI from 'openai'
import z from 'zod'

import {
  ClientError,
  FetchAIFunc,
  IPBService,
  getCallerModuleId
} from '@lifeforge/server-utils'

import { getProvider, registerProvider } from './providers'
import { deepseekProvider } from './providers/deepseek.provider'
import { groqProvider } from './providers/groq.provider'
import { ollamaProvider } from './providers/ollama.provider'
import { openaiProvider } from './providers/openai.provider'

const logger = createServiceLogger('AI')

registerProvider('openai', openaiProvider)
registerProvider('groq', groqProvider)
registerProvider('ollama', ollamaProvider)
registerProvider('deepseek', deepseekProvider)

async function fetchAI<T extends z.ZodTypeAny | undefined = undefined>({
  pb,
  provider,
  model,
  messages,
  structure
}: {
  pb: IPBService<any>
  provider: 'groq' | 'openai' | 'ollama' | 'deepseek'
  model: string
  messages: OpenAI.ChatCompletionMessageParam[]
  structure?: T
}): Promise<(T extends z.ZodTypeAny ? z.infer<T> : string) | null> {
  const callerModule = getCallerModuleId()

  if (!callerModule) {
    throw new Error('Unable to determine caller module for API key validation.')
  }

  const aiProvider = getProvider(provider)

  if (!aiProvider) {
    throw new ClientError(`AI provider ${provider} is not registered.`)
  }

  let apiKey: string | undefined

  if (aiProvider.requireAPIKey) {
    await validateCallerAccess(callerModule, provider)

    const fetchedKey = await getAPIKey(pb, callerModule)(provider)

    if (!fetchedKey) {
      throw new ClientError(`API key for ${provider} not found.`)
    }
    apiKey = fetchedKey
  }

  logger.debug(
    `${chalk.blue(callerModule)} is sending ${chalk.blue(messages.length)} message(s) to ${chalk.green(
      model
    )} on provider ${chalk.green(provider)} using model: ${chalk.green(model)}.`
  )

  return aiProvider.fetch({
    model,
    messages,
    apiKey,
    structure
  })
}

export { getProvider, registerProvider } from './providers'

export default fetchAI as FetchAIFunc
