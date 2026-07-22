import { checkModulesAvailability } from '@functions/modules/checkModulesAvailability'
import { ModuleRegistry } from '@functions/modules/moduleRegistry'
import z from 'zod'

import {
  moduleManifestSchema,
  moduleSchema,
  moduleWidgetSchema
} from '@lifeforge/configs'

import forge from '../forge'

export const manifest = forge
  .query({
    description: 'Get installed modules manifest for runtime loading',
    input: {},
    output: {
      OK: z.object({
        modules: z.array(moduleManifestSchema)
      })
    }
  })
  .callback(async ({ response }) =>
    response.ok({ modules: ModuleRegistry.manifests })
  )

export const list = forge
  .query({
    description: 'List installed modules with metadata',
    input: {},
    output: {
      OK: z.array(moduleSchema)
    }
  })
  .callback(async ({ response }) => response.ok(ModuleRegistry.list))

export const checkModuleAvailability = forge
  .query({
    description: 'Check if a module is available (installed)',
    input: {
      query: z.object({
        moduleId: z.string().min(1)
      })
    },
    output: {
      OK: z.boolean()
    }
  })
  .callback(async ({ query: { moduleId }, response }) =>
    response.ok(await checkModulesAvailability(moduleId))
  )

export const widgets = forge
  .query({
    description: 'Get all available widgets configuration',
    input: {},
    output: {
      OK: z.array(moduleWidgetSchema)
    }
  })
  .callback(async ({ response }) => response.ok(ModuleRegistry.widgets))
