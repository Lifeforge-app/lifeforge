import React, { useEffect, useState } from 'react'

import type { ModuleGroup } from '@lifeforge/configs'
import {
  type FederatedModule,
  loadRemoteModuleConfig,
  useFederation
} from '@lifeforge/federation'

import { devModeImports, devModePkgs } from '@/core/utils/devModeImports'

function FallbackProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function LazyProvider({
  item,
  children
}: {
  item: ModuleGroup['items'][number] & { rawModule?: FederatedModule }
  children: React.ReactNode
}) {
  const [Provider, setProvider] = useState<React.ComponentType<{
    children: React.ReactNode
  }> | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      if (!item.rawModule || !item.rawModule.hasProvider) {
        setProvider(() => FallbackProvider)

        return
      }

      try {
        const unwrapped = await loadRemoteModuleConfig(
          item.rawModule,
          devModeImports,
          devModePkgs
        )

        if (!active) return

        setProvider(() => unwrapped.provider || FallbackProvider)
      } catch (err) {
        console.error(`Failed to load provider for ${item.name}:`, err)

        if (!active) return

        setProvider(() => FallbackProvider)
      }
    }
    load()

    return () => {
      active = false
    }
  }, [item])

  if (!Provider) {
    return <>{children}</>
  }

  return <Provider>{children}</Provider>
}

export default function ExternalModuleProviders({
  children
}: {
  children: React.ReactNode
}) {
  const { moduleGroups, globalProviders } = useFederation()

  const federatedItems = moduleGroups
    .flatMap(cat => cat.items)
    .filter(item => item.rawModule)

  const lazyWrapped = federatedItems.reduce<React.ReactNode>(
    (acc, item) => <LazyProvider item={item}>{acc}</LazyProvider>,
    children
  )

  return globalProviders.reduce<React.ReactNode>(
    (acc, ProviderComponent) => <ProviderComponent>{acc}</ProviderComponent>,
    lazyWrapped
  )
}
