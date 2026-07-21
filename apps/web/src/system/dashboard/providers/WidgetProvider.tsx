import {
  createContext,
  lazy,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'

import { loadRemoteModuleConfig, useFederation } from '@lifeforge/federation'
import { LoadingScreen } from '@lifeforge/ui'

import { devModeImports, devModePkgs } from '@/core/utils/devModeImports'
import forgeAPI from '@/core/utils/forgeAPI'

export interface WidgetEntry {
  moduleName: string
  component: React.ComponentType<any>
  icon: string
  minW: number
  minH: number
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
  const { moduleGroups } = useFederation()

  const [federatedWidgets, setFederatedWidgets] = useState<
    Record<string, WidgetEntry>
  >({})

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFederatedWidgets() {
      setLoading(true)

      try {
        const serverWidgets = await forgeAPI.modules.widgets.query()
        const loadedWidgets: Record<string, WidgetEntry> = {}

        for (const widget of serverWidgets) {
          const item = moduleGroups
            .flatMap(cat => cat.items)
            .find(i => i.name === widget.moduleName)

          if (!item || !item.rawModule) continue

          const rawModule = item.rawModule

          const LazyComponent = lazy(async () => {
            const unwrapped = await loadRemoteModuleConfig(
              rawModule,
              devModeImports,
              devModePkgs
            )

            for (const widgetImportFn of unwrapped.widgets || []) {
              const widgetModule = await widgetImportFn()

              if (widgetModule.config.id === widget.id) {
                return { default: widgetModule.default }
              }
            }

            throw new Error(
              `Widget ${widget.id} not found in module ${widget.moduleName}`
            )
          })

          loadedWidgets[widget.id] = {
            moduleName: widget.moduleName,
            component: LazyComponent,
            icon: widget.icon,
            minW: widget.minW || 1,
            minH: widget.minH || 1,
            maxW: widget.maxW,
            maxH: widget.maxH
          }
        }

        setFederatedWidgets(loadedWidgets)
      } catch (e) {
        console.error('Failed to load federated widgets:', e)
      } finally {
        setLoading(false)
      }
    }

    if (moduleGroups.length > 0) {
      loadFederatedWidgets()
    } else {
      setLoading(false)
    }
  }, [moduleGroups])

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
