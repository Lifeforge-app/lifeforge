import { createServiceLogger } from '@functions/logging'
import chalk from 'chalk'
import OpenAI from 'openai'
import z from 'zod'

import { AIProvider } from './index'

const logger = createServiceLogger('AI')

async function fetchOpenRouter<
  T extends z.ZodTypeAny | undefined = undefined
>(params: {
  model: string
  messages: OpenAI.ChatCompletionMessageParam[]
  apiKey?: string
  structure?: T
}): Promise<(T extends z.ZodTypeAny ? z.infer<T> : string) | null> {
  const { model, messages, apiKey, structure } = params

  if (!apiKey) {
    throw new Error('API key is required for OpenRouter provider')
  }

  const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey
  })

  const reasoning = { reasoning: { enabled: false } }

  if (structure) {
    const systemPrompt = `You must return your response as a JSON object strictly matching this schema. Do not output any markdown formatting, wrappers, or text outside the JSON object.

JSON Schema:
${JSON.stringify(structure)}`

    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        ...messages
      ] as never,
      response_format: { type: 'json_object' },
      ...reasoning
    })

    const res = response.choices[0]?.message?.content

    if (!res) {
      logger.error('No structured response received from OpenRouter model.')

      return null
    }

    try {
      const parsedResponse = JSON.parse(res)

      logger.debug(
        `Received structured response from OpenRouter model: ${chalk.green(model)}`
      )

      return parsedResponse as T extends z.ZodTypeAny ? z.infer<T> : string
    } catch {
      logger.error(
        'Failed to parse JSON response from OpenRouter model: ' + res
      )

      return null
    }
  }

  const response = await client.chat.completions.create({
    model,
    messages: messages as never,
    ...reasoning
  })

  const res = response.choices[0]?.message?.content

  if (!res) {
    logger.error('No text response received from OpenRouter model.')

    return null
  }

  logger.debug(
    `Received text response (${chalk.blue(res.length)} characters) from OpenRouter model: ${chalk.green(model)}`
  )

  return res as T extends z.ZodTypeAny ? z.infer<T> : string
}

export const openrouterProvider: AIProvider = {
  name: 'openrouter',
  requireAPIKey: true,
  fetch: fetchOpenRouter
}
