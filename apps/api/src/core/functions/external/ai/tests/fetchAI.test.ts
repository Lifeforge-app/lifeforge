import { beforeEach, describe, expect, it, vi } from 'vitest'

const vault = vi.hoisted(
  (): { keys: Record<string, string>; denied: Set<string> } => ({
    keys: {},
    denied: new Set()
  })
)

vi.mock('@functions/database/getAPIKey', () => ({
  default: () => async (id: string) => {
    const key = vault.keys[id]

    if (!key) {
      throw new Error(
        `Failed to retrieve API key for ${id}: API key for ${id} not found`
      )
    }

    return key
  },
  validateCallerAccess: async (
    caller: { source: string; id: string },
    id: string
  ) => {
    if (caller.source !== 'core' && vault.denied.has(id)) {
      throw new Error(`API access for ${id} not found`)
    }
  }
}))

const litellm = vi.hoisted(() => ({
  fetch: vi.fn(async () => 'from proxy'),
  served: [] as string[]
}))

vi.mock('../providers/litellm.provider', async importOriginal => {
  const actual =
    await importOriginal<typeof import('../providers/litellm.provider')>()

  return {
    ...actual,
    listLiteLLMModels: async () => litellm.served,
    resolveRoutedLiteLLMModel: async (provider: string, model: string) =>
      litellm.served.includes(model) ? model : `${provider}/${model}`,
    litellmProvider: { ...actual.litellmProvider, fetch: litellm.fetch }
  }
})

const { default: createFetchAI } = await import('../index')

const app = { source: 'app' as const, id: 'wallet' }

const messages = [{ role: 'user' as const, content: 'hi' }]

describe('fetchAI with LiteLLM', () => {
  beforeEach(() => {
    vault.keys = {}
    vault.denied.clear()
    litellm.fetch.mockClear()
    litellm.served = []
    process.env.LITELLM_BASE_URL = 'http://localhost:4000'
    delete process.env.LITELLM_ROUTE_PROVIDERS
  })

  it('calls the litellm provider with the vault key', async () => {
    vault.keys.litellm = 'sk-vault'

    const result = await createFetchAI(app)({
      provider: 'litellm',
      model: 'gpt-4.1-mini',
      messages
    })

    expect(result).toBe('from proxy')
    expect(litellm.fetch).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gpt-4.1-mini', apiKey: 'sk-vault' })
    )
  })

  it('goes ahead without a vault key (LITELLM_API_KEY or a keyless proxy)', async () => {
    await createFetchAI(app)({
      provider: 'litellm',
      model: 'gpt-4.1-mini',
      messages
    })

    expect(litellm.fetch).toHaveBeenCalledWith(
      expect.objectContaining({ apiKey: undefined })
    )
  })

  it('still requires the module to declare access to litellm', async () => {
    vault.denied.add('litellm')

    await expect(
      createFetchAI(app)({ provider: 'litellm', model: 'm', messages })
    ).rejects.toThrow('API access for litellm not found')
    expect(litellm.fetch).not.toHaveBeenCalled()
  })

  it('routes a listed provider through the proxy with the proxy key', async () => {
    process.env.LITELLM_ROUTE_PROVIDERS = 'deepseek'
    vault.keys.litellm = 'sk-proxy'

    await createFetchAI(app)({
      provider: 'deepseek',
      model: 'deepseek-v4-flash',
      messages
    })

    expect(litellm.fetch).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'deepseek/deepseek-v4-flash',
        apiKey: 'sk-proxy'
      })
    )
  })

  it('keeps the access check for the provider the module asked for', async () => {
    process.env.LITELLM_ROUTE_PROVIDERS = '*'
    vault.denied.add('openai')

    await expect(
      createFetchAI(app)({
        provider: 'openai',
        model: 'gpt-4.1-mini',
        messages
      })
    ).rejects.toThrow('API access for openai not found')
    expect(litellm.fetch).not.toHaveBeenCalled()
  })

  it('leaves providers that are not listed alone', async () => {
    process.env.LITELLM_ROUTE_PROVIDERS = 'deepseek'

    await expect(
      createFetchAI(app)({ provider: 'groq', model: 'llama', messages })
    ).rejects.toThrow('API key for groq not found')
    expect(litellm.fetch).not.toHaveBeenCalled()
  })
})
