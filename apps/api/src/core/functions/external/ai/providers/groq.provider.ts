import { createServiceLogger } from '@functions/logging'
import chalk from 'chalk'
import Groq from 'groq-sdk'
import OpenAI from 'openai'
import z from 'zod'

import { AIProvider } from './index'

const logger = createServiceLogger('AI')

async function fetchGroq<
  T extends z.ZodTypeAny | undefined = undefined
>(params: {
  model: string
  messages: OpenAI.ChatCompletionMessageParam[]
  apiKey?: string
  structure?: T
}): Promise<(T extends z.ZodTypeAny ? z.infer<T> : string) | null> {
  const { model, messages, apiKey, structure } = params

  if (!apiKey) {
    throw new Error('API key is required for Groq provider')
  }

  if (structure) {
    throw new Error('Structure is only supported for OpenAI provider')
  }

  const client = new Groq({ apiKey })

  const response = await client.chat.completions.create({
    messages: messages as never,
    model
  })

  const res = response.choices[0]?.message?.content

  if (!res) {
    logger.error('No response received from Groq model.')

    return null
  }

  logger.debug(
    `Received response (${chalk.blue(res.length)} characters) from Groq model: ${chalk.green(model)}`
  )

  return res as T extends z.ZodTypeAny ? z.infer<T> : string
}

export const groqProvider: AIProvider = {
  name: 'groq',
  requireAPIKey: true,
  fetch: fetchGroq
}
