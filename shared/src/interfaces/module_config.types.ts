import z from 'zod'

import type WidgetConfig from './widget_config.types'

export interface ModuleConfig {
  provider?: React.LazyExoticComponent<React.ComponentType<any>>
  routes: Record<string, React.LazyExoticComponent<React.ComponentType<any>>>
  subsection?: {
    label: string
    icon: string
    path: string
  }[]
  hidden?: boolean
  disabled?: boolean | (() => Promise<boolean>)
  clearQueryOnUnmount?: boolean
  widgets?: (() => Promise<{
    default: React.ComponentType<any>
    config: WidgetConfig
  }>)[]
}

export const packageJSONSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  version: z.string(),
  description: z.string(),
  author: z.string(),
  scripts: z
    .object({
      types: z.string()
    })
    .optional(),
  dependencies: z.record(z.string(), z.string()).optional(),
  devDependencies: z.record(z.string(), z.string()).optional(),
  lifeforge: z.object({
    icon: z.string(),
    category: z.string(),
    APIKeyAccess: z
      .record(
        z.string(),
        z.object({
          usage: z.string(),
          required: z.boolean()
        })
      )
      .optional()
  })
})

export interface ModuleCategory {
  title: string
  items: (ModuleConfig & {
    name: string
    displayName: string
    version: string
    author: string
    description: string
    icon: string
    category: string
    APIKeyAccess?: Record<string, { usage: string; required: boolean }>
  })[]
}
