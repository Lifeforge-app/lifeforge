import { LoadingScreen } from 'lifeforge-ui'
import {
  createContext,
  lazy,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import type { WidgetConfig } from 'shared'

import { useFederation } from '@/federation'

import ClockWidget, { config as clockConfig } from '../widgets/Clock'
import DateWidget, { config as dateConfig } from '../widgets/Date'
import QuotesWidget, { config as quotesConfig } from '../widgets/Quotes'

export interface WidgetEntry {
  component: React.FC<{ dimension: { w: number; h: number } }>
  namespace: string | null
  icon: string
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
}

interface WidgetContextValue {
  widgets: Record<string, WidgetEntry>
  loading: boolean
}

// Default value for HMR safety - prevents crashes when context is unavailable during hot reload
const defaultValue: WidgetContextValue = {
  widgets: {},
  loading: true
}

const WidgetContext = createContext<WidgetContextValue>(defaultValue)

export function useWidgets(): WidgetContextValue {
  return useContext(WidgetContext)
}

const CORE_WIDGETS: Array<{
  component: React.FC<{ dimension: { w: number; h: number } }>
  config: WidgetConfig
}> = [
  { component: ClockWidget, config: clockConfig },
  { component: DateWidget, config: dateConfig },
  { component: QuotesWidget, config: quotesConfig }
]

function WidgetProvider({ children }: { children: React.ReactNode }) {
  const { modules } = useFederation()

  const [federatedWidgets, setFederatedWidgets] = useState<
    Record<string, WidgetEntry>
  >({})

  const [loading, setLoading] = useState(true)

  // Core widgets (static, always available)
  const coreWidgets = useMemo(() => {
    const result: Record<string, WidgetEntry> = {}

    for (const { component, config } of CORE_WIDGETS) {
      result[config.id] = {
        component,
        namespace: config.namespace || null,
        icon: config.icon,
        minW: config.minW,
        minH: config.minH,
        maxW: config.maxW,
        maxH: config.maxH
      }
    }

    return result
  }, [])

  // Load federated widgets asynchronously
  useEffect(() => {
    async function loadFederatedWidgets() {
      setLoading(true)

      const loadedWidgets: Record<string, WidgetEntry> = {}

      for (const category of modules) {
        for (const item of category.items) {
          if (item.widgets && item.widgets.length > 0) {
            for (const widgetImportFn of item.widgets) {
              try {
                // Call the import function to get the module
                const widgetModule = await widgetImportFn()

                const config = widgetModule.config

                if (config?.id) {
                  // Wrap the component with lazy() for proper React Suspense support
                  const LazyComponent = lazy(widgetImportFn)

                  loadedWidgets[config.id] = {
                    component: LazyComponent,
                    namespace: config.namespace || null,
                    icon: config.icon,
                    minW: config.minW,
                    minH: config.minH,
                    maxW: config.maxW,
                    maxH: config.maxH
                  }
                }
              } catch (e) {
                console.warn('Failed to load widget:', e)
              }
            }
          }
        }
      }

      setFederatedWidgets(loadedWidgets)
      setLoading(false)
    }

    if (modules.length > 0) {
      loadFederatedWidgets()
    } else {
      setLoading(false)
    }
  }, [modules])

  const value = useMemo(
    () => ({
      widgets: { ...coreWidgets, ...federatedWidgets },
      loading
    }),
    [coreWidgets, federatedWidgets, loading]
  )

  if (loading) {
    return <LoadingScreen message="Loading widgets" />
  }

  return <WidgetContext value={value}>{children}</WidgetContext>
}

export default WidgetProvider
