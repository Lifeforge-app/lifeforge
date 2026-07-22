import { useEffect } from 'react'

import { useAuth } from '@lifeforge/api'
import { bootstrapModules, useFederation } from '@lifeforge/federation'

import { CORE_MODULES } from '@/system'

export default function CoreFederationProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { auth } = useAuth()

  const {
    setModuleGroups,
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
      const result = await bootstrapModules(
        import.meta.env.VITE_API_HOST || '',
        CORE_MODULES
      )

      setModuleGroups(result.moduleGroups)
      setGlobalProviders(result.globalProviders)
      setCategoryTranslations(result.categoryTranslations)
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load modules'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!auth) {
      setLoading(false)

      return
    }

    fetchModules()
    refetch.current = fetchModules
  }, [auth])

  return children
}
