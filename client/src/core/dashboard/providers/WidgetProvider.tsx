import {
  createContext,
  lazy,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import { useFederation, widgetConfigSchema } from '@lifeforge/shared'
import { LoadingScreen } from '@lifeforge/ui'

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

function WidgetProvider({ children }: { children: React.ReactNode }) {
  const { modules } = useFederation()

  const [federatedWidgets, setFederatedWidgets] = useState<
    Record<string, WidgetEntry>
  >({})

  const [loading, setLoading] = useState(true)

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

                const parsedConfig = widgetConfigSchema.safeParse(
                  widgetModule.config
                )

                if (parsedConfig.success) {
                  const config = parsedConfig.data

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
                } else {
                  console.warn(
                    `Failed to validate widget config for module ${category.title}/${item.name}:`,
                    parsedConfig.error.format()
                  )
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
      widgets: federatedWidgets,
      loading
    }),
    [federatedWidgets, loading]
  )

  if (loading) {
    return <LoadingScreen message="Loading widgets" />
  }

  return <WidgetContext value={value}>{children}</WidgetContext>
}

export default WidgetProvider
