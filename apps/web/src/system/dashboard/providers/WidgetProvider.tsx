import {
  createContext,
  lazy,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import { useFederation, widgetConfigSchema } from '@lifeforge/federation'
import { LoadingScreen } from '@lifeforge/ui'

export interface WidgetEntry {
  component: React.FC<{ dimension: { w: number; h: number } }>
  moduleName: string
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

  useEffect(() => {
    async function loadFederatedWidgets() {
      setLoading(true)

      const loadedWidgets: Record<string, WidgetEntry> = {}

      for (const category of modules) {
        for (const item of category.items) {
          if (item.widgets && item.widgets.length > 0) {
            for (const widgetImportFn of item.widgets) {
              try {
                const widgetModule = await widgetImportFn()

                const parsedConfig = widgetConfigSchema.safeParse(
                  widgetModule.config
                )

                if (parsedConfig.success) {
                  const config = parsedConfig.data

                  const LazyComponent = lazy(widgetImportFn)

                  loadedWidgets[config.id] = {
                    moduleName: item.name,
                    component: LazyComponent,
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
