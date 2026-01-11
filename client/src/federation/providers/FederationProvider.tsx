import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ModuleCategory } from 'shared'

import type { GlobalProviderComponent } from '../loaders/loadGlobalProvider'
import loadModules from '../loaders/loadModules'
import type { CategoryOrder } from '../utils/sortRoutes'

// Force full reload instead of HMR to ensure clean state
if (import.meta.hot) {
  import.meta.hot.invalidate()
}

interface FederationContextValue {
  modules: ModuleCategory[]
  globalProviders: GlobalProviderComponent[]
  categoryTranslations: CategoryOrder
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

const defaultValue: FederationContextValue = {
  modules: [],
  globalProviders: [],
  categoryTranslations: {},
  loading: true,
  error: null,
  refetch: async () => {}
}

const FederationContext = createContext<FederationContextValue>(defaultValue)

export function useFederation(): FederationContextValue {
  return useContext(FederationContext)
}

function FederationProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<ModuleCategory[]>([])

  const [globalProviders, setGlobalProviders] = useState<
    GlobalProviderComponent[]
  >([])

  const [categoryTranslations, setCategoryTranslations] =
    useState<CategoryOrder>({})

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<Error | null>(null)

  async function fetchModules() {
    setLoading(true)
    setError(null)

    try {
      const result = await loadModules()

      setModules(result.routes)
      setGlobalProviders(result.globalProviders)
      setCategoryTranslations(result.categoryTranslations)
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load modules'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchModules()
  }, [])

  const value = useMemo(
    () => ({
      modules,
      globalProviders,
      categoryTranslations,
      loading,
      error,
      refetch: fetchModules
    }),
    [modules, globalProviders, categoryTranslations, loading, error]
  )

  return <FederationContext value={value}>{children}</FederationContext>
}

export default FederationProvider
