import { z } from 'zod'

import { modulePackageJSONSchema } from './module.types'
import { widgetConfigSchema } from './widget.types'

export const bundledWidgetSchema = widgetConfigSchema.extend({
  componentName: z.string()
})

export const moduleBundledMetadataSchema = z.object({
  hasProvider: z.boolean(),
  hidden: z.boolean().optional(),
  subsection: z
    .array(
      z.object({
        label: z.string(),
        icon: z.string(),
        path: z.string()
      })
    )
    .optional(),
  widgets: z.array(bundledWidgetSchema),
  package: modulePackageJSONSchema,
  hasServer: z.boolean()
})

export type BundledWidget = z.infer<typeof bundledWidgetSchema>

export type ModuleBundledMetadata = z.infer<typeof moduleBundledMetadataSchema>
