import {
  __federation_method_getRemote as getRemote,
  __federation_method_unwrapDefault as unwrapModule
  // @ts-expect-error - Virtual federation methods
} from 'virtual:__federation__'

export type GlobalProviderComponent = React.FC<{ children: React.ReactNode }>

/**
 * Attempts to load a GlobalProvider from a federated module
 * Returns null if the module doesn't expose a GlobalProvider
 */
export async function loadGlobalProvider(
  moduleName: string
): Promise<GlobalProviderComponent | null> {
  const remoteName = moduleName.replace(/-+/g, '_')

  try {
    const remoteModule = await getRemote(remoteName, './GlobalProvider')

    const unwrapped = await unwrapModule(remoteModule)

    return (unwrapped as GlobalProviderComponent) ?? null
  } catch {
    // Module doesn't expose GlobalProvider - this is expected for most modules
    return null
  }
}
