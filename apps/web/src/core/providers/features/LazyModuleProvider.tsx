import { useEffect, useState } from 'react'

import {
  type FederatedModule,
  type ModuleCategory,
  loadModuleConfig
} from '@lifeforge/federation'

import { devModeImports, devModePkgs } from './CoreFederationProvider'

const FallbackProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>
FallbackProvider.displayName = 'FallbackProvider'

export default function LazyModuleProvider({
  item,
  children
}: {
  item: ModuleCategory['items'][number] & { rawModule?: FederatedModule }
  children: React.ReactNode
}) {
  const [Provider, setProvider] = useState<React.ComponentType<{
    children: React.ReactNode
  }> | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      if (!item.rawModule) {
        if (active) {
          setProvider(() => FallbackProvider)
        }

        return
      }

      try {
        const unwrapped = await loadModuleConfig(
          item.rawModule,
          devModeImports,
          devModePkgs
        )

        if (active) {
          setProvider(
            () => unwrapped.provider || FallbackProvider
          )
        }
      } catch (err) {
        console.error(`Failed to load provider for ${item.name}:`, err)

        if (active) {
          setProvider(() => FallbackProvider)
        }
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
