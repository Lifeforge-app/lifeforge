import type { WidgetConfig } from 'shared'

const widgets = import.meta.glob([
  '../**/widgets/*.tsx',
  './widgets/*.tsx',
  '../../../../apps/**/client/widgets/*.tsx'
])

const widgetsPromises = Object.entries(widgets).map(async ([, importer]) => {
  const mod = (await importer()) as { default: any; config: WidgetConfig }

  return {
    config: mod.config,
    component: mod.default
  }
})

const DASHBOARD_WIDGETS: {
  [key: string]: {
    component: React.FC
    namespace: string | null
    icon: string
    minW?: number
    minH?: number
    maxW?: number
    maxH?: number
  }
} = {}

await Promise.all(widgetsPromises).then(resolvedWidgets => {
  resolvedWidgets.forEach(({ config, component }) => {
    if (!config) {
      console.error('Widget is missing config:', component)
    }

    DASHBOARD_WIDGETS[config.id] = {
      component,
      namespace: config.namespace || null,
      icon: config.icon,
      minW: config.minW,
      minH: config.minH,
      maxW: config.maxW,
      maxH: config.maxH
    }
  })
})

export default DASHBOARD_WIDGETS
