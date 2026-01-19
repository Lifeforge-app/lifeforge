import { useEffect } from 'react'
import { useFederation } from 'shared'

import loadModules from '../loaders/loadModules'

// Force full reload instead of HMR to ensure clean state
if (import.meta.hot) {
  import.meta.hot.invalidate()
}

export default function CoreFederationProvider({
  children
}: {
  children: React.ReactNode
}) {
  const {
    setModules,
    setGlobalProviders,
    setCategoryTranslations,
    setLoading,
    setError,
    refetch
  } = useFederation()

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
    refetch.current = fetchModules
  }, [])

  return children
}
