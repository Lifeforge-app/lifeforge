import Groq from 'groq-sdk'
import { ChatCompletionMessageParam as GroqChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions.mjs'
import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod.mjs'
import { ChatCompletionMessageParam as OpenAIChatCompletionMessageParam } from 'openai/resources/index.mjs'
import PocketBase from 'pocketbase'
import { z } from 'zod'

import ClientError from './ClientError'
import { getAPIKey } from './getAPIKey'

export interface FetchAIParams<T extends z.ZodType<any> | undefined> {
  pb: PocketBase
  provider: 'groq' | 'openai'
  model: string
  messages:
    | GroqChatCompletionMessageParam[]
    | OpenAIChatCompletionMessageParam[]
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

  const apiKey = await getAPIKey(provider, pb)

  if (!apiKey) {
    throw new ClientError(`API key for ${provider} not found.`)
  }

  const client = new {
    groq: Groq,
    openai: OpenAI
  }[provider]({
    apiKey
  })

  if (structure) {
    const completion = await (client as OpenAI).chat.completions.parse({
      model,
      messages: messages as OpenAIChatCompletionMessageParam[],
      // @ts-ignore
      response_format: zodResponseFormat(structure, 'response')
    })

    const parsedResponse = completion.choices[0]?.message?.parsed

    if (!parsedResponse) {
      return null
    }

    return parsedResponse
  }

  // @ts-ignore
  const response = await client.chat.completions.create({
    messages,
    model
  })

  const res = response.choices[0]?.message?.content

  if (!res) {
    return null
  }

  return res
}
