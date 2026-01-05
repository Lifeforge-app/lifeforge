import CryptoJS from 'crypto-js'
import OpenAI from 'openai'
import type { ResponseInput } from 'openai/resources/responses/responses.mjs'
import ora from 'ora'
import z from 'zod'

import { getEnvVars } from './helpers'
import Logging from './logging'
import getPBInstance from './pocketbase'
import { zodTextFormat } from './zodResponseFormat'

export interface FetchAIParams<T extends z.ZodTypeAny> {
  model: string
  messages: ResponseInput
  structure: T
}

/**
 * Retrieves the OpenAI API key from the database and decrypts it.
 *
 * @returns The decrypted API key, or null if not found or decryption fails
 */
export async function getAPIKey(): Promise<string | null> {
  const { MASTER_KEY } = getEnvVars(['MASTER_KEY'])

  const { pb, killPB } = await getPBInstance()

  const apiKey = await pb
    .collection('api_keys__entries')
    .getFirstListItem('keyId="openai"')
    .catch(() => {})

  if (!apiKey) {
    return null
  }

  try {
    return CryptoJS.AES.decrypt(apiKey.key, MASTER_KEY).toString(
      CryptoJS.enc.Utf8
    )
  } catch {
    Logging.error('Failed to decrypt OpenAI API key.')

    return null
  } finally {
    killPB?.()
  }
}

/**
 * Fetches a structured response from OpenAI's API using a Zod schema.
 *
 * @param params - The fetch parameters
 * @param params.model - The OpenAI model to use
 * @param params.messages - The conversation messages to send
 * @param params.structure - The Zod schema defining the expected response structure
 * @returns The parsed response matching the schema, or null if the request fails
 */
export async function fetchAI<T extends z.ZodTypeAny>({
  model,
  messages,
  structure
}: FetchAIParams<T>): Promise<z.infer<T> | null> {
  const apiKey = await getAPIKey()

  if (!apiKey) {
    Logging.error('OpenAI API key not found.')

    return null
  }

  const client = new OpenAI({
    apiKey
  })

  const spinner = ora('Fetching AI response...').start()

  const completion = await client.responses.parse({
    model,
    input: messages,
    text: {
      format: zodTextFormat(structure, 'response')
    }
  })

  const parsedResponse = completion.output_parsed

  spinner.stop()

  if (!parsedResponse) {
    return null
  }

  return parsedResponse
}
