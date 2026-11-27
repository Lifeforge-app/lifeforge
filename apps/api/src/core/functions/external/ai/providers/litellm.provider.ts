import { createCache } from '@functions/cache'
import { createServiceLogger } from '@functions/logging'
import chalk from 'chalk'
import OpenAI from 'openai'
import z from 'zod'

import { ClientError } from '@lifeforge/server-utils'

import { AIProvider } from './index'

const logger = createServiceLogger('AI')

/*
 * LiteLLM proxy (https://docs.litellm.ai/docs/simple_proxy): one OpenAI-style
 * endpoint in front of OpenAI, Anthropic, Gemini, Bedrock, Vertex AI, Azure,
 * Mistral, a remote Ollama and more. The model is a name the proxy serves.
 *
 * The proxy URL is LITELLM_BASE_URL (its root or its /v1 path). The key is the
 * "litellm" entry in the API key vault, or LITELLM_API_KEY when the vault has
 * none, so a proxy without auth works too.
 */

const MODELS_TTL_SECONDS = 300

const modelsCache = createCache<string[]>('litellm-models', {
  stdTTL: MODELS_TTL_SECONDS
})

/** The proxy's /v1 endpoint from LITELLM_BASE_URL, or null when unset. */
export function getLiteLLMBaseURL(
  raw: string | undefined = process.env.LITELLM_BASE_URL
): string | null {
  const url = raw?.trim().replace(/\/+$/, '')

  if (!url) {
    return null
  }

  return url.endsWith('/v1') ? url : `${url}/v1`
}

function createClient(baseURL: string, apiKey?: string): OpenAI {
  return new OpenAI({
    baseURL,
    // The SDK refuses to build a client without a key; a proxy without auth
    // ignores it.
    apiKey: apiKey || process.env.LITELLM_API_KEY || 'no-key'
  })
}

/**
 * The model names the proxy serves (GET /v1/models), cached for a few minutes
 * per proxy and key.
 */
export async function listLiteLLMModels(apiKey?: string): Promise<string[]> {
  const baseURL = getLiteLLMBaseURL()

  if (!baseURL) {
    throw new ClientError(
      'LiteLLM provider is not configured: set LITELLM_BASE_URL to the proxy URL.'
    )
  }

  const cacheKey = `${baseURL}|${apiKey ?? process.env.LITELLM_API_KEY ?? ''}`

  const cached = modelsCache.get(cacheKey)

  if (cached) {
    return cached
  }

  const models: string[] = []

  for await (const model of createClient(baseURL, apiKey).models.list()) {
    if (model.id && !models.includes(model.id)) {
      models.push(model.id)
    }
  }

  modelsCache.set(cacheKey, models)

  return models
}

/** Checks the model against the proxy once, so a typo fails with the list of models it serves. */
async function assertModelServed(model: string, apiKey?: string) {
  let models: string[]

  try {
    models = await listLiteLLMModels(apiKey)
  } catch (error) {
    if (error instanceof OpenAI.AuthenticationError) {
      throw new ClientError(
        `LiteLLM proxy rejected the API key: ${error.message}`
      )
    }

    if (error instanceof ClientError) {
      throw error
    }

    // Some keys may not list models; the completion call reports a bad model.
    logger.warn(
      `Could not list LiteLLM models, skipping model check: ${String(error)}`
    )

    return
  }

  if (models.length > 0 && !models.includes(model)) {
    throw new ClientError(
      `Model ${model} is not served by the LiteLLM proxy. Available models: ${models.join(', ')}`
    )
  }
}

function logCost(model: string, response: Response) {
  const cost = response.headers.get('x-litellm-response-cost')

  if (cost) {
    logger.debug(
      `LiteLLM model ${chalk.green(model)} cost ${chalk.blue(`$${cost}`)}`
    )
  }
}

async function createCompletion(
  client: OpenAI,
  params: OpenAI.ChatCompletionCreateParamsNonStreaming
) {
  const { data, response } = await client.chat.completions
    .create({
      ...params,
      // The proxy drops parameters the routed model does not accept instead
      // of failing the request.
      drop_params: true
    } as OpenAI.ChatCompletionCreateParamsNonStreaming)
    .withResponse()

  logCost(params.model, response)

  return data
}

