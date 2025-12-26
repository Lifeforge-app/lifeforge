import CryptoJS from 'crypto-js'
import OpenAI from 'openai'
import type { ResponseInput } from 'openai/resources/responses/responses.mjs'
import ora from 'ora'
import z from 'zod'

import { startPocketBaseAndGetPid } from '../commands/db-commands/functions/database-initialization'
import getPocketbaseInstance from '../commands/db-commands/utils/pocketbase-utils'
import {
  checkRunningPBInstances,
  killExistingProcess,
  validateEnvironment
} from './helpers'
import { CLILoggingService } from './logging'
import { zodTextFormat } from './zodResponseFormat'

export interface FetchAIParams<T extends z.ZodType<any>> {
  model: string
  messages: ResponseInput
  structure: T
}

export async function getAPIKey(): Promise<string | null> {
  validateEnvironment([
    'PB_DIR',
    'PB_HOST',
    'PB_EMAIL',
    'PB_PASSWORD',
    'MASTER_KEY'
  ])

  const pbRunning = checkRunningPBInstances(false)

  let pbPid: number

  if (!pbRunning) {
    pbPid = await startPocketBaseAndGetPid()
  }

  const pbInstance = await getPocketbaseInstance()

  const apiKey = await pbInstance
    .collection('api_keys__entries')
    .getFirstListItem('keyId="openai"')
    .catch(() => {})

  if (!apiKey) {
    return null
  }

  try {
    return CryptoJS.AES.decrypt(apiKey.key, process.env.MASTER_KEY!).toString(
      CryptoJS.enc.Utf8
    )
  } catch {
    CLILoggingService.error('Failed to decrypt OpenAI API key.')

    return null
  } finally {
    if (!pbRunning) {
      killExistingProcess(pbPid!)
    }
  }
}

export async function fetchAI<T extends z.ZodType<any>>({
  model,
  messages,
  structure
}: FetchAIParams<T>): Promise<z.infer<T> | null> {
  const apiKey = await getAPIKey()

  if (!apiKey) {
    CLILoggingService.error('OpenAI API key not found.')

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
