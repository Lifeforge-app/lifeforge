import chalk from 'chalk'
import Groq from 'groq-sdk'
import { ChatCompletionMessageParam as GroqChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions.mjs'
import OpenAI from 'openai'
import { ResponseInputItem } from 'openai/resources/responses/responses.mjs'
import z from 'zod'

import { PBService, getAPIKey } from '@functions/database'
import {
  getCallerModuleId,
  validateCallerAccess
} from '@functions/database/getAPIKey'
import { LoggingService } from '@functions/logging/loggingService'
import { ClientError } from '@functions/routes/utils/response'
import { zodTextFormat } from '@functions/utils/zodResponseFormat'

export interface FetchAIParams<T extends z.ZodType<any> | undefined> {
  pb: PBService
  provider: 'groq' | 'openai'
  model: string
  messages: ResponseInputItem[]
  structure?: T
}

export async function fetchAI<
  T extends z.ZodType<any> | undefined = undefined
>({
  pb,
  provider,
  model,
  messages,
  structure
}: FetchAIParams<T>): Promise<
  (T extends z.ZodType<any> ? z.infer<T> : string) | null
> {
  if (structure && provider !== 'openai') {
    throw new Error('Structure is only supported for OpenAI provider')
  }

  const callerModule = getCallerModuleId()

  if (!callerModule) {
    throw new Error('Unable to determine caller module for API key validation.')
  }

  await validateCallerAccess(callerModule, provider)

  const apiKey = await getAPIKey(provider, pb)

  if (!apiKey) {
    throw new ClientError(`API key for ${provider} not found.`)
  }

  if (provider === 'groq') {
    const client = new Groq({
      apiKey
    })

    const response = await client.chat.completions.create({
      messages: messages as GroqChatCompletionMessageParam[],
      model
    })

    const res = response.choices[0]?.message?.content

    if (!res) {
      return null
    }

    return res as any
  }

  const client = new OpenAI({
    apiKey
  })

  if (structure) {
    const completion = await client.responses.parse({
      model,
      input: messages as ResponseInputItem[],
      text: {
        format: zodTextFormat(structure, 'response')
      }
    })

    const parsedResponse = completion.output_parsed

    if (!parsedResponse) {
      return null
    }

    LoggingService.debug(
      `Received structured response (${chalk.blue(Object.keys(parsedResponse).length)} fields) from OpenAI model: ${chalk.green(model)}`,
      'AI'
    )

    return parsedResponse
  }

  const response = await client.responses.create({
    input: messages as ResponseInputItem[],
    model
  })

  const res = response.output_text

  if (!res) {
    return null
  }

  LoggingService.debug(
    `Received text response (${chalk.blue(res.length)} characters) from OpenAI model: ${chalk.green(model)}`,
    'AI'
  )

  return res as any
}