function parseStructured<T extends z.ZodTypeAny>(
  structure: T,
  model: string,
  content: string | null | undefined
): z.infer<T> | null {
  if (!content) {
    logger.error(`No structured response received from LiteLLM model ${model}.`)

    return null
  }

  let json: unknown

  try {
    // Some models wrap JSON in a markdown fence even when asked not to.
    json = JSON.parse(
      content
        .trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '')
    )
  } catch {
    logger.error(`Failed to parse JSON response from LiteLLM model: ${content}`)

    return null
  }

  const result = structure.safeParse(json)

  if (!result.success) {
    logger.error(
      `LiteLLM model ${model} returned JSON that does not match the schema: ${result.error.message}`
    )

    return null
  }

  logger.debug(
    `Received structured response from LiteLLM model: ${chalk.green(model)}`
  )

  return result.data
}

async function fetchLiteLLM<
  T extends z.ZodTypeAny | undefined = undefined
>(params: {
  model: string
  messages: OpenAI.ChatCompletionMessageParam[]
  apiKey?: string
  structure?: T
}): Promise<(T extends z.ZodTypeAny ? z.infer<T> : string) | null> {
  const { model, messages, apiKey, structure } = params

  type Result = T extends z.ZodTypeAny ? z.infer<T> : string

  const baseURL = getLiteLLMBaseURL()

  if (!baseURL) {
    throw new ClientError(
      'LiteLLM provider is not configured: set LITELLM_BASE_URL to the proxy URL.'
    )
  }

  await assertModelServed(model, apiKey)

  const client = createClient(baseURL, apiKey)

  if (structure) {
    const schema = z.toJSONSchema(structure) as Record<string, unknown>

    let content: string | null | undefined

    try {
      const response = await createCompletion(client, {
        model,
        messages,
        response_format: {
          type: 'json_schema',
          json_schema: { name: 'response', schema }
        }
      })

      content = response.choices[0]?.message.content
    } catch (error) {
      if (!(error instanceof OpenAI.BadRequestError)) {
        throw error
      }

      // A model without structured outputs: ask for the schema in the prompt.
      logger.warn(
        `LiteLLM model ${model} rejected json_schema, retrying with json_object: ${error.message}`
      )

      const response = await createCompletion(client, {
        model,
        messages: [
          {
            role: 'system',
            content: `You must return your response as a JSON object strictly matching this schema. Do not output any markdown formatting, wrappers, or text outside the JSON object.

JSON Schema:
${JSON.stringify(schema)}`
          },
          ...messages
        ],
        response_format: { type: 'json_object' }
      })

      content = response.choices[0]?.message.content
    }

    return parseStructured(structure, model, content) as Result | null
  }

  const response = await createCompletion(client, { model, messages })

  const res = response.choices[0]?.message.content

  if (!res) {
    logger.error(`No text response received from LiteLLM model ${model}.`)

    return null
  }

  logger.debug(
    `Received text response (${chalk.blue(res.length)} characters) from LiteLLM model: ${chalk.green(model)}`
  )

  return res as Result
}

/**
 * Providers whose calls go through the proxy instead (LITELLM_ROUTE_PROVIDERS,
 * comma separated, or "*"). Lets an operator send every module's AI calls
 * through one gateway without changing the modules.
 */
export function shouldRouteThroughLiteLLM(
  provider: string,
  raw: string | undefined = process.env.LITELLM_ROUTE_PROVIDERS
): boolean {
  if (provider === 'litellm' || !getLiteLLMBaseURL()) {
    return false
  }

  const routed = (raw ?? '')
    .split(',')
    .map(entry => entry.trim().toLowerCase())
    .filter(Boolean)

  return routed.includes('*') || routed.includes(provider.toLowerCase())
}

/**
 * The proxy model for a routed call, by LiteLLM's provider/model naming: the
 * prefixed name when the proxy serves it, else the bare name when the proxy
 * has an alias by that name, else the prefixed name for a wildcard route
 * (e.g. "deepseek/*" in the proxy config).
 */
export async function resolveRoutedLiteLLMModel(
  provider: string,
  model: string,
  apiKey?: string
): Promise<string> {
  const prefixed = model.startsWith(`${provider}/`)
    ? model
    : `${provider}/${model}`

  let served: string[]

  try {
    served = await listLiteLLMModels(apiKey)
  } catch {
    return prefixed
  }

  if (served.includes(prefixed)) {
    return prefixed
  }

  return served.includes(model) ? model : prefixed
}

export const litellmProvider: AIProvider = {
  name: 'litellm',
  requireAPIKey: true,
  optionalAPIKey: true,
  fetch: fetchLiteLLM
}
