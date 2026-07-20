import { z } from 'zod'

const apiKeyAccessSchema = z.record(
  z.string(),
  z.object({ usage: z.string(), required: z.boolean() })
)

const modulePackageJSONSchema = z.object({
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

const moduleWidgetSchema = z.object({
  id: z.string(),
  icon: z.string(),
  minW: z.number().optional(),
  minH: z.number().optional(),
  maxW: z.number().optional(),
  maxH: z.number().optional(),
  moduleName: z.string(),
  componentName: z.string()
})

const widgetConfigSchema = moduleWidgetSchema.omit({
  moduleName: true,
  componentName: true
})

const moduleEntrySchema = z.object({
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
  supportedLangs: z.array(z.string()),
  widgets: z.array(moduleWidgetSchema)
})

const moduleManifestSchema = moduleEntrySchema
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
    APIKeyAccess: true
  })
  .extend({
    isDevMode: z.boolean()
  })

const moduleSchema = moduleEntrySchema
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
    hasSource: true
  })
  .extend({
    isDevMode: z.boolean()
  })

type APIKeyAccess = z.infer<typeof apiKeyAccessSchema>

type ModulePackageJSON = z.infer<typeof modulePackageJSONSchema>

type ModuleWidget = z.infer<typeof moduleWidgetSchema>

type WidgetConfig = z.infer<typeof widgetConfigSchema>

type ModuleEntry = z.infer<typeof moduleEntrySchema>

type ModuleManifest = z.infer<typeof moduleManifestSchema>

type Module = z.infer<typeof moduleSchema>

export {
  apiKeyAccessSchema,
  modulePackageJSONSchema,
  moduleEntrySchema,
  moduleManifestSchema,
  moduleSchema,
  moduleWidgetSchema,
  widgetConfigSchema
}

export type {
  APIKeyAccess,
  ModulePackageJSON,
  ModuleWidget,
  WidgetConfig,
  ModuleEntry,
  ModuleManifest,
  Module
}
