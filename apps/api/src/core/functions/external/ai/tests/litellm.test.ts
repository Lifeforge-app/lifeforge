import http from 'http'
import type { AddressInfo } from 'net'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import z from 'zod'

import {
  getLiteLLMBaseURL,
  listLiteLLMModels,
  litellmProvider,
  resolveRoutedLiteLLMModel,
  shouldRouteThroughLiteLLM
} from '../providers/litellm.provider'

type Recorded = {
  path: string
  auth: string | undefined
  body: Record<string, unknown>
}

/** A stand-in LiteLLM proxy: /v1/models and /v1/chat/completions. */
function startFakeProxy(options: {
  models?: string[]
  reply?: (body: Record<string, unknown>) => {
    status?: number
    json: unknown
  }
  modelsStatus?: number
}) {
  const requests: Recorded[] = []

  const server = http.createServer((req, res) => {
    let raw = ''

    req.on('data', chunk => (raw += chunk))
    req.on('end', () => {
      const body = raw ? (JSON.parse(raw) as Record<string, unknown>) : {}

      requests.push({
        path: req.url ?? '',
        auth: req.headers.authorization,
        body
      })
      res.setHeader('Content-Type', 'application/json')

      if (req.url === '/v1/models') {
        res.statusCode = options.modelsStatus ?? 200
        res.end(
          JSON.stringify(
            res.statusCode === 200
              ? {
                  object: 'list',
                  data: (options.models ?? []).map(id => ({
                    id,
                    object: 'model',
                    created: 0,
                    owned_by: 'openai'
                  }))
                }
              : { error: { message: 'Authentication Error, invalid key' } }
          )
        )

        return
      }

      const reply = options.reply?.(body) ?? {
        json: completion('ok')
      }

      res.statusCode = reply.status ?? 200
      res.setHeader('x-litellm-response-cost', '0.00012')
      res.end(JSON.stringify(reply.json))
    })
  })

  return new Promise<{ url: string; requests: Recorded[]; close: () => void }>(
    resolve => {
      server.listen(0, '127.0.0.1', () => {
        const { port } = server.address() as AddressInfo

        resolve({
          url: `http://127.0.0.1:${port}`,
          requests,
          close: () => server.close()
        })
      })
    }
  )
}

function completion(content: string) {
  return {
    id: 'chatcmpl-1',
    object: 'chat.completion',
    created: 0,
    model: 'gpt-4.1-mini',
    choices: [
      {
        index: 0,
        finish_reason: 'stop',
        message: { role: 'assistant', content }
      }
    ]
  }
}

const chatRequests = (requests: Recorded[]) =>
  requests.filter(r => r.path === '/v1/chat/completions')

/** The nth chat completion the proxy received. */
function chatRequest(requests: Recorded[], index = 0): Recorded {
  const request = chatRequests(requests)[index]

  if (!request) {
    throw new Error(`No chat completion request #${index}`)
  }

  return request
}

