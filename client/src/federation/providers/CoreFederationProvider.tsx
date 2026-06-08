import { useEffect } from 'react'

import {
  type ModuleConfig,
  loadModules,
  useFederation
} from '@lifeforge/federation'

import accountSettings from '@/core/accountSettings/manifest'
import apiKeys from '@/core/apiKeys/manifest'
import backups from '@/core/backups/manifest'
import dashboard from '@/core/dashboard/manifest'
import documentation from '@/core/documentation/manifest'
import moduleManager from '@/core/moduleManager/manifest'
import personalization from '@/core/personalization/manifest'
import forgeAPI from '@/forgeAPI'

const coreModules = [
  accountSettings,
  apiKeys,
  backups,
  dashboard,
  documentation,
  personalization,
  moduleManager
]

const devModeImports = import.meta.env.DEV
  ? import.meta.glob<{ default: ModuleConfig }>(
      '../../../../apps/*/client/manifest.ts',
      { eager: false }
    )
  : {}

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
      const result = await loadModules(forgeAPI, coreModules, devModeImports)

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
