import type React from 'react'
import { z } from 'zod'

import type { WidgetConfig } from './widget_config.types'

export interface ModuleConfig {
  provider?: React.LazyExoticComponent<
    React.ComponentType<{ children: React.ReactNode }>
  >
  routes: Record<string, React.LazyExoticComponent<React.ComponentType>>
  subsection?: {
    label: string
    icon: string
    path: string
  }[]
  hidden?: boolean
  disabled?: boolean | (() => Promise<boolean>)
  clearQueryOnUnmount?: boolean
  contract?: any
  widgets?: (() => Promise<{
    default: React.ComponentType
    config: WidgetConfig
  }>)[]
}

export const moduleConfigSchema: z.ZodType<ModuleConfig> = z.object({
  provider: z.any().optional(),
  routes: z.record(z.string(), z.any()),
  subsection: z
    .array(
      z.object({
        label: z.string(),
        icon: z.string(),
        path: z.string()
      })
    )
    .optional(),
  hidden: z.boolean().optional(),
  disabled: z
    .union([
      z.boolean(),
      z.custom<() => Promise<boolean>>(val => typeof val === 'function')
    ])
    .optional(),
  clearQueryOnUnmount: z.boolean().optional(),
  contract: z.any().optional(),
  widgets: z
    .array(
      z.custom<
        () => Promise<{
          default: React.ComponentType
          config: WidgetConfig
        }>
      >(val => typeof val === 'function')
    )
    .optional()
})

export interface ModuleCategory {
  title: string
  items: (ModuleConfig & {
    name: string
    moduleId?: string
    displayName: string
    version: string
    author: string
    description: string
    icon: string
    category: string
    APIKeyAccess?: Record<string, { usage: string; required: boolean }>
  })[]
}
