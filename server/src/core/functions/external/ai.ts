import chalk from 'chalk'
import Groq from 'groq-sdk'
import { ChatCompletionMessageParam as GroqChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions.mjs'
import OpenAI from 'openai'
import { ResponseInputItem } from 'openai/resources/responses/responses.mjs'
import z from 'zod'

import { PBService, getAPIKey } from '@functions/database'
import { validateCallerAccess } from '@functions/database/getAPIKey'
import { ClientError } from '@functions/routes/utils/response'
import { getCallerModuleId } from '@functions/utils/getCallerModuleId'
import { zodTextFormat } from '@functions/utils/zodResponseFormat'

import { coreLogger } from '../../..'

const logger = coreLogger.child({ service: 'AI' })

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

  logger.debug(
    `${chalk.blue(callerModule)} is sending ${chalk.blue(messages.length)} message(s) to ${chalk.green(
      model
    )} on provider ${chalk.green(provider)} using model: ${chalk.green(model)}.`
  )

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
      logger.error('No response received from Groq model.')

      return null
    }

    logger.debug(
      `Received response (${chalk.blue(res.length)} characters) from Groq model: ${chalk.green(model)}`
    )

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
      logger.error('No structured response received from OpenAI model.')

      return null
    }

    logger.debug(
      `Received structured response (${chalk.blue(Object.keys(parsedResponse).length)} fields) from OpenAI model: ${chalk.green(model)}`
    )

    return parsedResponse
  }

  const response = await client.responses.create({
    input: messages as ResponseInputItem[],
    model
  })

  const res = response.output_text

  if (!res) {
    logger.error('No text response received from OpenAI model.')

    return null
  }

  logger.debug(
    `Received text response (${chalk.blue(res.length)} characters) from OpenAI model: ${chalk.green(model)}`
  )

  return res as any
}
