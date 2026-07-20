import { useFederation } from '@lifeforge/federation'

import LazyModuleProvider from './LazyModuleProvider'

function ExternalModuleProviders({ children }: { children: React.ReactNode }) {
  const { modules, globalProviders } = useFederation()

  const federatedItems = modules
    .flatMap(cat => cat.items)
    .filter(item => item.rawModule)

  const lazyWrapped = federatedItems.reduce<React.ReactNode>(
    (acc, item) => <LazyModuleProvider item={item}>{acc}</LazyModuleProvider>,
    children
  )

  return globalProviders.reduce<React.ReactNode>(
    (acc, Provider) => <Provider>{acc}</Provider>,
    lazyWrapped
  )
}

export default ExternalModuleProviders
