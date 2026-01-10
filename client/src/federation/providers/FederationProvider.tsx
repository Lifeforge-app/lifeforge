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

const FederationContext = createContext<FederationContextValue | null>(null)

export function useFederation(): FederationContextValue {
  const context = useContext(FederationContext)

  if (!context) {
    throw new Error('useFederation must be used within a FederationProvider')
  }

  return context
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

  if (loading) {
    return <LoadingScreen message="Loading modules..." />
  }

  if (error) {
    return <ErrorScreen message={error.message} showRetryButton={true} />
  }

  return <FederationContext value={value}>{children}</FederationContext>
}

export default FederationProvider
