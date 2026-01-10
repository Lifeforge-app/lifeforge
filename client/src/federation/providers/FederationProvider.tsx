import { ErrorScreen, LoadingScreen } from 'lifeforge-ui'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ModuleCategory } from 'shared'

import type { GlobalProviderComponent } from '../loaders/loadGlobalProvider'
import loadModules from '../loaders/loadModules'

interface FederationContextValue {
  modules: ModuleCategory[]
  globalProviders: GlobalProviderComponent[]
  refetch: () => Promise<void>
}

// Default value for HMR safety - prevents crashes when context is unavailable during hot reload
const defaultValue: FederationContextValue = {
  modules: [],
  globalProviders: [],
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

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<Error | null>(null)

  const fetchModules = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await loadModules()

      setModules(result.routes)
      setGlobalProviders(result.globalProviders)
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
      refetch: fetchModules
    }),
    [modules, globalProviders]
  )

  // Always wrap in Provider to prevent HMR issues where context disappears
  return (
    <FederationContext value={value}>
      {loading ? (
        <LoadingScreen message="Loading modules..." />
      ) : error ? (
        <ErrorScreen showRetryButton message={error.message} />
      ) : (
        children
      )}
    </FederationContext>
  )
}

export default FederationProvider
