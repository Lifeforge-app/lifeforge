import { createCache } from '@functions/cache'
import OpenAI from 'openai'
import z from 'zod'

export interface AIProvider {
  name: string
  requireAPIKey: boolean
  fetch<T extends z.ZodTypeAny | undefined = undefined>(params: {
    model: string
    messages: OpenAI.ChatCompletionMessageParam[]
    apiKey?: string
    structure?: T
  }): Promise<(T extends z.ZodTypeAny ? z.infer<T> : string) | null>
}

const registry = createCache<AIProvider>('ai-providers')

export function registerProvider(name: string, provider: AIProvider): void {
  registry.set(name, provider)
}

export function getProvider(name: string): AIProvider | undefined {
  return registry.get(name)
}
