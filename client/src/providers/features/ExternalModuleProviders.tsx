import { useFederation } from 'shared'

function ExternalModuleProviders({ children }: { children: React.ReactNode }) {
  const { globalProviders } = useFederation()

  return globalProviders.reduce<React.ReactNode>(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  )
}

export default ExternalModuleProviders
