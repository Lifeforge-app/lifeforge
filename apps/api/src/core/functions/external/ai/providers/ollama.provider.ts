import { createServiceLogger } from '@functions/logging'
import { zodTextFormat } from '@functions/utils/zodResponseFormat'
import chalk from 'chalk'
import OpenAI from 'openai'
import z from 'zod'

import { AIProvider } from './index'

const logger = createServiceLogger('AI')

async function fetchOllama<
  T extends z.ZodTypeAny | undefined = undefined
>(params: {
  model: string
  messages: OpenAI.ChatCompletionMessageParam[]
  apiKey?: string
  structure?: T
}): Promise<(T extends z.ZodTypeAny ? z.infer<T> : string) | null> {
  const { model, messages, apiKey, structure } = params

  const client = new OpenAI({
    baseURL: 'http://localhost:11434/v1',
    apiKey: apiKey || 'ollama'
  })

  if (structure) {
    const completion = await client.responses.parse({
      model,
      input: messages as never,
      text: {
        format: zodTextFormat(structure, 'response')
      }
    })

    const parsedResponse = completion.output_parsed

    if (!parsedResponse) {
      logger.error('No structured response received from Ollama model.')

      return null
    }

    logger.debug(
      `Received structured response (${chalk.blue(Object.keys(parsedResponse).length)} fields) from Ollama model: ${chalk.green(model)}`
    )

    return parsedResponse as T extends z.ZodTypeAny ? z.infer<T> : string
  }

  const response = await client.responses.create({
    input: messages as never,
    model
  })

  const res = response.output_text

  if (!res) {
    logger.error('No text response received from Ollama model.')

    return null
  }

  logger.debug(
    `Received text response (${chalk.blue(res.length)} characters) from Ollama model: ${chalk.green(model)}`
  )

  return res as T extends z.ZodTypeAny ? z.infer<T> : string
}

export const ollamaProvider: AIProvider = {
  name: 'ollama',
  requireAPIKey: false,
  fetch: fetchOllama
}
