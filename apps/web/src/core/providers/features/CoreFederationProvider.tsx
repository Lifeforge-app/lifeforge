import { useEffect } from 'react'

import { useAuth } from '@lifeforge/api'
import {
  type ModuleConfig,
  loadModules,
  useFederation
} from '@lifeforge/federation'

import forgeAPI from '@/core/utils/forgeAPI'
import accountSettings from '@/system/accountSettings/manifest'
import apiKeys from '@/system/apiKeys/manifest'
import backups from '@/system/backups/manifest'
import dashboard from '@/system/dashboard/manifest'
import documentation from '@/system/documentation/manifest'
import moduleManager from '@/system/moduleManager/manifest'
import personalization from '@/system/personalization/manifest'

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
      '../../../../../../modules/*/client/manifest.ts',
      { eager: false }
    )
  : {}

export default function CoreFederationProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { auth } = useAuth()

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
    if (!auth) {
      setLoading(false)

      return
    }

    fetchModules()
    refetch.current = fetchModules
  }, [auth])

  return children
}
