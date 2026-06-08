import z from 'zod'

export const widgetConfigSchema = z.object({
  namespace: z.string().optional(),
  id: z.string(),
  icon: z.string(),
  minW: z.number().int().positive().optional(),
  minH: z.number().int().positive().optional(),
  maxW: z.number().int().positive().optional(),
  maxH: z.number().int().positive().optional()
})

type WidgetConfig = z.infer<typeof widgetConfigSchema>

export type { WidgetConfig as default }
