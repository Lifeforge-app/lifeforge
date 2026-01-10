import { GLOBAL_PROVIDERS } from '@/routes'

function ExternalModuleProviders({ children }: { children: React.ReactNode }) {
  return GLOBAL_PROVIDERS.reduce<React.ReactNode>(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  )
}

export default ExternalModuleProviders
