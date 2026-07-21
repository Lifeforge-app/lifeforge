import type React from 'react'
import { z } from 'zod'

import { widgetConfigSchema } from './widget.types'

// ==========================================
// 1. Client-Side Module Configuration
// ==========================================

export const moduleConfigSchema = z.object({
  provider: z
    .custom<
      React.LazyExoticComponent<
        React.ComponentType<{ children: React.ReactNode }>
      >
    >()
    .optional(),
  routes: z.record(
    z.string(),
    z.custom<React.LazyExoticComponent<React.ComponentType>>()
  ),
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
          default: React.ComponentType<any>
          config: z.infer<typeof widgetConfigSchema>
        }>
      >(val => typeof val === 'function')
    )
    .optional()
})

export type ModuleConfig = z.infer<typeof moduleConfigSchema>

// ==========================================
// 2. Server-Side Module Registry / Manifests
// ==========================================

export const apiKeyAccessSchema = z.record(
  z.string(),
  z.object({ usage: z.string(), required: z.boolean() })
)

export const modulePackageJSONSchema = z.object({
  name: z.string(),
  displayName: z.string(),
  version: z.string(),
  description: z.string(),
  author: z.string(),
  lifeforge: z.object({
    icon: z.string(),
    category: z.string(),
    APIKeyAccess: apiKeyAccessSchema.optional()
  })
})

export const moduleWidgetSchema = widgetConfigSchema.extend({
  moduleName: z.string(),
  componentName: z.string()
})

export const moduleEntrySchema = z.object({
  name: z.string(),
  moduleId: z.string(),
  displayName: z.string(),
  version: z.string(),
  description: z.string(),
  author: z.string(),
  icon: z.string(),
  category: z.string(),
  isInternal: z.boolean(),
  remoteEntryUrl: z.string(),
  APIKeyAccess: apiKeyAccessSchema.optional(),
  hasDist: z.boolean(),
  hasSource: z.boolean(),
  hasProvider: z.boolean(),
  supportedLangs: z.array(z.string()),
  widgets: z.array(moduleWidgetSchema)
})

export const moduleManifestSchema = moduleEntrySchema
  .pick({
    name: true,
    moduleId: true,
    displayName: true,
    version: true,
    description: true,
    author: true,
    icon: true,
    category: true,
    remoteEntryUrl: true,
    isInternal: true,
    APIKeyAccess: true,
    hasProvider: true
  })
  .extend({
    isDevMode: z.boolean()
  })

export const moduleSchema = moduleEntrySchema
  .pick({
    name: true,
    moduleId: true,
    displayName: true,
    version: true,
    description: true,
    author: true,
    icon: true,
    category: true,
    isInternal: true,
    hasDist: true,
    hasSource: true,
    hasProvider: true
  })
  .extend({
    isDevMode: z.boolean()
  })

export type APIKeyAccess = z.infer<typeof apiKeyAccessSchema>

export type ModulePackageJSON = z.infer<typeof modulePackageJSONSchema>

export type ModuleWidget = z.infer<typeof moduleWidgetSchema>

export type ModuleEntry = z.infer<typeof moduleEntrySchema>

export type ModuleManifest = z.infer<typeof moduleManifestSchema>

export type Module = z.infer<typeof moduleSchema>

// ==========================================
// 3. Module Categorization Category Types
// ==========================================

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