describe('LiteLLM provider', () => {
  const env = { ...process.env }

  let proxy: Awaited<ReturnType<typeof startFakeProxy>> | undefined

  beforeEach(() => {
    delete process.env.LITELLM_BASE_URL
    delete process.env.LITELLM_API_KEY
    delete process.env.LITELLM_ROUTE_PROVIDERS
  })

  afterEach(() => {
    proxy?.close()
    proxy = undefined
    process.env = { ...env }
  })

  it('normalises the proxy URL to its /v1 endpoint', () => {
    expect(getLiteLLMBaseURL('http://localhost:4000')).toBe(
      'http://localhost:4000/v1'
    )
    expect(getLiteLLMBaseURL(' http://localhost:4000/v1/ ')).toBe(
      'http://localhost:4000/v1'
    )
    expect(getLiteLLMBaseURL('')).toBeNull()
    expect(getLiteLLMBaseURL(undefined)).toBeNull()
  })

  it('sends a chat completion with drop_params and the vault key', async () => {
    proxy = await startFakeProxy({
      models: ['gpt-4.1-mini'],
      reply: () => ({ json: completion('Hello there') })
    })
    process.env.LITELLM_BASE_URL = proxy.url

    const result = await litellmProvider.fetch({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: 'Say hello' }],
      apiKey: 'sk-vault'
    })

    expect(result).toBe('Hello there')

    const request = chatRequest(proxy.requests)

    expect(request.auth).toBe('Bearer sk-vault')
    expect(request.body.model).toBe('gpt-4.1-mini')
    expect(request.body.drop_params).toBe(true)
    expect(request.body.messages).toEqual([
      { role: 'user', content: 'Say hello' }
    ])
  })

  it('falls back to LITELLM_API_KEY when the vault has no key', async () => {
    proxy = await startFakeProxy({ models: ['gpt-4.1-mini'] })
    process.env.LITELLM_BASE_URL = proxy.url
    process.env.LITELLM_API_KEY = 'sk-env'

    await litellmProvider.fetch({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: 'hi' }]
    })

    expect(chatRequest(proxy.requests).auth).toBe('Bearer sk-env')
  })

  it('asks for a JSON schema and validates the reply', async () => {
    proxy = await startFakeProxy({
      models: ['gemini-2.5-flash'],
      reply: () => ({ json: completion('{"en":"Health","ms":"Kesihatan"}') })
    })
    process.env.LITELLM_BASE_URL = proxy.url

    const structure = z.object({ en: z.string(), ms: z.string() })

    const result = await litellmProvider.fetch({
      model: 'gemini-2.5-flash',
      messages: [{ role: 'user', content: 'Translate "health"' }],
      apiKey: 'k',
      structure
    })

    expect(result).toEqual({ en: 'Health', ms: 'Kesihatan' })

    const format = chatRequest(proxy.requests).body.response_format as {
      type: string
      json_schema: { name: string; schema: { properties: object } }
    }

    expect(format.type).toBe('json_schema')
    expect(Object.keys(format.json_schema.schema.properties)).toEqual([
      'en',
      'ms'
    ])
  })

  it('retries with json_object when the model rejects json_schema', async () => {
    proxy = await startFakeProxy({
      models: ['local-llama'],
      reply: body =>
        (body.response_format as { type: string }).type === 'json_schema'
          ? {
              status: 400,
              json: {
                error: { message: 'response_format json_schema not supported' }
              }
            }
          : { json: completion('```json\n{"en":"Health"}\n```') }
    })
    process.env.LITELLM_BASE_URL = proxy.url

    const result = await litellmProvider.fetch({
      model: 'local-llama',
      messages: [{ role: 'user', content: 'Translate' }],
      apiKey: 'k',
      structure: z.object({ en: z.string() })
    })

    expect(result).toEqual({ en: 'Health' })

    const retry = chatRequest(proxy.requests, 1)
    const [system] = retry.body.messages as { role: string; content: string }[]

    expect((retry.body.response_format as { type: string }).type).toBe(
      'json_object'
    )
    expect(system?.role).toBe('system')
    expect(system?.content).toContain('"en"')
  })

  it('returns null when the JSON does not match the schema', async () => {
    proxy = await startFakeProxy({
      models: ['gpt-4.1-mini'],
      reply: () => ({ json: completion('{"en": 3}') })
    })
    process.env.LITELLM_BASE_URL = proxy.url

    const result = await litellmProvider.fetch({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: 'x' }],
      apiKey: 'k',
      structure: z.object({ en: z.string() })
    })

    expect(result).toBeNull()
  })

  it('rejects a model the proxy does not serve, listing the ones it does', async () => {
    proxy = await startFakeProxy({
      models: ['gpt-4.1-mini', 'gemini-2.5-flash']
    })
    process.env.LITELLM_BASE_URL = proxy.url

    await expect(
      litellmProvider.fetch({
        model: 'gpt-4.1-mni',
        messages: [{ role: 'user', content: 'x' }],
        apiKey: 'k'
      })
    ).rejects.toThrow(
      'Model gpt-4.1-mni is not served by the LiteLLM proxy. Available models: gpt-4.1-mini, gemini-2.5-flash'
    )
    expect(chatRequests(proxy.requests)).toHaveLength(0)
  })

  it('reports a rejected key before sending the prompt', async () => {
    proxy = await startFakeProxy({ modelsStatus: 401 })
    process.env.LITELLM_BASE_URL = proxy.url

    await expect(
      litellmProvider.fetch({
        model: 'gpt-4.1-mini',
        messages: [{ role: 'user', content: 'x' }],
        apiKey: 'bad'
      })
    ).rejects.toThrow('LiteLLM proxy rejected the API key')
    expect(chatRequests(proxy.requests)).toHaveLength(0)
  })

  it('fails clearly when LITELLM_BASE_URL is not set', async () => {
    await expect(
      litellmProvider.fetch({
        model: 'gpt-4.1-mini',
        messages: [{ role: 'user', content: 'x' }]
      })
    ).rejects.toThrow('set LITELLM_BASE_URL')
  })

  it('lists and caches the proxy models', async () => {
    proxy = await startFakeProxy({ models: ['a', 'b', 'a'] })
    process.env.LITELLM_BASE_URL = proxy.url

    expect(await listLiteLLMModels('k')).toEqual(['a', 'b'])
    expect(await listLiteLLMModels('k')).toEqual(['a', 'b'])
    expect(proxy.requests.filter(r => r.path === '/v1/models')).toHaveLength(1)
  })

  it('routes only the providers listed in LITELLM_ROUTE_PROVIDERS', () => {
    expect(shouldRouteThroughLiteLLM('deepseek', 'deepseek')).toBe(false)

    process.env.LITELLM_BASE_URL = 'http://localhost:4000'

    expect(shouldRouteThroughLiteLLM('deepseek', 'deepseek, openai')).toBe(true)
    expect(shouldRouteThroughLiteLLM('groq', 'deepseek, openai')).toBe(false)
    expect(shouldRouteThroughLiteLLM('groq', '*')).toBe(true)
    expect(shouldRouteThroughLiteLLM('litellm', '*')).toBe(false)
    expect(shouldRouteThroughLiteLLM('openai', undefined)).toBe(false)
  })

  it('maps a routed call to the model the proxy serves', async () => {
    proxy = await startFakeProxy({
      models: ['gpt-4.1-mini', 'groq/llama-3.3-70b-versatile', 'deepseek/*']
    })
    process.env.LITELLM_BASE_URL = proxy.url

    // A bare alias on the proxy
    expect(await resolveRoutedLiteLLMModel('openai', 'gpt-4.1-mini', 'k')).toBe(
      'gpt-4.1-mini'
    )
    // A provider-prefixed model on the proxy
    expect(
      await resolveRoutedLiteLLMModel('groq', 'llama-3.3-70b-versatile', 'k')
    ).toBe('groq/llama-3.3-70b-versatile')
    // Neither listed: the prefixed name, for a wildcard route
    expect(
      await resolveRoutedLiteLLMModel('deepseek', 'deepseek-v4-flash', 'k')
    ).toBe('deepseek/deepseek-v4-flash')
    expect(
      await resolveRoutedLiteLLMModel('openrouter', 'openrouter/auto', 'k')
    ).toBe('openrouter/auto')
  })
})
